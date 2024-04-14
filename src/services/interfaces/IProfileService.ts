import { Profile } from "../../models/Profile";
import { Request} from 'express';

export interface IProfileService {
    createProfile(/** Add params here */): Promise<Profile>;
    updateProfile(/** Add params here */): Promise<Profile>;
}