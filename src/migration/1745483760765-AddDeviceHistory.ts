import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeviceHistory1745483760765 implements MigrationInterface {
    name = 'AddDeviceHistory1745483760765'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`devicehistory\` (\`devicehistoryid\` varchar(36) NOT NULL, \`version\` int NOT NULL DEFAULT '1', \`datetime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`detail\` json NOT NULL, \`deviceDeviceId\` varchar(36) NULL, PRIMARY KEY (\`devicehistoryid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`devicehistory\` ADD CONSTRAINT \`FK_baa04b74c170f0e19e7bad7a5a2\` FOREIGN KEY (\`deviceDeviceId\`) REFERENCES \`device\`(\`deviceid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`devicehistory\` DROP FOREIGN KEY \`FK_baa04b74c170f0e19e7bad7a5a2\``);
        await queryRunner.query(`DROP TABLE \`devicehistory\``);
    }

}
