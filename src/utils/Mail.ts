import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import { Service } from 'typedi';
import * as dotenv from 'dotenv';
dotenv.config();

@Service()
export class Mail {
	private transporter: nodemailer.Transporter;
	client_url = process.env.CLIENT_URL?.toString();

	constructor() {
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
		try {
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
		} catch (error) {
			console.error('Error sending email:', error);
		}
	};

	activeUser = async (
		username: string,
		to: string,
		token: string
	): Promise<void> => {
		try {
			const replacements = {
				username: username,
				replaceLink:
					this.client_url+'/active-user?token=' + token + '&email=' + to,
			};

			let htmlContent = fs.readFileSync('src/utils/templates/active-account.html', 'utf8');

			Object.entries(replacements).forEach(([key, value]) => {
				const regex = new RegExp(`{{${key}}}`, 'g');
				htmlContent = htmlContent.replace(regex, value);
			});

			return await this.sendEmail(to, 'Xác nhận người dùng', htmlContent);
		} catch (error) {
			console.error('Error sending email:', error);
		}
	};
}

export default Mail;
