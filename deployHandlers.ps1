$STACK_NAME=Kaasje-htf2021-clueprocessing-handlers
$MY_REGION=eu-west-1
$MY_DEV_BUCKET=htf-deploymentbucket2

# Package new cloudformation package
aws cloudformation package --template templates/handlers/template.yaml --s3-bucket $MY_DEV_BUCKET --output-template export-notification-channel-handlers.yaml --region $MY_REGION
# Deploy 
sam deploy --region $MY_REGION --template-file export-notification-channel-handlers.yaml --stack-name $STACK_NAME --capabilities CAPABILITY_NAMED_IAM --parameter-overrides Stage=dev