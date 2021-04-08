import { ConnectionConfig, Pool } from 'pg';

export const pool = new Pool({
    user: process.env.db_postgres_user,
    host: process.env.db_postgres_host,
    password: process.env.db_postgres_password,
    database: process.env.db_postgres_database,
    port: process.env.db_postgres_port,
    ssl: true
} as ConnectionConfig);
