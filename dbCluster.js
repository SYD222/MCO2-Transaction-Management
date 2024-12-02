const mysql = require('mysql2/promise');
require('dotenv').config();

// Function to create a pool for each node
const createPool = (port) => {
    return mysql.createPool({
        host: process.env.DB_HOST,
        port: port, // Using specific port for each node
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });
};

// Creating pools for each node
const pool1 = createPool(process.env.DB_PORT1);
const pool2 = createPool(process.env.DB_PORT2);
const pool3 = createPool(process.env.DB_PORT3);

const pools = [pool1, pool2, pool3];

// Exporting pools to be used in queries
module.exports = pools;
