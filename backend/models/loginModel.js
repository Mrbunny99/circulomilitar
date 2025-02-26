const { poolPromise } = require('../config/db');
const bcrypt = require('bcryptjs');
const sql = require('mssql');

const loginModel = {
  // Función para obtener las credenciales
  getCredentials: async ({ user, password }) => {
    try {
      const pool = await poolPromise;
      const query = 'SELECT * FROM Users WHERE usuario = @user';
      const result = await pool
        .request()
        .input('user', sql.VarChar(50), user)
        .query(query);

      if (!result || result.recordset.length === 0) {
        console.log('No se encontró ningún usuario:', user);
        return null;
      }

      const dbUser = result.recordset[0];
      const matchPassword = await bcrypt.compare(password, dbUser.clave);

      if (!matchPassword) {
        console.log('Contraseña incorrecta'); // log
        return null;
      }

      return dbUser;

    } catch (error) {
      console.error('Error al obtener las credenciales:', error);
      throw error;
    }
  },

  // Función para registrar un nuevo usuario
  registerUser: async ({ usuario, clave, rol_id, mail }) => {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(clave, saltRounds);
      const pool = await poolPromise;
      const query = `INSERT INTO Users (usuario, clave, rol_id, email) VALUES (@usuario, @clave, @rol_id, @mail)`;

      console.log('Ejecutando consulta de insercion', query);

      await pool
        .request()
        .input('usuario', sql.VarChar(50), usuario) // Usar un tamaño adecuado para el tipo de dato
        .input('clave', sql.VarChar(255), hashedPassword) // Almacenar la contraseña con hash
        .input('rol_id', sql.Int, rol_id) // Almacenar el rol
        .input('mail', sql.VarChar(100), mail) // Almacenar el correo 
        .query(query);

      return true;
    } catch (error) {
      console.error('Error al registrar el usuario en modelo:', error);
      return false; // Retorna false en caso de error
    }
  },

  // Función para verificar si un usuario ya existe
  checkUserExists: async ({ usuario }) => {
    try {
      const pool = await poolPromise;
      const query = 'SELECT * FROM Users WHERE usuario = @usuario';
      const result = await pool
        .request()
        .input('usuario', sql.VarChar(50), usuario)
        .query(query);

      return result.recordset.length > 0; // Si existe, devuelve true

    } catch (error) {
      console.error('Error al verificar si el usuario existe:', error);
      return false;
    }
  }
};

module.exports = loginModel;