import { PaypalService } from "../services/PaypalService";
import Container from 'typedi';
import { Request, Response } from 'express';
import { UnauthorizedError } from "../utils/CustomError";
import { PaymentService } from "../services/PaymentService";
import { IPaymentService } from "../services/interfaces/IPaymentService";
import { CourseService } from "../services/CourseService";
import { ICourseService } from "../services/interfaces/ICourseService";
import { InstructorPaymentService } from "../services/InstructorPaymentService";
import { IInstructorPaymentService } from "../services/interfaces/IInstructorPaymentService";

export class PaymentController{
	private paypalService: PaypalService;
	private paymentService: IPaymentService;
	private courseService: ICourseService;
    private instructorPaymentService: IInstructorPaymentService;

	constructor() {
		this.paypalService = Container.get(PaypalService);
		this.paymentService = Container.get(PaymentService);
		this.courseService = Container.get(CourseService);
		this.instructorPaymentService = Container.get(InstructorPaymentService);
	}

    /**
     * Dùng đê tạo order mới
     * Pre conditions: User không có order nào ở trạng thái chưa thanh toán, nếu có phải cancelOrder đó trước
     * @param req 
     * @param res 
     */
    createOrder = async (req: Request, res: Response) => {
        // check xem user có payment nào chưa thanh toán hay không
        // Nếu có thì hỏi user thanh toán tiếp or huỷ thanh toán
        // Nếu thanh toán tiếp (truyền thêm 1 tham số gì đó) thì dựa vào thông tin
        // payment cũ để tạo lại order và update lại orderId
        // Hoặc dựa vào orderID trong db trả về cho user
        const userId = req.payload.userId;
        const isContinueOrder = req.body.isContinueOrder;
        const courseIds = req.body.courseIds;
        if (!userId) {
            throw new UnauthorizedError('Unauthorized Error!');
        }
        const paymentNotCheckout = await this.paymentService.getPaymentNotCheckout(userId);
        if(!paymentNotCheckout) {
            const {jsonResponse, httpStatusCode} = await this.paypalService.createOrder(userId, courseIds);
            return res.status(200).json(jsonResponse);
        }
        if(!isContinueOrder || isContinueOrder == false) {
            // Nếu không tiếp tục order thì phải huỷ order đó trước mới được tạo lại order
            return res.status(403).json('Can not create new order if user has already payment is not checkout!');
        }

        // Nếu tiếp tục order, get paymentID để trả về cho user tiếp tục dùng id đó thanh toán với paypal
        // check id paypal còn dùng được hay không, nếu được thì trả về, ko dc thì tao order mới dựa vào các thông tin trong order cũ
        const {jsonResponse, httpStatusCode} = await this.paypalService.reCreateOrder(userId);
        return res.status(200).json(jsonResponse);
    }

    /**
     * Dùng để confirm order sau khi user thanh toán thành công
     * Hệ thống sẽ gọi bên Paypal check và thêm user vào các khoá học mà user đã thanh toán
     * @param req 
     * @param res 
     */
    captureOrder = async (req: Request, res: Response) => {
        const orderID = req.params.orderID;
        console.log(`Order ID : ${orderID}`);
        const rs = await this.paypalService.captureOrder(orderID);
        return res.status(200).json(rs);
    }

    /**
     * Dùng để huỷ order cũ trước khi tạo order mới
     * @param req 
     * @param res 
     */
    cancelOrder = async (req: Request, res: Response) => {
        const userId = req.payload.userId;
        await this.paymentService.cancelOrder(userId);
        return res.status(200).json({
            message: "Success",
        })        
    }

    /**
     * API update processing course for user
     */
    getInstructorPayment = async (req: Request, res: Response) => {
        const data = await this.instructorPaymentService.getInstructorPayments(req);
        return res.status(200).json({
            message: "Successful",
            data: data
        });
    }
    
    test = async (req: Request, res: Response) => {
        const data= await this.paymentService.paymentMonthlyRevenueForInstructor();
        return res.status(200).json(data);
    }

    test2 = async (req: Request, res: Response) => {
        // const data= await this.paypalService.getBatchPayoutDetails();
        // return res.status(200).json(data);
    }
}