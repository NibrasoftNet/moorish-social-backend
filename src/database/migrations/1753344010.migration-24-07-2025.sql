CREATE TABLE "company_offer_files_file" ("company_offer_id" uuid NOT NULL, "file_id" uuid NOT NULL, CONSTRAINT "PK_d75db3cf95eb4cc9e5f716eb11d" PRIMARY KEY ("company_offer_id", "file_id"));
CREATE INDEX "IDX_1962739aa4c4a9e02922a14fdc" ON "company_offer_files_file" ("company_offer_id");
CREATE INDEX "IDX_8906d54491f1d68321c842d3ef" ON "company_offer_files_file" ("file_id");
ALTER TABLE "company_offer_files_file" ADD CONSTRAINT "FK_1962739aa4c4a9e02922a14fdc0" FOREIGN KEY ("company_offer_id") REFERENCES "company_offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "company_offer_files_file" ADD CONSTRAINT "FK_8906d54491f1d68321c842d3ef1" FOREIGN KEY ("file_id") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE;
