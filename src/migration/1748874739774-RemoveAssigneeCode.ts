import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveAssigneeCode1748874739774 implements MigrationInterface {
    name = 'RemoveAssigneeCode1748874739774'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_cd8a54590ebebb3e9a7ad3ccce\` ON \`assignee\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_11f9969e8cdc0f637651bb76ae\` ON \`assignee\` (\`username\`, \`locationLocationId\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_11f9969e8cdc0f637651bb76ae\` ON \`assignee\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_cd8a54590ebebb3e9a7ad3ccce\` ON \`assignee\` (\`username\`)`);
    }

}
