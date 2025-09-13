import dotenv from 'dotenv';
import { MikroORM } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

dotenv.config();

export const orm = await MikroORM.init({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    dbName: process.env.DB_NAME || 'sportsdb',
    type: 'mysql',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    highlighter: new SqlHighlighter(),
    debug: true,
    schemaGenerator: {
        // never in production
        disableForeignKeys: false,
        createForeignKeyConstraints: true,
        ignoreSchema: [],
    },
});

export const syncSchema = async () => {
    const generator = orm.getSchemaGenerator();
    await generator.dropSchema();
    await generator.createSchema();
    await generator.updateSchema();
};
