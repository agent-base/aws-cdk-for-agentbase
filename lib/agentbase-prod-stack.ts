import { StackProps } from "aws-cdk-lib";
import { IVpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { config } from "../configs";
import { AgentBaseStackConstruct } from "./agentbase-cdk-stack";

interface AgentBaseProdStackProps {
  vpc: IVpc;
  extraValues?: object;
}

export class AgentBaseProdStackConstruct extends AgentBaseStackConstruct {
  constructor(scope: Construct, id: string, agentbaseProps: AgentBaseProdStackProps, props: StackProps) {
    super(scope, id, {
      ...agentbaseProps,
      config: config.prodConfig,
    }, {
      ...props,
    });
  }
}