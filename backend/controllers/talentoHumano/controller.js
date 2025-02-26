const model = require('../../models/talentoHumano/model');

const controller = {

    //EMPLEADOS
    getEmpleados: async (req, res) => {
        const result = await model.getEmpleados();
        return res.json(result);
    },

    //USUARIOS
    createUsuarios: async (req, res) => {
        try {
            const {user, password, role, mail} = req.body;

            if (!user || !password || !role || !mail) {
                return res.status (400).json({error: "Todos los campos son obligatorios"});
            }

            const result = await model.createUsuarios(user, password, role, mail);

            return res.status(201).json({message: "Usuario creado correctamente", data: result});
        }catch (error) {
            console.error("Error en crear Usuario", error);
            return res.status(500).json({error: "Error interno del servidor"});
        }
    },

    // PERMISOS
    createPermiso: async(req, res) => {
        const data = req.body;
        const result = await model.createPermiso(data);
        return res.json(result);
    },

    obtenerPermisoPorId: async(req, res) => {
        try {
            const id = req.params.id;
            const result = await model.obtenerPermisoPorId(id);
            return res.json(result);

        } catch (error) {
            console.error("Error en el controlador: ", error);
        }      
    },

    obtenerUltimoPermiso: async(req, res) => {
        const result = await model.obtenerUltimoPermiso();
        return res.json(result);
    },

    obtenerPermisos: async(req, res) => {
        try {
            const result = await model.obtenerPermisos();
            return res.json(result);
        } catch (error) {
            console.error("Error en el controlador: ", error);
        }
    }, 

    getReport: async (req, res) => {
        const result = await model.getReport(req.body);
        return res.json(result);
    },

    updateUsuario: async (req, res) => {
        try {
            const {id} = req.params;
            const {user, password, role, mail} = req.body;

            if (!user || !password || !role || !mail) {
                return res.status (400).json({error: "Todos los campos son obligatorios"});
            }

            //Aqui llamamos la funcion del modelo
            const result = await model.updateUsuario(id, user, password, role, mail);

            if (result.affectedRows === 0) {
                return res.status(404).json({error: "Usuario no encontrado"});
            }

            return res.status(200).json({message: "Usuario actualizado correctamente"});
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            return res.status(500).json({error: "Error interno del servidor"});
        }
    },

    getUsuarios: async (req, res) => {
        try {
            const result = await model.getUsuarios();
            return res.json(result);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            return res.status(500).json({error: "Error interno del servicio"});
        }
    }
}

module.exports = controller;