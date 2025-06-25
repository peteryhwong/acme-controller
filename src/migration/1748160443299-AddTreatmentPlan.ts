import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTreatmentPlan1748160443299 implements MigrationInterface {
    name = 'AddTreatmentPlan1748160443299'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`treatmentplan\` (\`treatmentplanid\` varchar(36) NOT NULL, \`datetime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`version\` int NOT NULL DEFAULT '1', \`name\` varchar(255) NOT NULL, \`ultrasound\` int NOT NULL, \`tens\` int NOT NULL, UNIQUE INDEX \`IDX_157fd64d3ac69ea3e2599962d2\` (\`name\`), PRIMARY KEY (\`treatmentplanid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`treatmentplanhistory\` (\`treatmentplanhistoryid\` varchar(36) NOT NULL, \`version\` int NOT NULL DEFAULT '1', \`datetime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`detail\` json NOT NULL, \`author\` varchar(255) NOT NULL, \`treatmentPlanTreatmentPlanId\` varchar(36) NULL, PRIMARY KEY (\`treatmentplanhistoryid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`treatmentplanhistory\` ADD CONSTRAINT \`FK_e71890d6edb166939b3761dd122\` FOREIGN KEY (\`treatmentPlanTreatmentPlanId\`) REFERENCES \`treatmentplan\`(\`treatmentplanid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`treatmentplanhistory\` DROP FOREIGN KEY \`FK_e71890d6edb166939b3761dd122\``);
        await queryRunner.query(`DROP TABLE \`treatmentplanhistory\``);
        await queryRunner.query(`DROP INDEX \`IDX_157fd64d3ac69ea3e2599962d2\` ON \`treatmentplan\``);
        await queryRunner.query(`DROP TABLE \`treatmentplan\``);
    }

}
