const { AwsCdkConstructLibrary } = require('projen');

const project = new AwsCdkConstructLibrary({
  author: 'Pahud',
  authorAddress: 'pahudnet@gmail.com',
  cdkVersion: '1.95.2',
  defaultReleaseBranch: 'main',
  jsiiFqn: 'projen.AwsCdkConstructLibrary',
  name: 'cdk-image-moderation',
  repositoryUrl: 'https://github.com/pahud/cdk-image-moderation.git',
  cdkDependencies: [
    '@aws-cdk/core',
    '@aws-cdk/aws-s3',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-sns',
    '@aws-cdk/aws-sns-subscriptions',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-lambda-nodejs',
    '@aws-cdk/aws-s3-notifications',
  ],
  deps: [
    'esbuild',
    'aws-sdk',
    'axios',
  ],
  bundledDeps: [
    'aws-sdk',
    'axios',
    'esbuild',
  ],
  dependabot: false,
});

const common_exclude = [
  'cdk.out',
  'cdk.context.json',
  'yarn-error.log',
  'dependabot.yml',
  'demo_images',
  '.env',
];
project.npmignore.exclude(...common_exclude, 'images');
project.gitignore.exclude(...common_exclude);


project.synth();
