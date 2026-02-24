import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBookingsTable1771942622064 implements MigrationInterface {
    name = 'AddBookingsTable1771942622064'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bookings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "dateFrom" date NOT NULL, "dateTo" date NOT NULL, "offerId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a9ef3fdd608e3c9c7a6531a311" ON "bookings" ("offerId", "dateFrom", "dateTo") `);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_7343292186b4fa56982d5dc4f34" FOREIGN KEY ("offerId") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_7343292186b4fa56982d5dc4f34"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a9ef3fdd608e3c9c7a6531a311"`);
        await queryRunner.query(`DROP TABLE "bookings"`);
    }

}
