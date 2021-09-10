import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { Readable } from 'stream';

(async () => {

const BUCKET_NAME = 'test'
const OBJECT_NAME = 'sampleObject'
const SAMPLE_CONTENT = 'some sample content'

// https://stackoverflow.com/a/63639280
// S3Client imported from commonjs library, so no type information
var client:InstanceType<typeof S3Client> = new S3Client({
    endpoint: "http://localhost:9000",
    region: 'us-east-1', 
    credentials: {
        accessKeyId: "minioadmin",
        secretAccessKey: "minioadmin"
    },
    forcePathStyle: true,
    tls: false
})

let putRequest = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: OBJECT_NAME,
    Body: SAMPLE_CONTENT
})

await client.send(putRequest)

let getRequest = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: OBJECT_NAME
})

const { Body } = await client.send(getRequest)
const bodyContent:String = await streamToString(Body as Readable)

console.log("Received: \n\n")
console.log(bodyContent)

// https://github.com/aws/aws-sdk-js-v3/issues/1877
// reading Body in node js (Readable)
async function streamToString (stream: Readable): Promise<string> {
    return await new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    });
}

})()