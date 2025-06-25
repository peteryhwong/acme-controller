import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOfflineJobId1748249329282 implements MigrationInterface {
    name = 'AddOfflineJobId1748249329282'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job\` ADD \`offlinejobid\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job\` DROP COLUMN \`offlinejobid\``);
    }

}
