import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDeviceAndEvent1743148851885 implements MigrationInterface {
    name = 'CreateDeviceAndEvent1743148851885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`event\` (\`eventid\` varchar(36) NOT NULL, \`version\` int NOT NULL DEFAULT '1', \`datetime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`type\` text NOT NULL, \`detail\` json NOT NULL, \`status\` varchar(255) NOT NULL DEFAULT 'pending', \`runnerid\` text NULL, \`schedule\` datetime NULL, \`starttime\` decimal NULL, \`endtime\` decimal NULL, \`duration\` decimal NULL, \`priority\` int NOT NULL DEFAULT '100000', PRIMARY KEY (\`eventid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`device\` (\`deviceid\` varchar(36) NOT NULL, \`version\` int NOT NULL DEFAULT '1', \`datetime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`code\` text NOT NULL, \`type\` text NOT NULL, \`location\` text NOT NULL, \`hash\` text NOT NULL, PRIMARY KEY (\`deviceid\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`device\``);
        await queryRunner.query(`DROP TABLE \`event\``);
    }

}
