CREATE TABLE "company_offer_attachments_file" ("company_offer_id" uuid NOT NULL, "file_id" uuid NOT NULL, CONSTRAINT "PK_6be85e0a59e08f4f08a8f1d1ac9" PRIMARY KEY ("company_offer_id", "file_id"));
CREATE INDEX "IDX_25a1049acc40eb46c53d9811b6" ON "company_offer_attachments_file" ("company_offer_id");
CREATE INDEX "IDX_317a3db7f044b0bc2c35330946" ON "company_offer_attachments_file" ("file_id");
ALTER TABLE "company_offer_attachments_file" ADD CONSTRAINT "FK_25a1049acc40eb46c53d9811b60" FOREIGN KEY ("company_offer_id") REFERENCES "company_offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "company_offer_attachments_file" ADD CONSTRAINT "FK_317a3db7f044b0bc2c35330946e" FOREIGN KEY ("file_id") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE;
