const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('./messages.db', (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos SQLite');
    }
});

// Endpoint de prueba
app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

// Endpoint para eliminar un mensaje por su ID
app.delete('/messages/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM messages WHERE id = ?', function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Error al eliminar el mensaje' });
            return;
        }
        res.json({ message: 'Mensaje eliminado correctamente' })
    })
})

// Endpoint para editar un mensaje por su ID
app.put('/messages/:id', (req, res) => {
    const { id } = req.params;
    const { title, body } = req.body

    if (!title || !body) {
        return res.status(400).json({ error: 'El titulo y el cuerpo son obligatorios.' });
    }

    const query = `UPDATE messages SET title = ?, body = ? WHERE id = ?`;

    db.run(query, [title, body, id], function (err) {
        if (err) {
            console.error('Error al actualizar el mensaje:', err);
            return res.status(500).json({ error: 'Error al actualizar el mensaje.' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Mensaje no encontrado' });
        }

        res.status(200).json({ id, title, body })
    })
})

// Endpoint para crear un mensaje (POST/messages)
app.post('/messages', (req, res) => {
    const { title, body } = req.body;

    if (!title || !body) {
        return res.status(400).json({ error: 'El título y el cuerpo son obligatorios.' });
    }

    const query = `INSERT INTO messages (title, body) VALUES (?, ?)`;

    db.run(query, [title, body], function (err) {
        if (err) {
            console.error('Error al crear el mensaje:', err);
            return res.status(500).json({ error: 'Error al crear el mensaje.' });
        }

        res.status(201).json({ id: this.lastID, title, body });
    });
});

// Endpoint para obtener todos los mensajes (GET/messages)
app.get('/messages', (req, res) => {
    const query = `SELECT * FROM messages ORDER BY created_at DESC`;

    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error al obtener los mensajes:', err);
            return res.status(500).json({ error: 'Error al obtener los mensajes.' });
        }

        res.status(200).json(rows);
    });
});

// Endpoint para actualizar un mensaje (PUT/messages/:id)
app.put('/messages/:id', (req, res) => {
    const { id } = req.params;
    const { title, body } = req.body;

    if (!title || !body) {
        return res.status(400).json({ error: 'El título y el cuerpo son obligatorios.' });
    }

    const query = `UPDATE messages SET title = ?, body = ? WHERE id = ?`;

    db.run(query, [title, body, id], function (err) {
        if (err) {
            console.error('Error al actualizar el mensaje:', err);
            return res.status(500).json({ error: 'Error al actualizar el mensaje.' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Mensaje no encontrado.' });
        }

        res.status(200).json({ id, title, body });
    });
});

// Endpoint para eliminar un mensaje (DELETE/messages/:id)
app.delete('/messages/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM messages WHERE id = ?`;

    db.run(query, id, function (err) {
        if (err) {
            console.error('Error al eliminar el mensaje:', err);
            return res.status(500).json({ error: 'Error al eliminar el mensaje.' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Mensaje no encontrado.' });
        }

        res.status(200).json({ message: 'Mensaje eliminado correctamente.' });
    });
});


// Escuchar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
