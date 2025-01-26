#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { DbStack } from "../lib/db-stack";
import { LambdaStack } from "../lib/lambda-stack";
import { SecretsStack } from "../lib/secrets-stack";
import { VpcStack } from "../lib/vpc-stack";

const app = new cdk.App();

const vpcStack = new VpcStack(app, "VpcStack");

const prismaSecretStack = new SecretsStack(app, "PrismaDbSecretStack");
const prismaDbStack = new DbStack(app, "PrismaDbStack", {
  vpc: vpcStack.vpc,
  dbSecret: prismaSecretStack.dbSecret,
});

const drizzleSecretStack = new SecretsStack(app, "DrizzleSecretStack");
const drizzleDbStack = new DbStack(app, "DrizzleDbStack", {
  vpc: vpcStack.vpc,
  dbSecret: drizzleSecretStack.dbSecret,
});

const lambdaStack = new LambdaStack(app, "LambdaStack", {
  drizzleHost: drizzleDbStack.publicIp,
  drizzleSecret: drizzleSecretStack.dbSecret,
  prismaHost: prismaDbStack.publicIp,
  prismaSecret: prismaSecretStack.dbSecret,
});
