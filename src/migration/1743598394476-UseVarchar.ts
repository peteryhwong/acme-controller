import { MigrationInterface, QueryRunner } from "typeorm";

export class UseVarchar1743598394476 implements MigrationInterface {
    name = 'UseVarchar1743598394476'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`device\` CHANGE \`type\` \`type\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`device\` CHANGE \`location\` \`location\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`device\` CHANGE \`location\` \`location\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`device\` CHANGE \`type\` \`type\` text NOT NULL`);
    }

}
