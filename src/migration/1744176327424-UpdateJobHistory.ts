import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateJobHistory1744176327424 implements MigrationInterface {
    name = 'UpdateJobHistory1744176327424'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`jobhistory\` ADD \`type\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`jobhistory\` ADD \`status\` varchar(255) NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE \`jobhistory\` ADD \`assigneeAssigneeId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`jobhistory\` ADD \`deviceDeviceId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`jobhistory\` ADD CONSTRAINT \`FK_b4f54100d0278a1a378c1c0bedc\` FOREIGN KEY (\`assigneeAssigneeId\`) REFERENCES \`assignee\`(\`assigneeid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`jobhistory\` ADD CONSTRAINT \`FK_e46593628270f4a6f729bbd12f3\` FOREIGN KEY (\`deviceDeviceId\`) REFERENCES \`device\`(\`deviceid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`jobhistory\` DROP FOREIGN KEY \`FK_e46593628270f4a6f729bbd12f3\``);
        await queryRunner.query(`ALTER TABLE \`jobhistory\` DROP FOREIGN KEY \`FK_b4f54100d0278a1a378c1c0bedc\``);
        await queryRunner.query(`ALTER TABLE \`jobhistory\` DROP COLUMN \`deviceDeviceId\``);
        await queryRunner.query(`ALTER TABLE \`jobhistory\` DROP COLUMN \`assigneeAssigneeId\``);
        await queryRunner.query(`ALTER TABLE \`jobhistory\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`jobhistory\` DROP COLUMN \`type\``);
    }

}
