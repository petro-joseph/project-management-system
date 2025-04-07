import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMissingTables1743965293590 implements MigrationInterface {
    name = 'AddMissingTables1743965293590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "suppliers" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "contactPerson" character varying, "email" character varying, "phone" character varying, "address" character varying, CONSTRAINT "PK_b70ac51766a9e3144f778cfe81e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "locations" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventory_items" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "quantity" integer NOT NULL, "unitOfMeasure" character varying NOT NULL, "projectId" uuid, "purchaseDate" TIMESTAMP, "costPerUnit" numeric(12,2) NOT NULL DEFAULT '0', "totalValue" numeric(12,2) NOT NULL DEFAULT '0', "lowStockThreshold" integer NOT NULL DEFAULT '0', "category" character varying, "status" character varying NOT NULL DEFAULT 'available', "sku" character varying, "barcode" character varying, "serialNumber" character varying, "imageUrl" character varying, "locationId" integer, "supplierId" integer, CONSTRAINT "PK_cf2f451407242e132547ac19169" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "asset_categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "defaultUsefulLifeMin" integer NOT NULL, "defaultUsefulLifeMax" integer NOT NULL, "defaultDepreciationMethod" character varying NOT NULL, "defaultSalvageValuePercent" integer NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" integer, CONSTRAINT "PK_d21442187e7b0237566389805a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "fixed_assets" ("id" SERIAL NOT NULL, "assetTag" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying, "categoryId" integer NOT NULL, "acquisitionDate" TIMESTAMP NOT NULL, "originalCost" numeric(12,2) NOT NULL, "usefulLife" integer NOT NULL, "depreciationMethod" character varying NOT NULL, "salvageValue" numeric(12,2) NOT NULL, "currentValue" numeric(12,2) NOT NULL, "accumulatedDepreciation" numeric(12,2) NOT NULL, "status" character varying NOT NULL DEFAULT 'active', "location" character varying, "custodian" integer, "serialNumber" character varying, "lastDepreciationDate" TIMESTAMP, "disposalDate" TIMESTAMP, "disposalProceeds" numeric(12,2), "disposalReason" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" integer, CONSTRAINT "PK_901984c25ddf1dcf11f1c7a70d8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "depreciation_entries" ("id" SERIAL NOT NULL, "assetId" integer NOT NULL, "period" character varying NOT NULL, "amount" numeric(12,2) NOT NULL, "bookValueBefore" numeric(12,2) NOT NULL, "bookValueAfter" numeric(12,2) NOT NULL, "postingDate" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" integer, CONSTRAINT "PK_85b231da529040f2395443f35d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "disposal_entries" ("id" SERIAL NOT NULL, "assetId" integer NOT NULL, "disposalDate" TIMESTAMP NOT NULL, "disposalProceeds" numeric(12,2) NOT NULL, "disposalCosts" numeric(12,2) NOT NULL, "netBookValue" numeric(12,2) NOT NULL, "gainLoss" numeric(12,2) NOT NULL, "reason" character varying, "notes" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" integer, CONSTRAINT "PK_e10da83ba47e8e70792cf11e9be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "asset_revaluations" ("id" SERIAL NOT NULL, "assetId" integer NOT NULL, "revaluationDate" TIMESTAMP NOT NULL, "previousValue" numeric(12,2) NOT NULL, "newValue" numeric(12,2) NOT NULL, "reason" character varying, "type" character varying NOT NULL, "notes" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" integer, CONSTRAINT "PK_bea79ed5fa9e3e3c62f3442347b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activities" ("id" SERIAL NOT NULL, "userId" character varying NOT NULL, "userName" character varying NOT NULL, "action" character varying NOT NULL, "entityType" character varying NOT NULL, "entityId" character varying NOT NULL, "entityName" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "details" text, CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD CONSTRAINT "FK_fc4eda9260de95137bcd5b0671c" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD CONSTRAINT "FK_4d4ad0f71d22e3b7fc6ed325a1d" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD CONSTRAINT "FK_6928b8bc3071ae9b571f9fca34d" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fixed_assets" ADD CONSTRAINT "FK_8f2891c6b29117202c4107d4c30" FOREIGN KEY ("categoryId") REFERENCES "asset_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "depreciation_entries" ADD CONSTRAINT "FK_7ac7193684dde3bc222ca652957" FOREIGN KEY ("assetId") REFERENCES "fixed_assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "disposal_entries" ADD CONSTRAINT "FK_903ca5e01a0a42c91b2d290658d" FOREIGN KEY ("assetId") REFERENCES "fixed_assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asset_revaluations" ADD CONSTRAINT "FK_65eb082544fd64cff2e17ec1760" FOREIGN KEY ("assetId") REFERENCES "fixed_assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "asset_revaluations" DROP CONSTRAINT "FK_65eb082544fd64cff2e17ec1760"`);
        await queryRunner.query(`ALTER TABLE "disposal_entries" DROP CONSTRAINT "FK_903ca5e01a0a42c91b2d290658d"`);
        await queryRunner.query(`ALTER TABLE "depreciation_entries" DROP CONSTRAINT "FK_7ac7193684dde3bc222ca652957"`);
        await queryRunner.query(`ALTER TABLE "fixed_assets" DROP CONSTRAINT "FK_8f2891c6b29117202c4107d4c30"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP CONSTRAINT "FK_6928b8bc3071ae9b571f9fca34d"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP CONSTRAINT "FK_4d4ad0f71d22e3b7fc6ed325a1d"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP CONSTRAINT "FK_fc4eda9260de95137bcd5b0671c"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "permissions"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profilePictureUrl"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "jobTitle"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "department"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastLogin"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "spent"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "budget"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "clientName"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TABLE "activities"`);
        await queryRunner.query(`DROP TABLE "asset_revaluations"`);
        await queryRunner.query(`DROP TABLE "disposal_entries"`);
        await queryRunner.query(`DROP TABLE "depreciation_entries"`);
        await queryRunner.query(`DROP TABLE "fixed_assets"`);
        await queryRunner.query(`DROP TABLE "asset_categories"`);
        await queryRunner.query(`DROP TABLE "inventory_items"`);
        await queryRunner.query(`DROP TABLE "locations"`);
        await queryRunner.query(`DROP TABLE "suppliers"`);
    }

}
