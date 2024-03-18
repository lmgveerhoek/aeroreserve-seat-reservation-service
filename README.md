# AeroReserve Seat Reservation Service

This is the README file for the AeroReserve Seat Reservation Service project.

## Prerequisites

Before you begin, ensure that you have the following installed:

- Node.js
- Docker

## Getting Started

To get started with the AeroReserve Seat Reservation Service, follow these steps:

1. Clone the repository:

   ```bash
   git clone git@ssh.dev.azure.com:v3/AeroReserve/AeroReserve/aeroreserve-seat-reservation-service
   ````

2. Make your .env file ready:

    ```bash
    cp .env.example .env
    ````

    Make sure you fill all environment variables with the right credentials


3. Build Docker Image

   ```bash
   docker build -t [IMAGE_NAME] .
   ````

4. Run Docker Image

   ```bash
    docker run -d --name [CONTAINER_NAME] --volume ./.env:/app/.env [IMAGE_NAME]
   ````

5. (Optional) Docker logs

   ```bash
    docker logs [CONTAINER_NAME]
   ````




