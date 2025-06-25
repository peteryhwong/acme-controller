import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTreatmentPlanUpdateDate1748163662735 implements MigrationInterface {
    name = 'AddTreatmentPlanUpdateDate1748163662735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`treatmentplan\` CHANGE \`datetime\` \`datetime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`treatmentplan\` CHANGE \`datetime\` \`datetime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

}
