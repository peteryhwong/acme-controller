import { MigrationInterface, QueryRunner } from "typeorm";

export class UniqueDeviceCode1743594881419 implements MigrationInterface {
    name = 'UniqueDeviceCode1743594881419'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`device\` CHANGE \`code\` \`code\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`device\` ADD UNIQUE INDEX \`IDX_f443a15b68542d0a53a2b8c472\` (\`code\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`device\` DROP INDEX \`IDX_f443a15b68542d0a53a2b8c472\``);
    }

}
