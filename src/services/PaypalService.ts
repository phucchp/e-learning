import { Inject, Service } from 'typedi';
import fetch from "node-fetch";
import { NotEnoughAuthority, NotFound, ServerError, UnprocessableError } from '../utils/CustomError';
import { CourseService } from './CourseService';
import { ICourseService } from './interfaces/ICourseService';
import { PaymentService } from './PaymentService';
import { IPaymentService } from './interfaces/IPaymentService';
import { PaymentRepository } from '../repositories/PaymentRepository';
import { IPaymentDetailRepository } from '../repositories/interfaces/IPaymentDetailRepository';
import { IPaymentRepository } from '../repositories/interfaces/IPaymentRepository';
import { PaymentDetailRepository } from '../repositories/PaymentDetailRepository';
import { IEnrollmentService } from './interfaces/IEnrollmentService';
import { EnrollmentService } from './EnrollmentService';
import { UserService } from './UserService';
import { IUserService } from './interfaces/IUserService';
import Mail from '../utils/Mail';

@Service()
export class PaypalService {

    @Inject(() => CourseService)
	private courseService!: ICourseService;

    @Inject(() => EnrollmentService)
	private enrollmentService!: IEnrollmentService;

    @Inject(() => PaymentService)
	private paymentService!: IPaymentService;

    @Inject(() => PaymentRepository)
	private paymentRepository!: IPaymentRepository;

    @Inject(() => PaymentDetailRepository)
	private paymentDetailRepository!: IPaymentDetailRepository;

    @Inject(() => UserService)
	private userService!: IUserService;

    @Inject(() => Mail)
	private mail!: Mail;

    /**
    * Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
    * @see https://developer.paypal.com/api/rest/authentication/
    */
    async generateAccessToken(): Promise<string> {
        const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_BASE_API } = process.env;

        if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET || !PAYPAL_BASE_API) {
            throw new Error("MISSING_API_CREDENTIALS PAYPAL");
        }

        const auth = Buffer.from(
            PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
          ).toString("base64");
          const response = await fetch(`${PAYPAL_BASE_API}/v1/oauth2/token`, {
            method: "POST",
            body: "grant_type=client_credentials",
            headers: {
              Authorization: `Basic ${auth}`,
            },
          });
          
          const data = await response.json() as { access_token: string }; // Type assertion
          if(!data) {
            throw new ServerError('Error when get AccessToken from Paypal!');
          }

          return data.access_token;
    }

    /**
    * Create an order to start the transaction.
    * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
    */
    async createOrder(userId: number, courseIds: string[]): Promise<any> {
        // use the cart information passed from the front-end to calculate the purchase unit details
        // Viết 1 hàm tính tổng tiền + tạo mảng items từ list course_id từ client gửi lên
        // Viết hàm tạo payment and payment details
        const {totalPrice, items} = await this.courseService.createDataCourseForPayment(courseIds);
        const accessToken = await this.generateAccessToken();
        const { PAYPAL_BASE_API, CLIENT_URL } = process.env;
        if(!PAYPAL_BASE_API) {
            throw new Error("MISSING_API_CREDENTIALS PAYPAL");;
        }
        const url = `${PAYPAL_BASE_API}/v2/checkout/orders`;
        const payload = {
        intent: "CAPTURE",
        purchase_units: [
            {
            reference_id: `${userId}`,
            amount: {
                currency_code: "USD",
                value: `${totalPrice}`,
                breakdown: {
                    item_total: {
                        currency_code: "USD",
                        value: `${totalPrice}`,
                    },
                },
            },
            items: items
            },
        ],
        application_context: {
            brand_name: 'ALPHA E-LEARNING',
            landing_page: 'LOGIN',
            user_action: 'PAY_NOW',
            return_url: CLIENT_URL+'/bill' || 'http://localhost:3000/bill',
            cancel_url: CLIENT_URL+'/bill' || 'http://localhost:3000/bill/cancel',
        },
        };
        
        const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
            // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
            // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
            // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
            // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
        },
        method: "POST",
        body: JSON.stringify(payload),
        });
        const jsonResponse = await response.json();
        if(response.status === 200 || response.status === 201 || jsonResponse.status == 'CREATED') {
            const payment = await this.paymentService.createPayment(userId, totalPrice, 'Paypal', jsonResponse.id, 'Order infor', jsonResponse.status, courseIds);
        }
        return {
            jsonResponse,
            httpStatusCode: response.status,
        };
    };
 
    /**
    * Capture payment for the created order to complete the transaction.
    * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
    */
    async captureOrder(orderID: string): Promise<any> {
        // Order thành công thì add user vào enrollment -> remove các courses khỏi cart
        const accessToken = await this.generateAccessToken();
        const { PAYPAL_BASE_API } = process.env;
        if(!PAYPAL_BASE_API) {
            throw new Error("MISSING_API_CREDENTIALS PAYPAL");;
        }
        const url = `${PAYPAL_BASE_API}/v2/checkout/orders/${orderID}/capture`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
                // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
                // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
                // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
                // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
            },
        });
        const jsonResponse = await response.json();
        // check status
        if(jsonResponse.status === 'COMPLETED') {
            // check id transaction
            // Get order details
            const transactionId = jsonResponse.id;
            const payment = await this.paymentService.getPaymentByTransactionId(transactionId);
            if(!payment) {
                throw new ServerError('No payment match with transaction');
            }

            const paymentDetails = await this.getOrderPaypalDetails(transactionId);
            if(paymentDetails && paymentDetails.status === "COMPLETED") {
                // Check userId in order match with userId in payment
                if(Number(paymentDetails.purchase_units[0].reference_id) !== payment.userId){
                    throw new NotEnoughAuthority('User not matching with payment');
                }
                // Check totalPrice is match
                if(Number(paymentDetails.purchase_units[0].amount.value) !== payment.price) {
                    throw new NotFound('Total price in payment is not match with order paypal');
                }
                const courseIds: number[] = [];
                for(const item of paymentDetails.purchase_units[0].items) {
                    courseIds.push(item.name);
                }
                // Add user enrollment course
                await this.enrollmentService.addEnrollmentCourseInBulk(payment.userId, courseIds);
                // Update status payment
                payment.isPayment = true;
                payment.status = paymentDetails.status;
                payment.orderInfor = `Completed in ${Date.now()}, payer_email : ${paymentDetails.payer.email_address}, payer_id : ${paymentDetails.payer.payer_id}`;
                await this.paymentService.updatePayment(payment);
                // Send mail
                const user = await this.userService.getUserInformation(payment.userId);
                const courses = await this.courseService.getCoursesByCourseIds(courseIds);
                await this.mail.sendBill(user, courses, paymentDetails); 
                return payment;
            }
        }
        return jsonResponse;
    };

    /**
     * Using continute order if user is ordered before
     * @param userId 
     * @returns 
     */
    async reCreateOrder(userId: number): Promise<any> {
        const paymentNotCheckout = await this.paymentService.getPaymentNotCheckoutInformation(userId);
        const courseIds: string[] = [];
        if(!paymentNotCheckout) {
             throw new NotFound('No payment not checkout to continue order!');
        }
        // Nếu có payment not checkout thì kiểm tra transactionId xem còn dùng được không
        const orderID = paymentNotCheckout.transactionId;
        // get orrder detail https://api-m.sandbox.paypal.com/v2/checkout/orders/4B296531PA329843E
        // Check http status -> 404 : order đó đã hết hạn
        // Nếu trả về 200 thì check status là COMPLETED hay CREATED
        // Nếu CREATED thì return ID về để user tiếp tục thanh toán
        // Nếu Not found thì dựa vào courseIds và userId để gọi hàm createOrder để tạo order mới
        // Note : Xoá payment and payment details cũ trước khi tạo lại
        const accessToken = await this.generateAccessToken();
        const { PAYPAL_BASE_API } = process.env;
        if(!PAYPAL_BASE_API) {
            throw new Error("MISSING_API_CREDENTIALS PAYPAL");
        }
        const url = `${PAYPAL_BASE_API}/v2/checkout/orders/${orderID}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const jsonResponse = await response.json();
        if(response.status == 404) {
            // If order is expired, recreated
            // 1. Get courseIds from payment_details
            for(const paymentDetail of paymentNotCheckout.paymentDetails) {
                courseIds.push(paymentDetail.course.courseId);
            }
            // 2. Remove old payment and payment details
            //  2.1 Remove order details of order
            await this.paymentDetailRepository.deletePaymentDetailsByPaymentId(paymentNotCheckout.id);
            //  2.2 Remove order
            await this.paymentRepository.deleteInstance(paymentNotCheckout, true);
            // 3. Call createOrder to recreate
            return await this.createOrder(userId, courseIds);
        }

        if(jsonResponse.status == "COMPLETED") {
            throw new Error('Payment is already completed');
        }

        return {
            jsonResponse: {
                id: orderID,
                status: jsonResponse.status
            },
            httpStatusCode: response.status,
        };

    }

    async getOrderPaypalDetails(orderID: string): Promise<any> {
        const { PAYPAL_BASE_API } = process.env;
        if(!PAYPAL_BASE_API) {
            throw new Error("MISSING_API_CREDENTIALS PAYPAL");
        }
        const url = `${PAYPAL_BASE_API}/v2/checkout/orders/${orderID}`;
        const accessToken = await this.generateAccessToken();
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
                // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
                // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
                // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
                // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
            },
            method: "GET",
        });
        const jsonResponse = await response.json();
        if(response.status == 404) {
            return null;
        }else if(response.status == 200) {
            return jsonResponse;
        }
        console.log(jsonResponse);
        throw new ServerError('Server error: ' + jsonResponse);
    }

    async transferMoney(items: any[]): Promise<any> {
        // Lấy tài khoản paypal admin hiện tại
        // Gọi API kiểm tra số dư xem đủ để trả không
        // chuyển tiền và return kết quả
        const { PAYPAL_BASE_API } = process.env;
        if(!PAYPAL_BASE_API) {
            throw new Error("MISSING_API_CREDENTIALS PAYPAL");
        }
        const url = `${PAYPAL_BASE_API}/v1/payments/payouts`;
        const accessToken = await this.generateAccessToken();

        const requestData = {
            sender_batch_header: {
                sender_batch_id: String(Date.now()),
                recipient_type: 'EMAIL',
                email_subject: 'You have money!',
                email_message: 'You received a payment. Thanks for using our service!',
            },
            items: items,
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(requestData),
        });
        console.log(`Status code: ${response.status}`);
        if(response.status == 422) {
            throw new UnprocessableError('The account does not have sufficient balance.');
        }
        if(response.status != 201) {
            const responseData = await response.json();
            console.log(responseData);
            throw new ServerError('Server Error');
        }
        const responseData = await response.json();
        console.log('Payout request successful');
        return responseData;
    }

    async getBatchPayoutDetails(batchId: string): Promise<any> {
        const { PAYPAL_BASE_API } = process.env;
        if(!PAYPAL_BASE_API) {
            throw new Error("MISSING_API_CREDENTIALS PAYPAL");
        }
        const url = `${PAYPAL_BASE_API}/v1/payments/payouts/${batchId}`;
        const accessToken = await this.generateAccessToken();
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        const responseData = await response.json();
        console.log('Payout request successful');
        return responseData;
    }
}