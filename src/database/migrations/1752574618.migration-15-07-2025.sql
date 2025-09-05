ALTER TABLE "company" DROP CONSTRAINT "FK_e30c10055c199565d44daa681fa";
CREATE TABLE "company_categories_company_category" ("company_id" uuid NOT NULL, "company_category_id" uuid NOT NULL, CONSTRAINT "PK_abb554fb5e4c2a26feec2ff6f89" PRIMARY KEY ("company_id", "company_category_id"));
CREATE INDEX "IDX_4baa9968b7d7a3abb41ecc7165" ON "company_categories_company_category" ("company_id");
CREATE INDEX "IDX_a8e698a3118204e26f14f6ed69" ON "company_categories_company_category" ("company_category_id");
ALTER TABLE "company" DROP COLUMN "category_id";
ALTER TABLE "company_categories_company_category" ADD CONSTRAINT "FK_4baa9968b7d7a3abb41ecc7165f" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "company_categories_company_category" ADD CONSTRAINT "FK_a8e698a3118204e26f14f6ed694" FOREIGN KEY ("company_category_id") REFERENCES "company_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
