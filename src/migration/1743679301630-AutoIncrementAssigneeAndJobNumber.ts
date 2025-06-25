import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoIncrementAssigneeAndJobNumber1743679301630 implements MigrationInterface {
    name = 'AutoIncrementAssigneeAndJobNumber1743679301630'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`assignee\` MODIFY COLUMN \`number\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`job\` MODIFY COLUMN \`number\` int NOT NULL AUTO_INCREMENT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
