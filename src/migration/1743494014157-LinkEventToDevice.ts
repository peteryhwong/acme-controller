import { MigrationInterface, QueryRunner } from "typeorm";

export class LinkEventToDevice1743494014157 implements MigrationInterface {
    name = 'LinkEventToDevice1743494014157'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`deviceDeviceId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`event\` ADD CONSTRAINT \`FK_74330b17de823453d886e1ad7f3\` FOREIGN KEY (\`deviceDeviceId\`) REFERENCES \`device\`(\`deviceid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event\` DROP FOREIGN KEY \`FK_74330b17de823453d886e1ad7f3\``);
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`deviceDeviceId\``);
    }

}
