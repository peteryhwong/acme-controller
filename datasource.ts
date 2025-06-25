import { DataSource } from 'typeorm';

export default new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "dummy",
    database: "ac_control",
    entities: [
        'src/entity/*.ts'
    ],
});
