import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateJobStatus1744176493621 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE job SET status = 'standby' WHERE status = 'accepted'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
