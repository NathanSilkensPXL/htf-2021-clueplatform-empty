#!/bin/bash
export STACK_NAME=Kaasje-htf2021-clueprocessing-handlers
export MY_REGION=eu-central-1
export MY_DEV_BUCKET=htf-deploymentbucket

# Package new cloudformation package
aws cloudformation package --template templates/handlers/template.yaml --s3-bucket $MY_DEV_BUCKET --output-template export-notification-channel-handlers.yaml --region $MY_REGION
# Deploy 
sam deploy --region $MY_REGION --template-file export-notification-channel-handlers.yaml --stack-name $STACK_NAME --capabilities CAPABILITY_NAMED_IAM --parameter-overrides Stage=dev