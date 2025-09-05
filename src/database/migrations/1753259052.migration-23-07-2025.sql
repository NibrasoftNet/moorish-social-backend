ALTER TABLE "user_tenant" DROP CONSTRAINT "user_tenant_company_id_fkey";
ALTER TABLE "company_offer" RENAME COLUMN "token" TO "boost_score";
ALTER TABLE "user_tenant" ADD CONSTRAINT "FK_f2f5fa0b4dc75856fe247a55444" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
