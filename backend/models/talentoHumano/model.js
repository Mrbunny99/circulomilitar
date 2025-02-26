const { poolPromise: poolCirmil } = require('../../config/db');
const { poolPromise: poolLince } = require('../../config/dbLince');
const sql = require('mssql');
const dayjs = require('dayjs');
require('dayjs/locale/es');
dayjs.locale('es');

const model = {

    getEmpleados: async () => {

        const query = "SELECT * FROM Empleados ORDER BY Nombre"
        const pool = await poolCirmil;
        const result = await pool.request().query(query);

        return result.recordset;
    },

    // PERMISOS 

    createPermiso: async (data) => {

        const { id_empleado, id_tipo_permiso, dia_permiso, hora_salida, hora_ingreso, total_horas, fecha_salida, fecha_ingreso,
            total_dias } = data
        try {

            const query = `
                INSERT INTO Permisos 
                    (   
                        id_empleado, 
                        id_tipo_permiso, 
                        dia_permiso, 
                        hora_salida, 
                        hora_ingreso, 
                        total_horas, 
                        fecha_salida, 
                        fecha_ingreso,
                        total_dias,
                        fecha_creacion
                    )
                OUTPUT INSERTED.*
                VALUES (
                        @id_empleado, 
                        @id_tipo_permiso, 
                        @dia_permiso, 
                        @hora_salida, 
                        @hora_ingreso, 
                        @total_horas, 
                        @fecha_salida, 
                        @fecha_ingreso,
                        @total_dias,
                        GETDATE());
            `;

            const pool = await poolCirmil;
            const request = pool.request();


            // Solo pasamos el idEmpleado como parámetro
            request.input('id_empleado', sql.Int, id_empleado);
            request.input('id_tipo_permiso', sql.Int, id_tipo_permiso);
            request.input('dia_permiso', sql.DateTime, dia_permiso);
            request.input('hora_salida', sql.VarChar, hora_salida);
            request.input('hora_ingreso', sql.VarChar, hora_ingreso);
            request.input('total_horas', sql.Float, total_horas);
            request.input('fecha_salida', sql.VarChar, fecha_salida);
            request.input('fecha_ingreso', sql.VarChar, fecha_ingreso);
            request.input('total_dias', sql.Decimal(18, 0), total_dias);


            const result = await request.query(query);

            return result.recordset[0];

        } catch (error) {
            console.error("Error al registrar permiso:", error);
            throw error;
        }
    },

    obtenerPermisoPorId: async (id) => {
        try {
            const query = `
                SELECT 
                P.id,
                E.nombre AS empleado,
                TP.nombre AS tipo,
                P.dia_permiso,
                P.hora_salida,
                P.hora_ingreso,
                P.total_horas,
                P.fecha_salida,
                P.fecha_ingreso,
                P.total_dias,
                P.estado
                FROM Permisos AS P
                INNER JOIN Empleados AS E 
                ON P.id_empleado = E.id
                INNER JOIN TipoPermiso AS TP
                ON P.id_tipo_permiso = TP.id
                WHERE P.id = @idPermiso`
            const pool = await poolCirmil;
            const permiso = await pool.request()
                .input("idPermiso", sql.Int, id)
                .query(query);

            let result = permiso.recordset[0];

            result.dia_permiso = dayjs(result.dia_permiso).format('dddd, DD MMMM YYYY');

            return result;
        } catch (error) {
            console.error("Error en el modelo: ", error)
        }
    },

    obtenerUltimoPermiso: async () => {
        try {

            const query =
                `SELECT TOP 1 id
                FROM Permisos ORDER BY id DESC`

            const pool = await poolCirmil;
            const result = await pool.request().query(query);

            return result.recordset[0].id + 1;


        } catch (error) {
            console.error("Error en el modelo", error);
        }
    },

    obtenerPermisos: async () => {
        try {

            const query =
                `
                SELECT 
                P.id,
                E.nombre AS empleado,
                TP.nombre AS tipo,
                P.dia_permiso,
                P.hora_salida,
                P.hora_ingreso,
                P.total_horas,
                P.fecha_salida,
                P.fecha_ingreso,
                P.total_dias,
                P.fecha_creacion,
                P.estado
                FROM Permisos AS P
                INNER JOIN Empleados AS E 
                ON P.id_empleado = E.id
                INNER JOIN TipoPermiso AS TP
                ON P.id_tipo_permiso = TP.id
                `
            const pool = await poolCirmil;
            const result = await pool.request().query(query);

            return result.recordset.map(permiso => (
                {
                    ...permiso,
                    dia_permiso: permiso.dia_permiso ? dayjs(permiso.dia_permiso).format('DD/MM/YYYY') : null,
                    fecha_creacion: dayjs(permiso.fecha_creacion).format('DD/MM/YYYY HH:mm:ss')
                }
            ));


        } catch (error) {

            console.error("Error en el modelo: ", error);
        }
    },

    // REPORTES

    getReport: async (dates) => {

        const { startDate, endDate } = dates;

        const query = `SELECT R.mptarjeta AS cedula, P.nombres, P.apellidos, 
                            STUFF(STUFF(R.fechatxt, 5, 0, '-'), 8, 0, '-') AS fecha, STUFF(R.horatxt, 3, 0, ':') AS hora
                            FROM tblregistros AS R
                            INNER JOIN tblpersonal AS P
                            ON R.mptarjeta=P.tarjeta
                            WHERE fechatxt>=@startDate AND fechatxt<=@endDate
                            ORDER BY R.fechatxt, R.horatxt`;

        const pool = await poolLince;
        const result = await pool.request()
            .input('startDate', sql.VarChar, startDate)
            .input('endDate', sql.VarChar, endDate)
            .query(query);

        return result.recordset;
    },

    // CREAR USUARIO
    crearUsuario: async (Usuario, clave, rol, mail) => {
        const query = `INSERT INTO Users (usuario, clave, rol_id, email)
                        OUTPUT INSERTED.*
                        VALUES (@usuario, @clave, @rol, @mail)`;
        try {
            const pool = await poolCirmil;

            const request = pool.request();
            request.input('usuario', sql.VarChar, Usuario);
            request.input('clave', sql.VarChar, clave);
            request.input('rol_id', sql.Int, rol);
            request.input('email', sql.VarChar, mail);

            const result = await request.query(query);

            return result.recordset[0];
        } catch (error) {
            console.error("Error al crear usuario:", error);
            throw error;
        }
    },

    
    updateUsuario: async (id, user, password, role, mail) => {
        const query = 'UPDATE usuarios SET usuario = ?, clave = ?, rol_id = ?, mail = ? WHERE id = ?';
        const values = [user, password, role, mail, id];

        try{
            const [result] = await db.execute(query, values);
            return result;
        } catch (error) {
            console.error("Error en updateUsuario:", error);
            throw error;
        }
    },

    getUsuarios: async () => {
        const query = 'SELECT usuario, clave, rol_id, email FROM Users';

        try {
            const [rows] = await db.execute(query);
            return rows;
        } catch (error) {
            console.error("Error en getUsuarios:", error);
            throw error;
        }
    }
}


module.exports = model;