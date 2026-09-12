Let's integrate the frontend with the backend.

Step1:

Please, create two environment files in the "react-cms" frontend project:
- .env.local (This file should point to the 3 microservice ports)
- .env.development (This file should point to one unique port 8080)
- .env (The default environment will be the same as .env.local)

Make the implementation necessary to be easy to change between the environments.

Step 2:

Keep the mocked data for testing purposes but remove the callings to the mocked data from any business and dynamic logic.

In the frontend project "react-cms", implement the service layer to query the microservice endpoints.

In the frontend implement the necessary logic to work with the retrieved data from the microservices.