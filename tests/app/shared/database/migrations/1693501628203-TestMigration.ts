import { MigrationInterface, QueryRunner } from "typeorm";

export class TestMigration1693501628203 implements MigrationInterface {
    name = 'TestMigration1693501628203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("user_id" varchar PRIMARY KEY NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "create_at" datetime NOT NULL DEFAULT (datetime('now')), "update_ate" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"))`);
        await queryRunner.query(`CREATE TABLE "errands" ("errand_id" varchar PRIMARY KEY NOT NULL, "is_archived" boolean NOT NULL DEFAULT (0), "description" varchar NOT NULL, "details" varchar, "create_at" datetime NOT NULL DEFAULT (datetime('now')), "update_ate" datetime NOT NULL DEFAULT (datetime('now')), "id_user" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_errands" ("errand_id" varchar PRIMARY KEY NOT NULL, "is_archived" boolean NOT NULL DEFAULT (0), "description" varchar NOT NULL, "details" varchar, "create_at" datetime NOT NULL DEFAULT (datetime('now')), "update_ate" datetime NOT NULL DEFAULT (datetime('now')), "id_user" varchar NOT NULL, CONSTRAINT "FK_19f7b7d8bee8381e086980e4081" FOREIGN KEY ("id_user") REFERENCES "users" ("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_errands"("errand_id", "is_archived", "description", "details", "create_at", "update_ate", "id_user") SELECT "errand_id", "is_archived", "description", "details", "create_at", "update_ate", "id_user" FROM "errands"`);
        await queryRunner.query(`DROP TABLE "errands"`);
        await queryRunner.query(`ALTER TABLE "temporary_errands" RENAME TO "errands"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "errands" RENAME TO "temporary_errands"`);
        await queryRunner.query(`CREATE TABLE "errands" ("errand_id" varchar PRIMARY KEY NOT NULL, "is_archived" boolean NOT NULL DEFAULT (0), "description" varchar NOT NULL, "details" varchar, "create_at" datetime NOT NULL DEFAULT (datetime('now')), "update_ate" datetime NOT NULL DEFAULT (datetime('now')), "id_user" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "errands"("errand_id", "is_archived", "description", "details", "create_at", "update_ate", "id_user") SELECT "errand_id", "is_archived", "description", "details", "create_at", "update_ate", "id_user" FROM "temporary_errands"`);
        await queryRunner.query(`DROP TABLE "temporary_errands"`);
        await queryRunner.query(`DROP TABLE "errands"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
