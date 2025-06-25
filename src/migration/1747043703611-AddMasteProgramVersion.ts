import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMasteProgramVersion1747043703611 implements MigrationInterface {
    name = 'AddMasteProgramVersion1747043703611'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`device\` ADD \`masterprogramversion\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`device\` DROP COLUMN \`masterprogramversion\``);
    }

}
