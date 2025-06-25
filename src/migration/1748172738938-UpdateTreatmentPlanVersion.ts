import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTreatmentPlanVersion1748172738938 implements MigrationInterface {
    name = 'UpdateTreatmentPlanVersion1748172738938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`treatmentplanhistory\` CHANGE \`version\` \`version\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`treatmentplanhistory\` CHANGE \`version\` \`version\` int NOT NULL DEFAULT '1'`);
    }

}
