import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3n from '@aws-cdk/aws-s3-notifications';
import * as s3 from '@aws-cdk/aws-s3';
import * as snss from '@aws-cdk/aws-sns-subscriptions';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';

/**
 * content moderation labels
 * @see https://docs.aws.amazon.com/rekognition/latest/dg/moderation.html
 */
export enum ModerationLabels {
  EXPLICIT_NUDITY = 'Explicit Nudity',
  NUDITY = 'Nudity',
  SEXUAL_ACTIVITY = 'Sexual Activity',
  SUGGESTIVE = 'Suggestive',
  PARTIAL_NUDITY = 'Partial Nudity',
  VIOLENCE = 'Violence',
  VISUALLY_DISTURBING = 'Visually Disturbing',
  RUDE_GESTURES = 'Rude Gestures',
  DRUGS = 'Drugs',
  TOBACCO = 'Tobacco',
  ALCOHOL = 'Alcohol',
  GAMBLING = 'Gambling',
  HATE_SYMBOLS = 'Hate Symbols',
}

export interface ModerationProps {
  /**
   * Options to create the S3 Bucket
   */
  readonly bucketOptions?: s3.BucketProps;
  /**
   * The SNS Topic to send the image moderation result
   */
  readonly topic?: sns.ITopic;
  /**
   * The TTL for the presigned URL of the preview image
   * @default 60 seconds
   */
  readonly previewTtl?: cdk.Duration;
  /**
   * emit the notification when we detect these labels
   */
  readonly moderationLabels?: ModerationLabels[];
}

export class Moderation extends cdk.Construct {
  readonly bucket: s3.Bucket;
  readonly bucketOptions?: s3.BucketProps;
  readonly topic: sns.ITopic;
  readonly handler: lambda.IFunction;
  constructor(scope: cdk.Construct, id: string, props: ModerationProps = {}) {
    super(scope, id);

    this.bucketOptions = props.bucketOptions;
    this.topic = props.topic ?? this._createTopic();
    this.handler = new NodejsFunction(this, 'Handler', {
      entry: path.join(__dirname, '../lambda/moderation/index.ts'),
      runtime: lambda.Runtime.NODEJS_14_X,
      bundling: {
        define: {
          'process.env.ONLY_LABELS': props.moderationLabels ?
            JSON.stringify(props.moderationLabels.map(x => x.valueOf() )) : '',
        },
      },
      environment: {
        TOPIC_ARN: this.topic.topicArn,
        PREVIEW_TTL: props.previewTtl ? props.previewTtl.toSeconds().toString() : '10',
      },
    });
    this.topic.grantPublish(this.handler);
    this.handler.addToRolePolicy(new iam.PolicyStatement({
      actions: ['rekognition:DetectModerationLabels'],
      resources: ['*'],
    }));
    this.bucket = this._createBucket();
    this.bucket.grantRead(this.handler);
    new cdk.CfnOutput(this, 'bucket', { value: `s3://${this.bucket.bucketName}` });


  }
  private _createBucket(): s3.Bucket {
    const bucket = new s3.Bucket(this, 'Bucket', this.bucketOptions);
    // bucket.addObjectCreatedNotification(new s3n.SnsDestination(this.topic));
    bucket.addObjectCreatedNotification(new s3n.LambdaDestination(this.handler));
    return bucket;
  }
  private _createTopic(): sns.Topic {
    return new sns.Topic(this, 'Topic');
  }
}

export interface SNS2TelegramProps {
  /**
   * The Telegram chat ID to send the message to
   */
  readonly chatid: string;
  /**
   * The SNS topic to receive the inbound notification and forward to the downstream Telegram chat
   */
  readonly topic?: sns.ITopic;
}
/**
 * forward SNS messages to Telegram chat via Lambda
 */
export class SNS2Telegram extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: SNS2TelegramProps) {
    super(scope, id);
    const telegramToken = process.env.TELEGRAM_TOKEN || this.node.tryGetContext('TELEGRAM_TOKEN');
    if (!telegramToken) {
      throw new Error('missing TELEGRAM_TOKEN in env var or context variable');
    }
    const fn = new NodejsFunction(this, 'SNS2TG', {
      entry: path.join(__dirname, '../lambda/sns2telegram/index.ts'),
      runtime: lambda.Runtime.NODEJS_14_X,
      environment: {
        TELEGRAM_TOKEN: telegramToken,
        TELEGRAM_CHAT_ID: props.chatid,
      },
    });
    const topic = props.topic ?? this._createTopic();
    topic.addSubscription(new snss.LambdaSubscription(fn));
  }
  private _createTopic(): sns.Topic {
    return new sns.Topic(this, 'Topic', {
      fifo: true,
    });
  }
}
