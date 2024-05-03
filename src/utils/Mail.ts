import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import { Service } from 'typedi';
import * as dotenv from 'dotenv';
import Handlebars from "handlebars";
import { Course } from '../models/Course';
import { User } from '../models/User';
dotenv.config();

@Service()
export class Mail {
	private transporter: nodemailer.Transporter;
	client_url = process.env.CLIENT_URL?.toString();

	constructor() {
		if(!process.env.CLIENT_URL) {
			console.log("WARNING: CLIENT_URL in .env is missing!");
		}

		const requiredEnvVariables = [
			'EMAIL_USER',
			'EMAIL_PASSWORD',
		];
		// Loop through the list of environment variables and check if they are set or not
		const missingVariables = requiredEnvVariables.filter(variable => !process.env[variable]);
		if (missingVariables.length > 0) {
			throw new Error(`Missing environment variables for MAIL service: ${missingVariables.join(', ')}`);
		}

		this.transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD,
			},
		});
	}

	sendEmail = async (
		to: string,
		subject: string,
		html: string
	): Promise<void> => {
		try {
			await this.transporter.sendMail({
				from: `"KNOCK Elearning" <${process.env.EMAIL_USER}>`,
				to,
				subject,
				html,
			});
		} catch (error) {
			console.error('Error sending email:', error);
		}
	};

	forgotPassword = async (
		username: string,
		to: string,
		token: string
	): Promise<void> => {
		console.log(token);
		const replacements = {
			username: username,
			replaceLink:
				this.client_url+'/reset-password?token=' + token + '&email=' + to,
		};
		let htmlContent = fs.readFileSync(
			'src/utils/ForgotPasswordMail.html',
			'utf8'
		);

		Object.entries(replacements).forEach(([key, value]) => {
			const regex = new RegExp(`{{${key}}}`, 'g');
			htmlContent = htmlContent.replace(regex, value);
		});

		return await this.sendEmail(to, 'Quên mật khẩu', htmlContent);
	};

	activeUser = async (
		username: string,
		to: string,
		token: string
	): Promise<void> => {
		const replacements = {
			username: username,
			replaceLink:
				this.client_url+'/active-user?token=' + token + '&email=' + to,
		};
		// Đọc nội dung HTML từ file mẫu handlebars
		let htmlTemplate = fs.readFileSync('src/utils/templates/active-account.hbs', 'utf8');
		// Biên dịch mẫu handlebars
		const compiledTemplate = Handlebars.compile(htmlTemplate);
		// Dữ liệu động để chèn vào mẫu
		const templateData = {
			subject: 'Subject of the email',
			greeting: 'Hello!',
			message: 'This is a sample email with dynamic content.',
			link: `http://localhost:8000/api/auth/active?token=${token}`
		};
		// Chèn dữ liệu vào mẫu
		const htmlContent = compiledTemplate(templateData);

		return await this.sendEmail(to, 'Active your account', htmlContent);
	};


	getCurrentDateAsString() {
		const currentDate = new Date();
		const day = String(currentDate.getDate()).padStart(2, '0');
		const month = String(currentDate.getMonth() + 1).padStart(2, '0');
		const year = currentDate.getFullYear();
		
		return `${year}-${month}-${day}`;
	}
	  	  
	sendBill = async(user: User, courses: Course[], paymentDetail: any) : Promise<void> =>{
			// Đọc nội dung HTML từ file mẫu handlebars
		let htmlTemplate = fs.readFileSync('src/utils/templates/invoice.hbs', 'utf8');
		Handlebars.registerHelper('calculateTotal', (price, discount) => {
            return price * (1 - discount / 100);
        });
		// Biên dịch mẫu handlebars
		const compiledTemplate = Handlebars.compile(htmlTemplate);
		// Dữ liệu động để chèn vào mẫu
		// Chèn dữ liệu vào mẫu
		const templateData = {
			subject: 'Subject of the email',
			greeting: 'Hello!',
			message: 'This is a sample email with dynamic content.',
			user: user,
			courses: courses,
			paymentDetails:paymentDetail,
			dateNow : this.getCurrentDateAsString(),	  // Sử dụng hàm để lấy ngày hiện tại dưới dạng chuỗi,
			totalPrice: paymentDetail.purchase_units[0].amount.value
		};
		const htmlContent = compiledTemplate(templateData);
		return await this.sendEmail('phucchp@gmail.com', 'Invoice', htmlContent);
	}
}

export default Mail;
