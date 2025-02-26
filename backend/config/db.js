const sql = require('mssql');

const config = {
    user: 'Administrador',
    password: 'Sistemas2023',
    server: '186.3.35.74',
    database: 'cirmil',
    options: {
        encrypt: false, // true para conexiones en Azure
        trustServerCertificate: true 
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Conectado a SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Error de conexión a SQL Server:', err);
        process.exit(1);
    });

module.exports = {
    sql,
    poolPromise
};
