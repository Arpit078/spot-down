import pg from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;

const config = {
    host: process.env.PGHOST || 'postgres',  // Ensure this points to 'postgres'
    port: process.env.PGPORT || 5432,
    database: process.env.PGDATABASE || 'spotdowndb',  // Ensure the database name matches your docker-compose.yaml
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'spot-down-db-password',
};

const postgres_client = new Client(config);
await postgres_client.connect();

export { postgres_client };
