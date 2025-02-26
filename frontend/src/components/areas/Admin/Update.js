import React, {useEffect, useState} from "react";
import axios from "axios";

const Update = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    const obtenerUsuarios = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/usuarios`);
            setUsuarios(response.data);
        } catch (error) {
            console.error("Error al obtener usuarios", error);
            setError("No se pudieron cargar los usuarios.");
        }
    };

    return (
        <div className="max-w-5xl mx-auto my-10 p-5 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-5">Lista de Usuarios</h2>

            {error && <p className="text-red-500">{error}</p>}

            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Usuario</th>
                        <th className="border p-2">Correo</th>
                        <th className="border p-2">Rol</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.length > 0 ? (
                        usuarios.map((usuario) => (
                            <tr key={usuario.id} className="hover:bg-gray-100">
                                <td className="border p-2">{usuario.id}</td>
                                <td className="border p-2">{usuario.usuario}</td>
                                <td className="border p-2">{usuario.mail}</td>
                                <td className="border p-2">{usuario.rol_id}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center p-4">No hay usuarios registrados.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Update;