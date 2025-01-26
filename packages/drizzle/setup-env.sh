#/bin/bash
STACK_NAME="DrizzleDbStack"
DATABASE_URL=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?OutputKey=='PublicIp'].OutputValue" --output text)

STACK_NAME="DrizzleSecretStack"
SecretName=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?OutputKey=='SecretName'].OutputValue" --output text)

DATABASE_PASSWORD=$(aws secretsmanager get-secret-value --secret-id $SecretName --query SecretString --output text | jq -r '.password')
DATABASE_USERNAME=$(aws secretsmanager get-secret-value --secret-id $SecretName --query SecretString --output text | jq -r '.username')
echo "DATABASE_URL=\"postgresql://$DATABASE_USERNAME:$DATABASE_PASSWORD@$DATABASE_URL:5432/mydb?schema=public\"" >> .env