import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface Payload {
	userId?: number;
	role?: number;
	username?: string;
	email: string;
}

class Authentication {

	/**
	* Kiểm tra xem các biến từ file .env có tồn tại hay không
	* Nếu thiếu biến, throw error
	*/
	private static checkEnvVariables() {
		const requiredVariables = ['JWT_SECRET_KEY', 'JWT_ACCESS_EXPIRES_IN', 'JWT_ACCESS_FORGOT_PASSWORD_EXPIRES_IN', 'JWT_REFRESH_EXPIRES_IN'];
		
		for (const variable of requiredVariables) {
		  if (!process.env[variable]) {
			throw new Error(`Missing required environment variable: ${variable}`);
		  }
		}
	  }
	
	/**
	 * Khởi tạo đối tượng Authentication
	 * Kiểm tra các biến môi trường từ .env
	 */
	constructor() {
		Authentication.checkEnvVariables();
	}
	
	/**
	 * Dùng để mã hoá pass trước khi lưu vào database
	 * @param password 
	 * @returns password Hash
	 */
	public static async passwordHash(password: string): Promise<string> {
		const salt = await bcrypt.genSalt(10);
		return bcrypt.hash(password, salt);
	}

	/**
	 * So sánh pass của user và pass hash trong db
	 * @param text 
	 * @param encryptedText Password hash
	 * @returns 
	 */
	public static async passwordCompare(
		text: string,
		encryptedText: string
	): Promise<boolean> {
		return await bcrypt.compare(text, encryptedText);
	}

	/**
	 * Sử dụng để tạo token khi login
	 * @param id 
	 * @param role 
	 * @param username 
	 * @param gmail 
	 * @returns 
	 */
	public static generateAccessToken(
		id: number,
		role: number,
		username: string,
		email: string
	) {
		const secretKey: string = process.env.JWT_SECRET_KEY || 'my-secret-key';
		const payload: Payload = {
			userId: id,
			role: role,
			username: username,
			email: email,
		};
		const optionAccess = { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN };
		return jwt.sign(payload, secretKey, optionAccess);
	}

	public static generateAccessTokenForgotPassWord(
		id: number,
		role: number,
		username: string,
		email: string
	) {
		const secretKey: string = process.env.JWT_SECRET_KEY || 'my-secret-key';
		const payload: Payload = {
			userId: id,
			role: role,
			username: username,
			email: email,
		};
		const optionAccess = { expiresIn: process.env.JWT_ACCESS_FORGOT_PASSWORD_EXPIRES_IN };
		return jwt.sign(payload, secretKey, optionAccess);
	}

	public static generateRefreshToken(email: string) {
		const secretKey: string = process.env.JWT_SECRET_KEY || 'my-secret-key';
		const payload: Payload = {
			email: email,
		};
		const optionRefresh = { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN };
		return jwt.sign(payload, secretKey, optionRefresh);
	}

	public static validateToken(token: string): Payload | null {
		try {
			const secretKey: string = process.env.JWT_SECRET_KEY || 'my-secret-key';
			return jwt.verify(token, secretKey) as Payload;
		} catch (err) {
			return null;
		}
	}

	public static createActivationToken(email: string){
		try{
		const secretKey: string = process.env.JWT_SECRET_KEY || 'my-secret-key';
		const payload: Payload = {
			email: email,
		};
		const optionAccess = { expiresIn: '24h' };
		return jwt.sign(payload, secretKey, optionAccess);
		}catch (error){
			console.log(error);
			throw(error);
		}
	}
}

export default Authentication;
