import { MigrationInterface, QueryRunner } from "typeorm";

export class AddJobHistory1744099237748 implements MigrationInterface {
    name = 'AddJobHistory1744099237748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`jobhistory\` (\`jobhistoryid\` varchar(36) NOT NULL, \`version\` int NOT NULL DEFAULT '1', \`datetime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`detail\` json NOT NULL, \`author\` varchar(255) NOT NULL, PRIMARY KEY (\`jobhistoryid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`job_jobhistory_jobhistory\` (\`jobJobid\` varchar(36) NOT NULL, \`jobhistoryJobhistoryid\` varchar(36) NOT NULL, INDEX \`IDX_a96badd28f45dbcc032c19783a\` (\`jobJobid\`), INDEX \`IDX_2cfa292774486382f6e8bc492d\` (\`jobhistoryJobhistoryid\`), PRIMARY KEY (\`jobJobid\`, \`jobhistoryJobhistoryid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`job_jobhistory_jobhistory\` ADD CONSTRAINT \`FK_a96badd28f45dbcc032c19783a7\` FOREIGN KEY (\`jobJobid\`) REFERENCES \`job\`(\`jobid\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`job_jobhistory_jobhistory\` ADD CONSTRAINT \`FK_2cfa292774486382f6e8bc492d7\` FOREIGN KEY (\`jobhistoryJobhistoryid\`) REFERENCES \`jobhistory\`(\`jobhistoryid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job_jobhistory_jobhistory\` DROP FOREIGN KEY \`FK_2cfa292774486382f6e8bc492d7\``);
        await queryRunner.query(`ALTER TABLE \`job_jobhistory_jobhistory\` DROP FOREIGN KEY \`FK_a96badd28f45dbcc032c19783a7\``);
        await queryRunner.query(`DROP INDEX \`IDX_2cfa292774486382f6e8bc492d\` ON \`job_jobhistory_jobhistory\``);
        await queryRunner.query(`DROP INDEX \`IDX_a96badd28f45dbcc032c19783a\` ON \`job_jobhistory_jobhistory\``);
        await queryRunner.query(`DROP TABLE \`job_jobhistory_jobhistory\``);
        await queryRunner.query(`DROP TABLE \`jobhistory\``);
    }

}
