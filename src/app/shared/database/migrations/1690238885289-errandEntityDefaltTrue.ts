import { MigrationInterface, QueryRunner } from "typeorm";

export class errandEntityDefaltTrue1690238885289 implements MigrationInterface {
  name = "errandEntityDefaltTrue1690238885289";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "errands"."errands" ALTER COLUMN "is_archived" SET DEFAULT false`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "errands"."errands" ALTER COLUMN "is_archived" SET DEFAULT true`
    );
  }
}
