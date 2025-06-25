import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTreatmentPlanType1748161299996 implements MigrationInterface {
    name = 'AddTreatmentPlanType1748161299996'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`treatmentplan\` ADD \`type\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`treatmentplan\` DROP COLUMN \`type\``);
    }

}
