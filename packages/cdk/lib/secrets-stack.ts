import * as cdk from "aws-cdk-lib";
import * as secretmanager from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SecretsStack extends cdk.Stack {
  public dbSecret: secretmanager.Secret;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dbSecret = new secretmanager.Secret(this, "dbSecret", {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: "postgres" }),
        generateStringKey: "password",
        excludeCharacters: '"@/\\\'"#$[]{}()^¥;:%!',
      },
    });

    this.dbSecret = dbSecret;
  }
}
