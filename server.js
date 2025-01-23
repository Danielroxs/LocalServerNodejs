const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js'); // Importar el cliente de Supabase
const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();


// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configurar la conexión a Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'TU_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_KEY || 'TU_SUPABASE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Endpoint de prueba
app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente con Supabase');
});

// Endpoint para eliminar un mensaje por su ID
app.delete('/messages/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase.from('messages').delete().eq('id', id);
        if (error) {
            throw error;
        }
        res.json({ message: 'Mensaje eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar el mensaje:', err);
        res.status(500).json({ error: 'Error al eliminar el mensaje.' });
    }
});

// Endpoint para editar un mensaje por su ID
app.put('/messages/:id', async (req, res) => {
    const { id } = req.params;
    const { title, body } = req.body;

    if (!title || !body) {
        return res.status(400).json({ error: 'El título y el cuerpo son obligatorios.' });
    }

    try {
        const { data, error } = await supabase
            .from('messages')
            .update({ title, body })
            .eq('id', id);
        if (error) {
            throw error;
        }
        if (data.length === 0) {
            return res.status(404).json({ error: 'Mensaje no encontrado.' });
        }
        res.status(200).json(data[0]);
    } catch (err) {
        console.error('Error al actualizar el mensaje:', err);
        res.status(500).json({ error: 'Error al actualizar el mensaje.' });
    }
});

// Endpoint para crear un mensaje
app.post('/messages', async (req, res) => {
    const { title, body } = req.body;

    if (!title || !body) {
        return res.status(400).json({ error: 'El título y el cuerpo son obligatorios.' });
    }

    try {
        const { data, error } = await supabase
            .from('messages')
            .insert([{ title, body }]);
        if (error) {
            throw error;
        }
        res.status(201).json(data[0]);
    } catch (err) {
        console.error('Error al crear el mensaje:', err);
        res.status(500).json({ error: 'Error al crear el mensaje.' });
    }
});

// Endpoint para obtener todos los mensajes
app.get('/messages', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            throw error;
        }
        res.status(200).json(data);
    } catch (err) {
        console.error('Error al obtener los mensajes:', err);
        res.status(500).json({ error: 'Error al obtener los mensajes.' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
fdsfds