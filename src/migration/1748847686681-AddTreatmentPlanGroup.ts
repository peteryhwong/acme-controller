import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTreatmentPlanGroup1748847686681 implements MigrationInterface {
    name = 'AddTreatmentPlanGroup1748847686681'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_157fd64d3ac69ea3e2599962d2\` ON \`treatmentplan\``);
        await queryRunner.query(`ALTER TABLE \`treatmentplan\` ADD \`group\` varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_79007746890f6f14f30441b797\` ON \`treatmentplan\` (\`name\`, \`group\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_79007746890f6f14f30441b797\` ON \`treatmentplan\``);
        await queryRunner.query(`ALTER TABLE \`treatmentplan\` DROP COLUMN \`group\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_157fd64d3ac69ea3e2599962d2\` ON \`treatmentplan\` (\`name\`)`);
    }

}
