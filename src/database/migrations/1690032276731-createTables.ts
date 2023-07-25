import { MigrationInterface, QueryRunner } from "typeorm";

export class createTables1690032276731 implements MigrationInterface {
    name = 'createTables1690032276731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "errands"."users" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_ate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "errands"."errands" ("errand_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_archived" boolean NOT NULL DEFAULT true, "description" character varying NOT NULL, "details" character varying, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_ate" TIMESTAMP NOT NULL DEFAULT now(), "id_user" uuid NOT NULL, CONSTRAINT "PK_81105462f0a6338a5f3efd9f7dc" PRIMARY KEY ("errand_id"))`);
        await queryRunner.query(`ALTER TABLE "errands"."errands" ADD CONSTRAINT "FK_19f7b7d8bee8381e086980e4081" FOREIGN KEY ("id_user") REFERENCES "errands"."users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "errands"."errands" DROP CONSTRAINT "FK_19f7b7d8bee8381e086980e4081"`);
        await queryRunner.query(`DROP TABLE "errands"."errands"`);
        await queryRunner.query(`DROP TABLE "errands"."users"`);
    }

}
