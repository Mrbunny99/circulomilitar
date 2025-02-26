const loginModel = require('../models/loginModel');
require('dotenv').config(); // Esto carga las variables de entorno del archivo .env
const jwt = require('jsonwebtoken');
const loginController = {
    // Función para obtener las credenciales y hacer el login
    getCredentials: async (req, res) => {
        try {
            const { user, password } = req.body;
            const result = await loginModel.getCredentials({ user, password });

            if (!result) {
                return res.status(401).json({ message: 'Usuario o clave incorrectos' });
            }

            // Generar el token
            const token = jwt.sign(
                {   id: result.id, 
                    user: result.usuario, 
                    role: result.rol_id 
                }, // Información que quieres almacenar en el token
                process.env.JWT_SECRET,                 // Llave secreta para firmar el token
                { expiresIn: '1h' }                     // Tiempo de expiración del token
            );

            return res.json({ token, message: 'Autenticación exitosa' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    },

    // Función para registrar un nuevo usuario
    registerUser: async (req, res) => {
        try {
            const { usuario, clave, rol_id, mail } = req.body;
            console.log('Datos recibidos', req.body);

            // Verificar que ambos campos existan
            if (!usuario || !clave || !mail) {
                console.log('Faltan datos en la solicitud');
                return res.status(400).json({ message: 'El nombre de usuario, la contraseña y el correo son obligatorios' });
            }

            const userExists = await loginModel.checkUserExists({ usuario })

            if (userExists) {
                console.log('El usuario ya existe');
                return res.status(400).json({ message: 'El usuario ya existe' });
            }

            const result = await loginModel.registerUser({ usuario, clave, rol_id, mail });

            if (result) {
                console.log('Usuario creado');
                return res.status(201).json({ message: 'Usuario registrado exitosamente' });
            } else {
                console.log('Error al crear el usuario');
                return res.status(400).json({ message: 'Error al registrar el usuario' });
            }

        } catch (error) {
            console.error('Error en el servidor', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }
};

module.exports = loginController;
