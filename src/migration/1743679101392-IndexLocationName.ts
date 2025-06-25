import { MigrationInterface, QueryRunner } from "typeorm";

export class IndexLocationName1743679101392 implements MigrationInterface {
    name = 'IndexLocationName1743679101392'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`assignee\` MODIFY COLUMN \`number\` int NOT NULL`);
        await queryRunner.query(`DROP INDEX \`number\` ON \`assignee\``);
        await queryRunner.query(`ALTER TABLE \`job\` MODIFY COLUMN \`number\` int NOT NULL`);
        await queryRunner.query(`DROP INDEX \`number\` ON \`job\``);
        await queryRunner.query(`ALTER TABLE \`location\` ADD UNIQUE INDEX \`IDX_f0336eb8ccdf8306e270d400cf\` (\`name\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
