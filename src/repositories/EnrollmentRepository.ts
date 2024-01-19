import { Service } from "typedi";
import { Enrollment } from "../models/Enrollment";
import { IEnrollmentRepository } from "./interfaces/IEnrollmentRepository";
import { BaseRepository } from "./BaseRepository";

@Service()
export class EnrollmentRepository extends BaseRepository<Enrollment> implements IEnrollmentRepository{

    constructor(){
		super(Enrollment);
	}
}