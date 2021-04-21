import * as cdk from '@aws-cdk/core';
import { Moderation, ModerationLabels, SNS2Telegram } from './';


export class IntegTesting {
  readonly stack: cdk.Stack[];
  constructor() {
    const app = new cdk.App();
    const env = {
      region: process.env.CDK_DEFAULT_REGION,
      account: process.env.CDK_DEFAULT_ACCOUNT,
    };
    const stack = new cdk.Stack(app, 'moderation-demo', { env });

    // create the moderation
    const mod = new Moderation(stack, 'Mod', {
      moderationLabels: [
        ModerationLabels.EXPLICIT_NUDITY,
        ModerationLabels.DRUGS,
        ModerationLabels.TOBACCO,
        ModerationLabels.ALCOHOL,
        ModerationLabels.VIOLENCE,
        ModerationLabels.RUDE_GESTURES,
      ],
    });

    // sns to telegram
    new SNS2Telegram(stack, 'SNS2TG', {
      topic: mod.topic,
      chatid: '-547476398',
    });
    this.stack = [stack];
  }
}

new IntegTesting();
