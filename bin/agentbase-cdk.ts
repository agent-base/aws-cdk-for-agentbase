#!/usr/bin/env node

// Load environment variables
import './loadenv';

import { App } from 'aws-cdk-lib';
import { IVpc } from 'aws-cdk-lib/aws-ec2';
import 'source-map-support/register';
import { config } from '../configs';
import { AgentBaseProdStackConstruct } from '../lib/agentbase-prod-stack';
import { AgentBaseTestStackConstruct } from '../lib/agentbase-test-stack';
import { ImportedVPCStack, VPCStack } from '../lib/vpc-stack';

const app = new App();

const environment = process.env.ENVIRONMENT;

if (!environment || !['test', 'prod'].includes(environment)) {
  throw new Error("Please provide a valid environment name ('test' or 'prod')");
}

console.log(`Detected environment: ${environment}`);

const deployVpcId = process.env.DEPLOY_VPC_ID;
let myVpc: IVpc | undefined;

if (deployVpcId) {
  console.log(`Deploying to existing VPC with ID: ${deployVpcId}`);
  myVpc = new ImportedVPCStack(app, `Existing-${deployVpcId}`, {
    env: {
      account: config.prodConfig.account,
      region: config.prodConfig.region,
    },
    description: 'AgentBase VPC from existing VPC',
  }).vpc;
}

const deployStack = (
  stackName: string,
  vpc: IVpc,
  envConfig: { account: string; region: string },
  description: string,
  StackConstruct: typeof AgentBaseTestStackConstruct | typeof AgentBaseProdStackConstruct
) => {
  new StackConstruct(app, stackName, { vpc }, {
    env: {
      account: envConfig.account,
      region: envConfig.region,
    },
    description,
  }).build();
};

if (environment === 'test') {
  const vpcTest = myVpc || new VPCStack(app, 'AgentBaseVPCTest', {
    env: {
      account: config.testConfig.account,
      region: config.testConfig.region,
    },
    description: 'AgentBase Testing VPC',
  }).vpc;

  deployStack('AgentBaseStackTest', vpcTest, config.testConfig, 'AgentBase Testing Environment', AgentBaseTestStackConstruct);
}

if (environment === 'prod') {
  const vpcProd = myVpc || new VPCStack(app, 'AgentBaseVPCProd', {
    env: {
      account: config.prodConfig.account,
      region: config.prodConfig.region,
    },
    description: 'AgentBase Production VPC',
  }).vpc;

  deployStack('AgentBaseStackProd', vpcProd, config.prodConfig, 'AgentBase Production Environment', AgentBaseProdStackConstruct);
}
