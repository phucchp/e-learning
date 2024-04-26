import { S3 } from 'aws-sdk';
import AWS from 'aws-sdk';
import { Service } from 'typedi';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

@Service()
export class S3Service {

    private static s3Client: S3;
    private cloudfrontDistributionId: string;
    private cloudFrontDomain: string; // CloudFront domain name
    private bucketName: string;
    private awsRegion: string;
    private awsAccessKey: string;
    private awsSecretKey: string;

    constructor() {
        // List of environment variables
        const requiredEnvVariables = [
          'AWS_ACCESS_KEY',
          'AWS_SECRET_KEY',
          'AWS_REGION',
          'CLOUDFRONT_DISTRIBUTION_ID',
          'CLOUDFRONT_DOMAIN',
          'AWS_BUCKET_NAME',
          'CLOUDFRONT_DOMAIN',
          'AWS_BUCKET_NAME',
          'CLOUDFRONT_PRIVATE_KEY',
          'CLOUDFRONT_KEY_PAIR_ID'
        ];

        // Loop through the list of environment variables and check if they are set or not
        const missingVariables = requiredEnvVariables.filter(variable => !process.env[variable]);
        if (missingVariables.length > 0) {
            throw new Error(`Missing AWS environment variables: ${missingVariables.join(', ')}`);
        }

        // Initialize the S3 object only if the environment variables exist
        S3Service.s3Client = new S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
            region: process.env.AWS_REGION,
            signatureVersion: 'v4'
        });

        this.cloudfrontDistributionId = process.env.CLOUDFRONT_DISTRIBUTION_ID || 'EGZQ2Z6SRLE1A';
        this.cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN|| 'https://d3h2k6w8gpk1ys.cloudfront.net'; // Replace with your CloudFront domain name
        this.bucketName = process.env.AWS_BUCKET_NAME || 'elearning-project-chp';
        this.awsRegion = process.env.AWS_REGION || 'ap-southeast-1';
        this.awsAccessKey = process.env.AWS_ACCESS_KEY || '';
        this.awsSecretKey = process.env.AWS_SECRET_KEY || '';
    }

    private EXPIRATION = 24 * 60 * 60;
    // Thời gian expire được sửa thành 1 phút (60 giây)
    private expireTime = 24*60*60 * 1000; // 60 phut *60 giây * 1000 milliseconds
    private expires = new Date(Date.now() + this.expireTime);
    
    /**
     * Get pre-Signed URLs of objects in S3
     * @param objectName 
     * @param expiration 
     * @param bucketName 
     * @returns 
     */
    getObjectUrl = async (objectName: string, expiration: number = this.EXPIRATION, bucketName: string = this.bucketName) => {
        try {
            const url = await getSignedUrl({
                url: this.cloudFrontDomain+"/"+objectName,
                dateLessThan: this.expires+'',
                privateKey: process.env.CLOUDFRONT_PRIVATE_KEY||'',
                keyPairId:process.env.CLOUDFRONT_KEY_PAIR_ID||'K1T3GDGJTSYTYG'
            });
            return url;
        } catch (err) {
            console.error('Error generating pre-signed URL:', err);
            throw err;
        }
    }

    /**
     * Get pre-signed URL to upload object to S3 from client
     * @param objectName 
     * @param contentType 
     * @param expiration 
     * @returns 
     */
    generatePresignedUrlUpdate = async (objectName: string, contentType: string , expiration: number = this.EXPIRATION) => {
        try {
            const params = {
                Bucket: this.bucketName,
                Key: objectName,
                ContentType: contentType,
                Expires: expiration
            };
            const url = await S3Service.s3Client.getSignedUrlPromise('putObject', params)
            // const url = await S3Service.s3Client.getSignedUrl('putObject', params);
            return url;
        } catch (error) {
            console.error('Error generating pre-signed URL:', error);
            throw error; // Rethrow the error for handling later
        }
    }

    /**
     * Using delete object from S3
     * @param objectName 
     */
    deleteObject = async(objectName: string)=>{
        try {
            const client = new S3Client({
                region: process.env.AWS_REGION || 'ap-southeast-1',
                credentials: {
                  accessKeyId:  this.awsAccessKey, // Thay thế bằng access key của bạn
                  secretAccessKey: this.awsSecretKey || '', // Thay thế bằng secret access key của bạn
                },
              });
          const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: objectName,
          });
        
            const response = await client.send(command);
            console.log(response);
      
          } catch (err) {
            console.log( err);
          }
    }
    
    /**
     * Using clear cache each endpoint cloudfront when update object to S3
     * @param path 
     */
    clearCacheCloudFront = async (path: string) => {
        try{
            AWS.config.update({
                accessKeyId: this.awsAccessKey,
                secretAccessKey: this.awsSecretKey,
                region: this.awsRegion
              });
            var cloudfront = new AWS.CloudFront();

            var params = {
                DistributionId: this.cloudfrontDistributionId, /* required */
                InvalidationBatch: { /* required */
                  CallerReference: String(new Date().getTime()), /* required */
                  Paths: { /* required */
                    Quantity: 1, /* required */
                    Items: [
                      '/'+path
                    ]
                  }
                }
              };
              cloudfront.createInvalidation(params, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else     console.log(data);           // successful response
              });
        }catch(error){
            console.log(error);
        }
    }
      

}
