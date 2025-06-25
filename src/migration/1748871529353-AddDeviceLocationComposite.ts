import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeviceLocationComposite1748871529353 implements MigrationInterface {
    name = 'AddDeviceLocationComposite1748871529353'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_f443a15b68542d0a53a2b8c472\` ON \`device\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_98a724cde5ba640069e43698a6\` ON \`device\` (\`code\`, \`locationLocationId\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_98a724cde5ba640069e43698a6\` ON \`device\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_f443a15b68542d0a53a2b8c472\` ON \`device\` (\`code\`)`);
    }

}
