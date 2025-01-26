#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { DbStack } from "../lib/db-stack";
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
