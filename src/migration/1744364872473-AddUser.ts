import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUser1744364872473 implements MigrationInterface {
    name = 'AddUser1744364872473'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`userid\` varchar(36) NOT NULL, \`datetime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`version\` int NOT NULL DEFAULT '1', \`usernumber\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`locationLocationId\` varchar(36) NULL, UNIQUE INDEX \`IDX_caf71ec5fd5c46ecffd9076e84\` (\`usernumber\`), PRIMARY KEY (\`userid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`job\` ADD \`userUserId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`job\` ADD CONSTRAINT \`FK_d1f2535be71f9d090001f974ff5\` FOREIGN KEY (\`userUserId\`) REFERENCES \`user\`(\`userid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_78570f20db7237bc804c48bc9ae\` FOREIGN KEY (\`locationLocationId\`) REFERENCES \`location\`(\`locationid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_78570f20db7237bc804c48bc9ae\``);
        await queryRunner.query(`ALTER TABLE \`job\` DROP FOREIGN KEY \`FK_d1f2535be71f9d090001f974ff5\``);
        await queryRunner.query(`ALTER TABLE \`job\` DROP COLUMN \`userUserId\``);
        await queryRunner.query(`DROP INDEX \`IDX_caf71ec5fd5c46ecffd9076e84\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
