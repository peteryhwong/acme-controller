import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateJobAndCommand1743481141427 implements MigrationInterface {
    name = 'CreateJobAndCommand1743481141427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`command\` (\`commandid\` varchar(36) NOT NULL, \`version\` int NOT NULL DEFAULT '1', \`datetime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`detail\` json NOT NULL, \`status\` varchar(255) NOT NULL DEFAULT 'pending', \`deviceDeviceId\` varchar(36) NULL, \`jobJobId\` varchar(36) NULL, PRIMARY KEY (\`commandid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`job\` (\`jobid\` varchar(36) NOT NULL, \`version\` int NOT NULL DEFAULT '1', \`datetime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`type\` varchar(255) NOT NULL, \`detail\` json NOT NULL, \`status\` varchar(255) NOT NULL DEFAULT 'pending', \`deviceDeviceId\` varchar(36) NULL, PRIMARY KEY (\`jobid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`command\` ADD CONSTRAINT \`FK_7a0ad591138ec49c012a79676e5\` FOREIGN KEY (\`deviceDeviceId\`) REFERENCES \`device\`(\`deviceid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`command\` ADD CONSTRAINT \`FK_4ece7ee7f9d6bf29a4cb722717c\` FOREIGN KEY (\`jobJobId\`) REFERENCES \`job\`(\`jobid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`job\` ADD CONSTRAINT \`FK_55cb15304b52aa7bb95b6d76bd3\` FOREIGN KEY (\`deviceDeviceId\`) REFERENCES \`device\`(\`deviceid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job\` DROP FOREIGN KEY \`FK_55cb15304b52aa7bb95b6d76bd3\``);
        await queryRunner.query(`ALTER TABLE \`command\` DROP FOREIGN KEY \`FK_4ece7ee7f9d6bf29a4cb722717c\``);
        await queryRunner.query(`ALTER TABLE \`command\` DROP FOREIGN KEY \`FK_7a0ad591138ec49c012a79676e5\``);
        await queryRunner.query(`DROP TABLE \`job\``);
        await queryRunner.query(`DROP TABLE \`command\``);
    }

}
