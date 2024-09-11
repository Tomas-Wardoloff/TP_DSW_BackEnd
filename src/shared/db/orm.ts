import { MikroORM } from "@mikro-orm/core";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";

export const orm = await MikroORM.init({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    dbName: 'sportsdb',
    type: 'mysql',
    clientUrl: 'mysql://dsw:dsw@localhost:3306/sportsdb',
    highlighter: new SqlHighlighter(),
    debug: true,
    schemaGenerator: { // never in production
        disableForeignKeys: false,
        createForeignKeyConstraints: true,
        ignoreSchema: [],
    },
})

export const syncSchema = async () => {
    const generator = orm.getSchemaGenerator();
    // await generator.dropSchema();
    // await generator.createSchema();
    await generator.updateSchema();
}