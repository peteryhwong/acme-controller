import { MigrationInterface, QueryRunner } from "typeorm";

export class JobLocationAssignee1743662545283 implements MigrationInterface {
    name = 'JobLocationAssignee1743662545283'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`device\` DROP COLUMN \`location\``);
        await queryRunner.query(`ALTER TABLE \`job\` ADD \`number\` int NOT NULL AUTO_INCREMENT UNIQUE`);
        await queryRunner.query(`ALTER TABLE \`device\` ADD \`locationLocationId\` varchar(36) NULL`);
        await queryRunner.query(`CREATE TABLE \`assignee\` (\`assigneeid\` varchar(36) NOT NULL, \`datetime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`version\` int NOT NULL DEFAULT '1', \`number\` int NOT NULL AUTO_INCREMENT UNIQUE, \`locationLocationId\` varchar(36) NULL, PRIMARY KEY (\`assigneeid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`location\` (\`locationid\` varchar(36) NOT NULL, \`datetime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`version\` int NOT NULL DEFAULT '1', \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`locationid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`assignee\` ADD CONSTRAINT \`FK_07481c65c1747b1575b149c095b\` FOREIGN KEY (\`locationLocationId\`) REFERENCES \`location\`(\`locationid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`device\` ADD CONSTRAINT \`FK_0be144212fd6c74797e3a8a45a5\` FOREIGN KEY (\`locationLocationId\`) REFERENCES \`location\`(\`locationid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(_queryRunner: QueryRunner): Promise<void> {
    }

}
