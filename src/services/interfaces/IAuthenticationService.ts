export interface IAuthenticationService {
	login(email: string, password: string): Promise<any>;
	// loginAdmin(username: string, password: string): Promise<string>;
	register(
		email: string,
		username: string,
		password: string,
        firstName?: string,
        lastName?: string,
	): Promise<boolean>;
	forgotPassword (
		email: string,
	) : Promise<any>;
	changePassword (
		userId: number,
		oldPassword: string,
		newPassword: string
	) : Promise<any>;
	activeUser(token: string) : Promise<boolean>;
	changePasswordUsingToken(
		token: string,
		newPassword: string
	): Promise<any>;
	// getAccessTokenByRefreshToken: (refreshToken: string) => Promise<any>;
}
