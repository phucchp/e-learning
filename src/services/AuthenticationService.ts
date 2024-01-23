import { User } from '../models/User';
import { Profile } from '../models/Profile';
import Authentication from '../utils/Authentication';
import Container, { Inject, Service } from 'typedi';
import { UserRepository } from '../repositories/UserRepository';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { ProfileRepository } from '../repositories/ProfileRepository';
import { IProfileRepository } from '../repositories/interfaces/IProfileRepository';
import { IAuthenticationService } from './interfaces/IAuthenticationService';
import { DuplicateError, InvalidUserNameOrPassword, UnauthorizedError, handleErrorFunction } from '../utils/CustomError';

@Service()
export class AuthenticationService implements IAuthenticationService {

	@Inject(() => UserRepository)
	private userRepository!: IUserRepository;

	@Inject(() => ProfileRepository)
	private profileRepository!: IProfileRepository;

    async login(email: string, password: string): Promise<any> {
        try {
            const user = await this.userRepository.findOneByCondition({
                email: email,
            });
            if(!user){
                throw new InvalidUserNameOrPassword('Invalid email or password');
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
				throw new InvalidUserNameOrPassword('Invalid email or password');
			}
        } catch (error) {
            handleErrorFunction(error);
        }
    }

    async register(email: string, username: string, password: string, firstName?: string | undefined, lastName?: string | undefined): Promise<boolean> {
        try {
            if(await this.isUsernameExist(username)){
                throw new DuplicateError('Username Already Exists!');
            }

            if(await this.isEmailExist(email)){
                throw new DuplicateError('Email Already Exists!');
            }

            const hashedPassword: string = await Authentication.passwordHash(
				password
			);
            console.log(hashedPassword);
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
           
            return true;
        } catch (error) {
            handleErrorFunction(error);
        }
    }
    
    async isUsernameExist(username: string): Promise<boolean> {
        try {
            const result = await this.userRepository.findOneByCondition({
                userName: username
            });
            if(result!=null){
                return true;
            }
            return false;
        } catch (error) {
            handleErrorFunction(error);
        }
    }

    async isEmailExist(email: string): Promise<boolean> {
        try {
            const result = await this.userRepository.findOneByCondition({
                email: email
            });
            if(result!=null){
                return true;
            }
            return false;
        } catch (error) {
            handleErrorFunction(error);
        }
    }
}