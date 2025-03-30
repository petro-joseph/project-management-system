import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcrypt";

export class SeedInitialData1700000000003 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const hashedPassword = await bcrypt.hash("admin123", 10);

        // Create admin user
        await queryRunner.query(`
            INSERT INTO users (name, email, password, role)
            VALUES (
                'Admin',
                'admin@example.com',
                '${hashedPassword}',
                'admin'
            )
        `);

        // Create manager user
        const managerPassword = await bcrypt.hash("manager123", 10);
        await queryRunner.query(`
            INSERT INTO users (name, email, password, role)
            VALUES (
                'Manager',
                'manager@example.com',
                '${managerPassword}',
                'manager'
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM users 
            WHERE email IN ('admin@example.com', 'manager@example.com')
        `);
    }
}