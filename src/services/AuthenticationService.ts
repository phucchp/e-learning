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
        const token: string = await Authentication.createActivationToken(email);
        await this.mail.activeUser(
            username,
            email,
            token
        );
        return true;
    }
    
    async activeUser(token: string): Promise<boolean>{
        const data = await Authentication.validateToken(token);
        if(!data) {
            throw new UnauthorizedError('Token has expired!');
        }

        if(!data.email){
            throw new NotFound('Email not found!');
        }

        const user = await this.userRepository.findOneByCondition({
            email: data.email,
        });

        if(!user){
            throw new NotFound('Account not found!');
        }
        user.isActive = true;
        await this.userRepository.updateInstace(user);
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
}