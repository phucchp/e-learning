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
	// forgotPassword: (
	// 	email: string,
	// 	token?: string | null,
	// 	password?: string | null
	// ) => Promise<any>;
	// changePassword: (
	// 	userId: number,
	// 	oldPassword: string,
	// 	newPassword: string
	// ) => Promise<any>;
	activeUser: (token: string) => Promise<boolean>;
	// getAccessTokenByRefreshToken: (refreshToken: string) => Promise<any>;
}
