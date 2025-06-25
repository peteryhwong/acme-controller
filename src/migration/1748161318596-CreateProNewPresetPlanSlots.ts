import { MigrationInterface, QueryRunner } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

export class CreateProNewPresetPlanSlots1748161318596 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO treatmentplan (treatmentplanid, type, name, ultrasound, tens)
            VALUES 
            ('${uuidv4()}', 'pronew', 'pronew001', 0, 0),
            ('${uuidv4()}', 'pronew', 'pronew002', 0, 0),
            ('${uuidv4()}', 'pronew', 'pronew003', 0, 0),
            ('${uuidv4()}', 'pronew', 'pronew004', 0, 0),
            ('${uuidv4()}', 'pronew', 'pronew005', 0, 0),
            ('${uuidv4()}', 'pronew', 'pronew006', 0, 0),
            ('${uuidv4()}', 'pronew', 'pronew007', 0, 0)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
