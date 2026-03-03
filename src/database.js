import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function setupDb() {
    const db = await open({
        filename: './data/links.db',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS links (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            long_url TEXT NOT NULL,
            short_code TEXT UNIQUE NOT NULL,
            clicks INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_clicked DATETIME,
            expires_at DATETIME
        );
        CREATE INDEX IF NOT EXISTS idx_short_code ON links(short_code);
    `);

    return db;
}