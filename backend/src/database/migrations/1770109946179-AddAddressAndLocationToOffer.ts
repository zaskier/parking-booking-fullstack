import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAddressAndLocationToOffer1770109946179 implements MigrationInterface {
    name = 'AddAddressAndLocationToOffer1770109946179'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offers" ADD "address" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "offers" ADD "latitude" numeric(10,7)`);
        await queryRunner.query(`ALTER TABLE "offers" ADD "longitude" numeric(10,7)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offers" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "offers" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "offers" DROP COLUMN "address"`);
    }

}
