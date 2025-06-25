import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEvent1743383775718 implements MigrationInterface {
    name = 'UpdateEvent1743383775718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`device\` ADD \`status\` varchar(255) NOT NULL DEFAULT 'offline'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`device\` DROP COLUMN \`status\``);
    }

}
