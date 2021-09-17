const { AwsCdkConstructLibrary, DependenciesUpgradeMechanism } = require('projen');
const { Mergify } = require('projen/lib/github');

const AUTOMATION_TOKEN = 'PROJEN_GITHUB_TOKEN';

const project = new AwsCdkConstructLibrary({
  author: 'Pahud Hsieh',
  authorAddress: 'pahudnet@gmail.com',
  cdkVersion: '1.95.2',
  defaultReleaseBranch: 'main',
  jsiiFqn: 'projen.AwsCdkConstructLibrary',
  name: 'cdk-image-moderation',
  description: 'Event-driven image moderation and notification with AWS CDK',
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
  depsUpgrade: DependenciesUpgradeMechanism.githubWorkflow({
    ignoreProjen: false,
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      secret: AUTOMATION_TOKEN,
    },
  }),
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['pahud'],
  },
  mergify: false,
  jestOptions: {
    jestConfig: {
      setupFilesAfterEnv: ['./test/jest.setup.js'],
    },
  },
  publishToPypi: {
    distName: 'cdk-image-moderation',
    module: 'cdk_image_moderation',
  },
});

const mergifyRules = [
  {
    name: 'Automatic merge on approval and successful build',
    actions: {
      merge: {
        method: 'squash',
        commit_message: 'title+body',
        strict: 'smart',
        strict_method: 'merge',
      },
      delete_head_branch: {},
    },
    conditions: [
      '#approved-reviews-by>=1',
      'status-success=build',
      '-title~=(WIP|wip)',
      '-label~=(blocked|do-not-merge)',
    ],
  },
  {
    name: 'Automatic merge PRs with auto-merge label upon successful build',
    actions: {
      merge: {
        method: 'squash',
        commit_message: 'title+body',
        strict: 'smart',
        strict_method: 'merge',
      },
      delete_head_branch: {},
    },
    conditions: [
      'label=auto-merge',
      'status-success=build',
      '-title~=(WIP|wip)',
      '-label~=(blocked|do-not-merge)',
    ],
  },
];

new Mergify(project.github, {
  rules: mergifyRules,
});


project.package.addField('resolutions', {
  'pac-resolver': '^5.0.0',
  'set-value': '^4.0.1',
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
