import { CourseTag } from "../../models/CourseTag";
import { BaseRepositoryInterface } from "./BaseRepositoryInterface";

export interface ICourseTagRepository extends BaseRepositoryInterface<CourseTag> {
    createInBulks(data:any[]): Promise<CourseTag[]>;
}