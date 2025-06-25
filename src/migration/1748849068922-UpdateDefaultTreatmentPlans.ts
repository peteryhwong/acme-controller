import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDefaultTreatmentPlans1748849068922 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE \`treatmentplan\` SET \`group\` = 'ankh';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
