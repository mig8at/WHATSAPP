import sqlite3 from 'sqlite3';
import { Message } from 'whatsapp-web.js';

sqlite3.verbose();
export const db = new sqlite3.Database('./bot.sqlite3');

export type Prompt = { id: number; name: string; auth: string; prompt: string; }
export type Authorized = { id: number; prompt_id: number; phone: string; }

db.run(`
      CREATE TABLE IF NOT EXISTS prompts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        auth TEXT NOT NULL UNIQUE,
        prompt TEXT NOT NULL
      )
    `, (err) => {
  if (err) console.error('Error al crear la tabla prompts', err);
});

db.run(`
      CREATE TABLE IF NOT EXISTS authorized (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        prompt_id INTEGER NOT NULL,
        phone TEXT NOT NULL UNIQUE,
        FOREIGN KEY (prompt_id) REFERENCES prompts(id)
      )
    `, (err) => {
  if (err) console.error('Error al crear la tabla authorized con clave foránea', err);
});

export const getPromptPhone = (phone: string) => {
  return new Promise<Prompt | null>((resolve, reject) => {
    db.all(`SELECT * FROM authorized WHERE phone = ?`, [phone], (err, rows: any) => {
      if (err) reject(`Error al obtener el número autorizado ${err}`);
      else {
        if (rows[0]) {
          const prompt_id = rows[0].prompt_id;
          db.all(`SELECT * FROM prompts WHERE id = ?`, [prompt_id], (err, rows: Prompt[]) => {
            if (err) reject(`Error al obtener el prompt ${err}`);
            else {
              if (rows[0]) resolve(rows[0]);
              else resolve(null);
            }
          });
        }
        else resolve(null);
      }
    });
  });
};

export const getPromptAuth = (auth: string) => {
  return new Promise<Prompt | null>((resolve, reject) => {
    db.all(`SELECT * FROM prompts WHERE auth = ?`, [auth], (err, rows: Prompt[]) => {
      if (err) reject(`Error al obtener el prompt ${err} ·`);
      else {
        if (rows[0]) resolve(rows[0]);
        else resolve(null);
      }
    });
  });
};

export const removeAuthorized = (phone: string) => {
  return new Promise<string>((resolve, reject) => {
    db.run(`DELETE FROM authorized WHERE phone = ?`, [phone], (err) => {
      if (err) reject(`Error al eliminar el número autorizado ${err} ·`);
      else resolve(`autorización eliminada para el ${phone} ·`);
    });
  });
}

export const addAuthorized = (phone: string, prompt_id: number) => {
  return new Promise<string>((resolve, reject) => {
    db.run(`INSERT INTO authorized (prompt_id, phone) VALUES (?, ?)`, [prompt_id, phone], (err) => {
      if (err) reject(`Error al autorizar el número ${err} `);
      else resolve(`autorización concedida para el ${phone} ·`);
    });
  });
}



