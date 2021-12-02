$STACK_NAME="Kaasje-htf2021-clueprocessing-core"
$MY_REGION="eu-west-1"
$MY_DEV_BUCKET="htf-deploymentbucket2"

# Package new cloudformation package
aws cloudformation package --template templates/core/template.yaml --s3-bucket $MY_DEV_BUCKET --output-template export-clue-processing-service.yaml --region $MY_REGION
# Deploy 
sam deploy --region $MY_REGION --template-file export-clue-processing-service.yaml --stack-name $STACK_NAME --capabilities CAPABILITY_NAMED_IAM --parameter-overrides Stage=dev