import { S3 } from 'aws-sdk';
import AWS from 'aws-sdk';
import { Service } from 'typedi';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

@Service()
export class S3Service {

    private static s3Client = new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY || 'ftpFjHO7fVotfgaDiO5A',
        secretAccessKey: process.env.AWS_SECRET_KEY || 'Jx89z4nsbGevSOMDWemErKu3zplNmo03b0WZz1ri',
        region: process.env.AWS_REGION || 'ap-southeast-1', // Thay thế bằng khu vực AWS của bạn
        signatureVersion: 'v4'
    });

    private cloudfrontDistributionId = process.env.CLOUDFRONT_DISTRIBUTION_ID || 'EGZQ2Z6SRLE1A'

    private cloudFrontDomain =process.env.CLOUDFRONT_DOMAIN|| 'https://d3h2k6w8gpk1ys.cloudfront.net'; // Thay thế bằng tên miền CloudFront của bạn
    private BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'elearning-project-chp';
    private EXPIRATION = 24 * 60 * 60;
    // Thời gian expire được sửa thành 1 phút (60 giây)
    private expireTime = 24*60*60 * 1000; // 60 phut *60 giây * 1000 milliseconds
    private expires = new Date(Date.now() + this.expireTime);
    
    // Get link Object 
    getObjectUrl = async (objectName: string, bucketName: string = this.BUCKET_NAME, expiration: number = this.EXPIRATION) => {
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

    generatePresignedUrlUpdate = async (objectName: string, contentType: string , expiration: number = this.EXPIRATION) => {
        try {
            const params = {
                Bucket: this.BUCKET_NAME,
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

    deleteObject = async(objectName: string)=>{
        try {
            const client = new S3Client({
                region: process.env.AWS_REGION || 'ap-southeast-1',
                credentials: {
                  accessKeyId:  process.env.AWS_ACCESS_KEY || '', // Thay thế bằng access key của bạn
                  secretAccessKey: process.env.AWS_SECRET_KEY || '', // Thay thế bằng secret access key của bạn
                },
              });
          const command = new DeleteObjectCommand({
            Bucket: this.BUCKET_NAME,
            Key: objectName,
          });
        
            const response = await client.send(command);
            console.log(response);
      
          } catch (err) {
            console.log( err);
          }
    }
    

    clearCacheCloudFront = async (path: string) => {
        try{
            this.deleteObject('ok')
            AWS.config.update({
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY,
                region: process.env.AWS_REGION || 'ap-southeast-1'
              });
            var cloudfront = new AWS.CloudFront();

            var params = {
                DistributionId: 'EGZQ2Z6SRLE1A', /* required */
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
