# cdk-image-moderation

Event-driven image moderation and notification service with AWS CDK

# Deploy

```sh
export TELEGRAM_TOKEN=<YOUR_TOKEN>
cdk --app lib/main.js diff
cdk --app lib/main.js deploy
```

On deploy completed, you will get the S3 bucket in the `Outputs`. Simply upload any images into this bucket and you should be able to get the notification from the Telegram chatroom.
