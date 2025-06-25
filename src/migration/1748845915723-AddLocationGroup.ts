import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLocationGroup1748845915723 implements MigrationInterface {
    name = 'AddLocationGroup1748845915723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_f0336eb8ccdf8306e270d400cf\` ON \`location\``);
        await queryRunner.query(`ALTER TABLE \`location\` ADD \`group\` varchar(255) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_0a4f3601083aceb8f8e2193210\` ON \`location\` (\`name\`, \`group\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_0a4f3601083aceb8f8e2193210\` ON \`location\``);
        await queryRunner.query(`ALTER TABLE \`location\` DROP COLUMN \`group\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_f0336eb8ccdf8306e270d400cf\` ON \`location\` (\`name\`)`);
    }

}
