import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAssignee1743934211138 implements MigrationInterface {
    name = 'UpdateAssignee1743934211138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`assignee\` ADD UNIQUE INDEX \`IDX_cd8a54590ebebb3e9a7ad3ccce\` (\`username\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`assignee\` DROP INDEX \`IDX_cd8a54590ebebb3e9a7ad3ccce\``);
    }

}
