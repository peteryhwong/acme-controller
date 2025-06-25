import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAssignee1743933956753 implements MigrationInterface {
    name = 'UpdateAssignee1743933956753'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`assignee\` CHANGE \`name\` \`username\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`assignee\` DROP COLUMN \`username\``);
        await queryRunner.query(`ALTER TABLE \`assignee\` ADD \`username\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`assignee\` DROP COLUMN \`username\``);
        await queryRunner.query(`ALTER TABLE \`assignee\` ADD \`username\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`assignee\` CHANGE \`username\` \`name\` varchar(255) NOT NULL`);
    }

}
