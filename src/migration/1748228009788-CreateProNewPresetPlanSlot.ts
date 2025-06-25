import { MigrationInterface, QueryRunner } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

export class CreateProNewPresetPlanSlot1748228009788 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO treatmentplan (treatmentplanid, type, name, ultrasound, tens)
            VALUES 
            ('${uuidv4()}', 'pronew', 'pronew008', 0, 0)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
