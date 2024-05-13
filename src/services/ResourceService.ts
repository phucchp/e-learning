import { Inject, Service } from 'typedi';
import { IResourceService } from './interfaces/IResourceService';
import { Resource } from '../models/Resource';
import { Request } from 'express';
import { ResourceRepository } from '../repositories/ResourceRepository';
import { IResourceRepository } from '../repositories/interfaces/IResourceRepository';
import { DuplicateError, NotFound, ServerError } from '../utils/CustomError';
import { S3Service } from './S3Service';

@Service()
export class ResourceService implements IResourceService {

    @Inject(() => ResourceRepository)
	private resourceRepository!: IResourceRepository;

    @Inject(() => S3Service)
	private s3Service!: S3Service;

    async getResource(resourceId: number): Promise<Resource> {
        const resource = await this.resourceRepository.findById(resourceId);
        if (!resource) {
            throw new NotFound('Resource not found!');
        }
        resource.setDataValue('url', await this.s3Service.getObjectUrl(resource.url));

        return resource;
    }

    async getAllResourceOfLesson(lessonId: number): Promise<Resource[]> {
        return await this.resourceRepository.getAll({
            where: {
                lessonId: lessonId
            }
        });
    }

    async createResource(lessonId: number, name: string): Promise<Resource> {
        const resource = await this.resourceRepository.findOneByCondition({
            lessonId: lessonId,
            name: name
        });

        if (resource) {
            throw new DuplicateError('Resource already exists');
        }

        const newResource = await this.resourceRepository.create({
            lessonId: lessonId,
            name: name,
            url: `lessons/${lessonId}/resources/${name}`
        });
        // txt -> text/plain
        // pdf application/pdf
        // zip application/zip
        const parts = name.split('.');
        const extension = parts[parts.length - 1];
        let contentType = 'application/pdf';
        if (extension === 'pdf') {
            contentType = 'application/pdf';
        }
        if (extension === 'txt') {
            contentType = 'application/pdf';
        }
        if (extension === 'zip') {
            contentType = 'application/zip';
        }
        newResource.setDataValue('url', await this.s3Service.generatePresignedUrlUpdate(newResource.url, contentType));
        return newResource;
    }

    async updateResource(resourceId: number): Promise<Resource> {
        const resource = await this.resourceRepository.findById(resourceId);
        if (!resource) {
            throw new NotFound('Resource not found!');
        }
        throw new Error('Method not implemented.');

    }

    async deleteResource(resourceId: number): Promise<void> {
        // Delete from database
        // Delete from S3
        // Clear cache cloudfront
        const resource = await this.resourceRepository.findById(resourceId);
        if (!resource) {
            throw new NotFound('Resource not found!');
        }

        const url = resource.url;
        await this.resourceRepository.deleteInstance(resource, true);
        await this.s3Service.deleteObject(url);
        await this.s3Service.clearCacheCloudFront(url);
    }
}
