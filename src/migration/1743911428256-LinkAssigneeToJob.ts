import { MigrationInterface, QueryRunner } from "typeorm";

export class LinkAssigneeToJob1743911428256 implements MigrationInterface {
    name = 'LinkAssigneeToJob1743911428256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job\` ADD \`assigneeAssigneeId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`job\` ADD CONSTRAINT \`FK_4ab92a58f5c0cbf8b7bec093039\` FOREIGN KEY (\`assigneeAssigneeId\`) REFERENCES \`assignee\`(\`assigneeid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job\` DROP FOREIGN KEY \`FK_4ab92a58f5c0cbf8b7bec093039\``);
        await queryRunner.query(`ALTER TABLE \`job\` DROP COLUMN \`assigneeAssigneeId\``);
    }

}
