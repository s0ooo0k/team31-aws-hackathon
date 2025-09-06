#!/bin/bash

ENV=${1:-dev}
STACK_NAME="nova-storage-$ENV"

echo "Deploying storage stack for environment: $ENV"

aws cloudformation create-stack \
  --stack-name $STACK_NAME \
  --template-body file://cloudformation/02-storage.yaml \
  --parameters file://parameters/$ENV-params.json \
  --region us-east-1

echo "Stack creation initiated. Check status with:"
echo "aws cloudformation describe-stacks --stack-name $STACK_NAME"