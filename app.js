const pools = require('./dbCluster'); // Import the cluster pools from dbCluster.js



async function fetchDataFromCluster() {
    try {
        for (const [index, pool] of pools.entries()) {
            console.log(`Connecting to Node ${index + 1}...`);
            const connection = await pool.getConnection();
            console.log(`Connected to Node ${index + 1}!`);

            // Example query: Replace 'your_table' with your actual table name
            const [rows] = await connection.query('SELECT * FROM games LIMIT 10');
            console.log(`Data from Node ${index + 1}:`, rows);

            connection.release(); // Release the connection back to the pool
        }
    } catch (err) {
        console.error('Error connecting to the cluster:', err);
    }
}

// Execute the function
fetchDataFromCluster();
