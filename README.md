[![NPM version](https://badge.fury.io/js/cdk-image-moderation.svg)](https://badge.fury.io/js/cdk-image-moderation)
[![PyPI version](https://badge.fury.io/py/cdk-image-moderation.svg)](https://badge.fury.io/py/cdk-image-moderation)
[![Release](https://github.com/pahud/cdk-image-moderation/actions/workflows/release.yml/badge.svg)](https://github.com/pahud/cdk-image-moderation/actions/workflows/release.yml)

# cdk-image-moderation

Event-driven image moderation and notification service with AWS CDK

![](images/cdk-image-moderation.svg)

# Sample

This sample create a S3 bucket that will trigger image moderation check on object created and send notification to SNS when specific moderation labels are detected. The `SNS2Telegram` creates a Lambda function as the SNS topic subscription which fires the notification to a private Telegram chatroom with the image preview and moderation result.

```ts
import { Moderation, SNS2Telegram } from 'cdk-image-moderation';

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

// send notification via sns to telegram
new SNS2Telegram(stack, 'SNS2TG', {
  topic: mod.topic,
  chatid: '-547476398',
});
```

# Deploy the CDK app

```sh
export TELEGRAM_TOKEN=<YOUR_TOKEN>
cdk diff
cdk deploy
```

# Deploy from this repository


```sh
export TELEGRAM_TOKEN=<YOUR_TOKEN>
# run `yarn build` or `yarn watch` to generate the lib
cdk --app lib/integ.default.js diff
cdk --app lib/integ.default.js deploy
```

On deploy completed, you will get the S3 bucket in the `Outputs`. Simply upload any images into this bucket and you should be able to get the notification from the Telegram chatroom.
