# Email Service

## Installation & Usage Instruction

To install the dependencies run `npm install`

Build the service with `npm run build` and start it in development mode with `npm run start:dev`

Running the `start:dev` script expects a file named `secrete_setup.sh` to be present in the root directory of the repository. The script should export all environment variables that the service requires to run, i.e. `export VARIABLE=VALUE`. A list of the required environment variables can be found in the [`now.json`](now.json).

If you want to connect to a new database, the DB setup instructions can be found in [`dbSetup.sql`](build/dbSetup.sql).

The service accepts `GET` and `POST` requests for GraphQL queries.

The current version on master gets automatically deployed to https://mail.api.productcube.io
