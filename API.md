# API Reference

**Classes**

Name|Description
----|-----------
[Moderation](#cdk-image-moderation-moderation)|*No description*
[SNS2Telegram](#cdk-image-moderation-sns2telegram)|forward SNS messages to Telegram chat via Lambda.


**Structs**

Name|Description
----|-----------
[ModerationProps](#cdk-image-moderation-moderationprops)|*No description*
[SNS2TelegramProps](#cdk-image-moderation-sns2telegramprops)|*No description*


**Enums**

Name|Description
----|-----------
[ModerationLabels](#cdk-image-moderation-moderationlabels)|content moderation labels.



## class Moderation  <a id="cdk-image-moderation-moderation"></a>



__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new Moderation(scope: Construct, id: string, props?: ModerationProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[ModerationProps](#cdk-image-moderation-moderationprops)</code>)  *No description*
  * **bucketOptions** (<code>[BucketProps](#aws-cdk-aws-s3-bucketprops)</code>)  Options to create the S3 Bucket. __*Optional*__
  * **moderationLabels** (<code>Array<[ModerationLabels](#cdk-image-moderation-moderationlabels)></code>)  emit the notification when we detect these labels. __*Optional*__
  * **previewTtl** (<code>[Duration](#aws-cdk-core-duration)</code>)  The TTL for the presigned URL of the preview image. __*Default*__: 60 seconds
  * **topic** (<code>[ITopic](#aws-cdk-aws-sns-itopic)</code>)  The SNS Topic to send the image moderation result. __*Optional*__



### Properties


Name | Type | Description 
-----|------|-------------
**bucket** | <code>[Bucket](#aws-cdk-aws-s3-bucket)</code> | <span></span>
**handler** | <code>[IFunction](#aws-cdk-aws-lambda-ifunction)</code> | <span></span>
**topic** | <code>[ITopic](#aws-cdk-aws-sns-itopic)</code> | <span></span>
**bucketOptions**? | <code>[BucketProps](#aws-cdk-aws-s3-bucketprops)</code> | __*Optional*__



## class SNS2Telegram  <a id="cdk-image-moderation-sns2telegram"></a>

forward SNS messages to Telegram chat via Lambda.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new SNS2Telegram(scope: Construct, id: string, props: SNS2TelegramProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[SNS2TelegramProps](#cdk-image-moderation-sns2telegramprops)</code>)  *No description*
  * **chatid** (<code>string</code>)  The Telegram chat ID to send the message to. 
  * **topic** (<code>[ITopic](#aws-cdk-aws-sns-itopic)</code>)  The SNS topic to receive the inbound notification and forward to the downstream Telegram chat. __*Optional*__




## struct ModerationProps  <a id="cdk-image-moderation-moderationprops"></a>






Name | Type | Description 
-----|------|-------------
**bucketOptions**? | <code>[BucketProps](#aws-cdk-aws-s3-bucketprops)</code> | Options to create the S3 Bucket.<br/>__*Optional*__
**moderationLabels**? | <code>Array<[ModerationLabels](#cdk-image-moderation-moderationlabels)></code> | emit the notification when we detect these labels.<br/>__*Optional*__
**previewTtl**? | <code>[Duration](#aws-cdk-core-duration)</code> | The TTL for the presigned URL of the preview image.<br/>__*Default*__: 60 seconds
**topic**? | <code>[ITopic](#aws-cdk-aws-sns-itopic)</code> | The SNS Topic to send the image moderation result.<br/>__*Optional*__



## struct SNS2TelegramProps  <a id="cdk-image-moderation-sns2telegramprops"></a>






Name | Type | Description 
-----|------|-------------
**chatid** | <code>string</code> | The Telegram chat ID to send the message to.
**topic**? | <code>[ITopic](#aws-cdk-aws-sns-itopic)</code> | The SNS topic to receive the inbound notification and forward to the downstream Telegram chat.<br/>__*Optional*__



## enum ModerationLabels  <a id="cdk-image-moderation-moderationlabels"></a>

content moderation labels.

Name | Description
-----|-----
**EXPLICIT_NUDITY** |
**NUDITY** |
**SEXUAL_ACTIVITY** |
**SUGGESTIVE** |
**PARTIAL_NUDITY** |
**VIOLENCE** |
**VISUALLY_DISTURBING** |
**RUDE_GESTURES** |
**DRUGS** |
**TOBACCO** |
**ALCOHOL** |
**GAMBLING** |
**HATE_SYMBOLS** |


