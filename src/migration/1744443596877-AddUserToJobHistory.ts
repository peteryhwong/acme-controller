import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserToJobHistory1744443596877 implements MigrationInterface {
    name = 'AddUserToJobHistory1744443596877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`jobhistory\` ADD \`userUserId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`jobhistory\` ADD CONSTRAINT \`FK_2e0a7ed4d4b43e19f4c6aa2337a\` FOREIGN KEY (\`userUserId\`) REFERENCES \`user\`(\`userid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`jobhistory\` DROP FOREIGN KEY \`FK_2e0a7ed4d4b43e19f4c6aa2337a\``);
        await queryRunner.query(`ALTER TABLE \`jobhistory\` DROP COLUMN \`userUserId\``);
    }

}
