// src/migrations/1700000000002-CreateTasks.ts
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTasks1700000000002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "tasks",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "name",
                        type: "varchar",
                    },
                    {
                        name: "description",
                        type: "text",
                    },
                    {
                        name: "project_id",
                        type: "uuid",
                    },
                    {
                        name: "assignee_id",
                        type: "uuid",
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["pending", "in_progress", "completed"],
                        default: "'pending'",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true
        );

        await queryRunner.createForeignKeys("tasks", [
            new TableForeignKey({
                columnNames: ["project_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "projects",
                onDelete: "CASCADE",
            }),
            new TableForeignKey({
                columnNames: ["assignee_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "SET NULL",
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("tasks");
        const foreignKeys = table?.foreignKeys;
        if (foreignKeys) {
            for (const foreignKey of foreignKeys) {
                await queryRunner.dropForeignKey("tasks", foreignKey);
            }
        }
        await queryRunner.dropTable("tasks");
    }
}