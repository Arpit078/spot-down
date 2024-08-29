import pg from 'pg';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const { Client } = pg;

const config = {
    host: 'postgres',  // Use the service name 'postgres'
    port: 5432, 
    database: 'spotdowndb',  // Ensure this matches the database name in the docker-compose.yaml
    user: 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'spot-down-db-password',  // Use the environment variable
};

const postgres_client = new Client(config);
await postgres_client.connect();

export { postgres_client };
