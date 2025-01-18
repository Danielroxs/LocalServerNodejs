const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./messages.db');

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
        if (err) {
            console.error('Error al crear la tabla:', err);
        } else {
            console.log('Tabla "messages" creada correctamente');
        }
    });
});

db.close();
