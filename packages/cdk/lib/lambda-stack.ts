import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as secretmanager from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface LambdaStackProps extends cdk.StackProps {
  prismaSecret: secretmanager.Secret;
  prismaHost: string;
  drizzleSecret: secretmanager.Secret;
  drizzleHost: string;
}

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const paramsAndSecrets = lambda.ParamsAndSecretsLayerVersion.fromVersion(
      lambda.ParamsAndSecretsVersions.V1_0_103,
      {
        cacheSize: 500,
        logLevel: lambda.ParamsAndSecretsLogLevel.DEBUG,
      }
    );

    const prismaFunction = new NodejsFunction(this, "PrismaFunction", {
      entry: "lambda/prisma.ts",
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_20_X,
      paramsAndSecrets: paramsAndSecrets,
      environment: {
        SECRET_NAME: props.prismaSecret.secretName,
      },
    });
    props.prismaSecret.grantRead(prismaFunction);
    const prismaFunctionUrl = prismaFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });
    new cdk.CfnOutput(this, "PrismaFunctionUrl", {
      value: prismaFunctionUrl.url,
    });

    const drizzleFunction = new NodejsFunction(this, "DrizzleFunction", {
      entry: "lambda/drizzle.ts",
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_20_X,
      paramsAndSecrets: paramsAndSecrets,
      environment: {
        SECRET_NAME: props.drizzleSecret.secretName,
      },
    });
    props.drizzleSecret.grantRead(drizzleFunction);
    const drizzleFunctionUrl = drizzleFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });
    new cdk.CfnOutput(this, "DrizzleFunctionUrl", {
      value: drizzleFunctionUrl.url,
    });
  }
}
