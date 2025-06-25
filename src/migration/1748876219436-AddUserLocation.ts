import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserLocation1748876219436 implements MigrationInterface {
    name = 'AddUserLocation1748876219436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_caf71ec5fd5c46ecffd9076e84\` ON \`user\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_201b1569266af5c4bf0f183aaa\` ON \`user\` (\`usernumber\`, \`locationLocationId\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_201b1569266af5c4bf0f183aaa\` ON \`user\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_caf71ec5fd5c46ecffd9076e84\` ON \`user\` (\`usernumber\`)`);
    }

}
