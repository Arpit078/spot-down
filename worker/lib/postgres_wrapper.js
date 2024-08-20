import pg from 'pg';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
const { Client } = pg;


const config = {
    host: 'host.docker.internal', 
    port: 5432, 
    database: 'spot_down',
    user: 'postgres',
    password: (process.env.POSTGRES_PASSWORD).toString(),
};

const postgres_client = new Client(config);
await postgres_client.connect();

export { postgres_client };
