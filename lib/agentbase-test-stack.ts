import { StackProps } from "aws-cdk-lib";
import { IVpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { config } from "../configs";
import { AgentBaseStackConstruct } from "./agentbase-cdk-stack";

interface AgentBaseTestStackProps {
  vpc: IVpc;
  extraValues?: object;
}

export class AgentBaseTestStackConstruct extends AgentBaseStackConstruct {
  constructor(scope: Construct, id: string, agentbaseProps: AgentBaseTestStackProps, props: StackProps) {
    super(scope, id, {
      ...agentbaseProps,
      config: config.testConfig,
    }, {
      ...props,
    });
  }
}