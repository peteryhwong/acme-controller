import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultTreatmentPlans1748350877763 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE \`treatmentplan\` 
            SET \`tens\` = '10', \`ultrasound\` = '20'
            WHERE 
                \`name\` IN ('pronew001', 'pronew002', 'pronew003', 'pronew004', 'pronew005', 'pronew006', 'pronew007', 'pronew008') AND 
                \`tens\` = '0' AND 
                \`ultrasound\` = '0'
            ;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
