const { Pool } = require("pg");

// Configurar la conexión a PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Usará la variable de entorno DATABASE_URL
    ssl: {
        rejectUnauthorized: false, // Necesario para Render
    },
});

const createTables = async () => {
    try {
        // Conexión con la base de datos
        const client = await pool.connect();

        // Crear tabla de usuarios
        await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);
        console.log("Tabla 'users' creada correctamente.");

        // Crear tabla de mensajes
        await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("Tabla 'messages' creada correctamente.");

        // Cerrar la conexión
        client.release();
    } catch (err) {
        console.error("Error al crear tablas:", err);
    } finally {
        // Cerrar el pool de conexiones
        pool.end();
    }
};

// Ejecutar la función para crear las tablas
createTables();
