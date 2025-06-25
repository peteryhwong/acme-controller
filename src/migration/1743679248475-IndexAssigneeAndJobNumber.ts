import { MigrationInterface, QueryRunner } from "typeorm";

export class IndexAssigneeAndJobNumber1743679248475 implements MigrationInterface {
    name = 'IndexAssigneeAndJobNumber1743679248475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`assignee\` ADD UNIQUE INDEX \`IDX_6488e4620624d128432d6b3ea5\` (\`number\`)`);
        await queryRunner.query(`ALTER TABLE \`job\` ADD UNIQUE INDEX \`IDX_e9c25de93ebd0e23ef6174ce1e\` (\`number\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job\` DROP INDEX \`IDX_e9c25de93ebd0e23ef6174ce1e\``);
        await queryRunner.query(`ALTER TABLE \`assignee\` DROP INDEX \`IDX_6488e4620624d128432d6b3ea5\``);
    }

}
