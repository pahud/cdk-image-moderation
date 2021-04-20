import * as AWS from 'aws-sdk';

const sns = new AWS.SNS();
const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3();

export async function handler(event: any) {
  console.log('Event: %j', event)
  if (event.Records && event.Records.length > 0) {
    const record = event.Records[0]
    const bucket = record.s3.bucket.name
    const key = record.s3.object.key
    const uri = `s3://${bucket}/${key}`
    console.log(uri)
    const result = await imageCheck(bucket, key)
    console.log('only labels:', process.env.ONLY_LABELS)
    // generate a presign URL for preview
    const presignedUrl = await s3.getSignedUrlPromise('getObject', {
      Bucket: bucket,
      Key: key,
      Expires: Number(process.env.PREVIEW_TTL),
    })
    console.log('presignURL: %s', presignedUrl)
    // generate the report
    const completeResult = {
      bucket,
      key,
      result,
    }
    // send result to sns topic
    console.log(JSON.stringify(completeResult, null, 2))
    const snsResult = await sns.publish({
      Message: JSON.stringify(completeResult, null, 2),
      TopicArn: process.env.TOPIC_ARN,
    }).promise()
    // send the preview
    await sns.publish({
      Message: `[preview](${presignedUrl})`,
      TopicArn: process.env.TOPIC_ARN,
    }).promise()
  }
  return "OK"
}

async function imageCheck(bucket: string, name: string) {
  const data = await rekognition.detectModerationLabels({
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: name,
      }
    }
  }).promise();
  console.log(data)
  return data
}
