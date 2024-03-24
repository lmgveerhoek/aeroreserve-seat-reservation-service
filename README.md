# AeroReserve Seat Reservation Service

This repository contains the source code for the AeroReserve Seat Reservation Service. This service is responsible for managing seat reservations for the AeroReserve application. It is built using Node.js and contains a Zeebe worker that listens for messages from the Ticket Booking Service. 

The application is deployed to AWS using AWS Copilot.

## Requirements

Before you begin, ensure that you have the following installed:

- Node.js
- AWS CLI
- AWS Copilot CLI

This application needs to be able to connect to the following services:
- Ticket Booking Service

Furthermore, the following parameters should be present in the AWS Systems Manager Parameter Store, so that the application can connect to the Zeebe cluster and the Ticket Booking Service. The parameters should be stored in the following paths:
- /copilot/aeroreserve/prod/secrets/AUTHORIZATION_SERVER_URL
- /copilot/aeroreserve/prod/secrets/CLIENT_ID
- /copilot/aeroreserve/prod/secrets/CLIENT_SECRET	
- /copilot/aeroreserve/prod/secrets/CLUSTER_ID	
- /copilot/aeroreserve/prod/secrets/CLUSTER_REGION
- /copilot/aeroreserve/prod/secrets/ZEEBE_ADDRESS

To test the application locally, you can create a `.env` file in the root directory of the project with the following parameters:

``` 
  ZEEBE_ADDRESS =
  ZEEBE_CLIENT_ID =
  ZEEBE_CLIENT_SECRET =
  ZEEBE_AUTHORIZATION_SERVER_URL =
```

## Running the Application through Node.js

To run the application, you can use the following commands:

```bash
npm install
npm start
```

## Running the Application through Docker

1. Build Docker Image

   ```bash
   docker build -t [IMAGE_NAME] .
   ````

2. Run Docker Image

   ```bash
    docker run -d --name [CONTAINER_NAME] --volume ./.env:/app/.env [IMAGE_NAME]
   ````

3. (Optional) Docker logs

   ```bash
    docker logs [CONTAINER_NAME]
   ````

## Deploying the Application to AWS

This application is deployed to AWS Fargate which is a serverless compute engine for containers that runs and scales containers without having to manage servers or clusters.

1. Ensure you have the AWS Copilot CLI installed and configured with valid credentials.

2. From the root directory of the project, run the following command:

```bash
copilot deploy
```

This will build and deploy the application to Fargate. It will automatically create the necessary ECS cluster, task definition, and services.

3. Specify the environment (test, prod etc.) as a parameter to target different environments.

4. The application will be available at the load balancer URL returned after successful deployment.

Logs can be viewed in CloudWatch Logs and metrics in CloudWatch. Auto scaling of services is also supported based on CPU or memory metrics.

5. Create the pipeline for the application:

```bash
copilot pipeline deploy
```

This will create a CodePipeline that will automatically deploy the application when changes are pushed to the repository.

5. To delete the application, run the following command:

```bash
copilot app delete
```


