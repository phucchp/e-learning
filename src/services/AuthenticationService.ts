import { User } from '../models/User';
import { Profile } from '../models/Profile';
import Authentication from '../utils/Authentication';
import Container, { Inject, Service } from 'typedi';
import { UserRepository } from '../repositories/UserRepository';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { ProfileRepository } from '../repositories/ProfileRepository';
import { IProfileRepository } from '../repositories/interfaces/IProfileRepository';
import { IAuthenticationService } from './interfaces/IAuthenticationService';
import { DuplicateError, BadRequestError, UnauthorizedError, NotFound } from '../utils/CustomError';
import Mail from '../utils/Mail';

@Service()
export class AuthenticationService implements IAuthenticationService {

	@Inject(() => UserRepository)
	private userRepository!: IUserRepository;

	@Inject(() => ProfileRepository)
	private profileRepository!: IProfileRepository;

    @Inject(() => Mail)
	private mail!: Mail;
    
    async login(email: string, password: string): Promise<any> {
        const user = await this.userRepository.findOneByCondition({
            email: email,
        });
        if(!user){
            throw new BadRequestError('Invalid email or password');
        }
        // check password
        let compare = await Authentication.passwordCompare(
            password,
            user.password
        );
        // generate token
        if (compare) {
            if (!user.isActive) {
                throw new UnauthorizedError('Account is not actived');
            }
            return {
                accessToken: Authentication.generateAccessToken(
                    user.id,
                    user.roleId,
                    user.userName,
                    user.email,
                ),
                refreshToken: Authentication.generateRefreshToken(
                    user.email
                ),
            };
        }else {
            throw new BadRequestError('Invalid email or password');
        }
    }

    async register(email: string, username: string, password: string, firstName?: string | undefined, lastName?: string | undefined): Promise<boolean> {
        if(await this.isUsernameExist(username)){
            throw new DuplicateError('Username Already Exists!');
        }

        if(await this.isEmailExist(email)){
            throw new DuplicateError('Email Already Exists!');
        }

        const hashedPassword: string = await Authentication.passwordHash(
            password
        );
        const user = await this.userRepository.create({
            email:email,
            userName:username,
            password:hashedPassword
        });
        if(!user) return false;
        const profile = await this.profileRepository.create({
            userId:user.id,
            firstName: firstName,
            lastName: lastName,
        });
        const token: string = Authentication.createActivationToken(email);
        await this.mail.activeUser(
            username,
            email,
            token
        );
        return true;
    }
    
    /**
     * Active user using token from mail
     */
    async activeUser(token: string): Promise<boolean>{
        const data = await Authentication.validateToken(token);
        if(!data) {
            // Check token is valid
            throw new UnauthorizedError('Token has expired!');
        }

        if(!data.email){
            // Check email 
            throw new NotFound('Email not found!');
        }

        const user = await this.userRepository.findOneByCondition({
            email: data.email,
        });

        if(!user){
            throw new NotFound('Account not found!');
        }

        if(user.isActive){
            throw new DuplicateError('Account is already actived!');
        }

        // Active account
        user.isActive = true;
        await this.userRepository.updateInstance(user);
        return true;
    }

    async isUsernameExist(username: string): Promise<boolean> {
        const result = await this.userRepository.findOneByCondition({
            userName: username
        });
        if(result!=null){
            return true;
        }
        return false;
    }

    async isEmailExist(email: string): Promise<boolean> {
        const result = await this.userRepository.findOneByCondition({
            email: email
        });
        if(result!=null){
            return true;
        }
        return false;
    }

    /**
     * Change password for user from UI
     * @param userId 
     * @param oldPassword 
     * @param newPassword 
     * @returns 
     */
    changePassword = async (
		userId: number,
		oldPassword: string,
		newPassword: string
	) => {
        const user = await this.userRepository.findOneByCondition({
            id: userId,
        });

        if(!user){
            throw new NotFound('Account not found!');
        }

        // check password
        const compare = await Authentication.passwordCompare(
            oldPassword,
            user.password
        );
        if (compare) {
            const hashedPassword: string = await Authentication.passwordHash(
                newPassword
            );
            user.password = hashedPassword;
            return await this.userRepository.updateInstance(user);
        } else {
            throw new BadRequestError('Old password is not correct!');
        }
	};

    /**
     * Send mail forgot password
     * @param email
     */
    forgotPassword = async (
		email: string | null,
	) => {
        const searchConditions = {
            email,
        };
        const user = await this.userRepository.findOneByCondition(searchConditions);
        if(!user) {
            throw new NotFound('Email not found!');
        }

        // Send mail to user
        await this.mail.forgotPassword(
            user.userName,
            user.email,
            Authentication.generateAccessTokenForgotPassWord(
                user.id,
                user.roleId,
                user.userName,
                user.email
            )
        );
	};

    /**
     * Change password using token from mail
     * @param token 
     * @param newPassword 
     */
    changePasswordUsingToken = async (
		token: string,
		newPassword: string
	) => {
        // Validate token is valid
        const data = Authentication.validateToken(token);
        if(!data) {
            throw new UnauthorizedError('Token has expired or invalid!');
        }

        // Check user is exists
        const user = await this.userRepository.findOneByCondition({
            email: data.email
        });
        if(!user) {
            throw new NotFound('Email not found!');
        }

        // Change password
        const hashedPassword: string = await Authentication.passwordHash(
            newPassword
        );
        user.password = hashedPassword;
        return await this.userRepository.updateInstance(user);
    }
    
    /**
     * Generate Access Token by Refresh Token
     * @param refreshToken 
     * @returns 
     */
     async getAccessTokenByRefreshToken(refreshToken: string): Promise<any> {
        const payload = Authentication.validateToken(refreshToken);
        if (!payload) {
            throw new UnauthorizedError('Token is invalid or is expired');
        }

        const user = await this.userRepository.findOneByCondition({
            email: payload.email
        });
        if (user) {
            if (!user.isActive) {
                throw new BadRequestError('User is not active!');
            }

            return {
                accessToken: Authentication.generateAccessToken(
                    user.id,
                    user.roleId,
                    user.userName,
                    user.email
                ),
            };
        } else {
            throw new NotFound('User not found!');
        }
	};
}