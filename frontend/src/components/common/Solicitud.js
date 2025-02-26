import axios from "axios";
import React, { useEffect, useState } from "react";
import PdfPermiso from "./PdfPermiso";

const Solicitud = () => {
    const [tipoPermiso, setTipoPermiso] = useState(null);
    const [tiempoPermiso, setTiempoPermiso] = useState(null);
    const [numeroPermiso, setNumeroPermiso] = useState(0);
    const [permiso, setPermiso] = useState(null);
    const [diaPermiso, setDiaPermiso] = useState(null);
    const [horaSalida, setHoraSalida] = useState(null);
    const [horaIngreso, setHoraIngreso] = useState(null);
    const [diaSalida, setDiaSalida] = useState(null);
    const [diaIngreso, setDiaIngreso] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [mostrarLista, setMostrarLista] = useState(false);
    const [empleados, setEmpleados] = useState([]);
    const [empleado, setEmpleado] = useState(null);
    const [totalHoras, setTotalHoras] = useState(null);
    const [totalDias, setTotalDias] = useState(null);

    useEffect(() => {
        const fetchEmpleados = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/talento-humano/empleados`
                );
                setEmpleados(response.data);
            } catch (error) {
                console.error("Error al obtener empleados:", error);
            }
        };
        fetchEmpleados();
    }, []);

    useEffect(() => {
        obtenerNumeroPermiso();
    }, []);



    useEffect(() => {
        if (horaSalida && horaIngreso) {
            const salida = new Date(`1970-01-01T${horaSalida}:00`);
            const ingreso = new Date(`1970-01-01T${horaIngreso}:00`);
            const diferenciaMs = ingreso - salida;

            const horas = (diferenciaMs / (1000 * 60 * 60)).toFixed(2);
            setTotalHoras(horas);
        }
    }, [horaSalida, horaIngreso]);

    useEffect(() => {
        if (diaSalida && diaIngreso) {
            const salida = new Date(diaSalida);
            const ingreso = new Date(diaIngreso);
            // Calcular la diferencia en milisegundos
            const diferenciaMs = ingreso - salida;

            // Convertir de milisegundos a días
            const dias = diferenciaMs / (1000 * 60 * 60 * 24);
            setTotalDias(dias);
        }
    }, [diaSalida, diaIngreso]);

    const obtenerNumeroPermiso = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/talento-humano/ultimo-permiso`,
                { responseType: 'text' }
            );
            setNumeroPermiso(response.data);
        } catch (error) {
            console.error("Error al obtener el numero de permiso:", error);
        }
    };

    const crearNuevoPermiso = () => {

        // Obtener el siguiente número de permiso
        obtenerNumeroPermiso();
        setPermiso(null); // Resetear el permiso    
        setTipoPermiso(null);
        setTiempoPermiso(null);
        setDiaPermiso(null);
        setHoraSalida(null);
        setHoraIngreso(null);
        setDiaSalida(null);
        setDiaIngreso(null);
        setBusqueda("");
        setMostrarLista(false);
        setEmpleado(null);
        setTotalHoras(null);
        setTotalDias(null);
        // Verificar que los estados se han actualizado
        console.log("Tipo de permiso:", tipoPermiso);
        console.log("Tiempo de permiso:", tiempoPermiso);
    }

    const validarFormulario = () => {
        if (!empleado || !tiempoPermiso || !tipoPermiso) return false;
        if (tiempoPermiso==="dias") {
            if (!diaSalida || !diaIngreso) return false;
        }
        if (tiempoPermiso==="horas") {
            if (!diaPermiso || !horaSalida || !horaIngreso) return false;
        } 

        return true;
    }

    const resetEstados = () => {
        setHoraSalida("");
        setHoraIngreso("");
        setTotalHoras(null);
    };

    const handleTiempoPermisoChange = (value) => {
        setTiempoPermiso(value);
        resetEstados();
    };

    const empleadosFiltrados = empleados.filter((empleado) =>
        empleado.nombre.toLowerCase().includes((busqueda ?? "").toLowerCase())
    );


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/talento-humano/permiso`, {
                id_empleado: empleado.id,
                id_tipo_permiso: tipoPermiso,
                dia_permiso: diaPermiso,
                hora_salida: horaSalida,
                hora_ingreso: horaIngreso,
                total_horas: totalHoras,
                fecha_salida: diaSalida,
                fecha_ingreso: diaIngreso,
                total_dias: totalDias
            })
            alert("Permiso registrado correctamente");
            const responsePermiso = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/talento-humano/permiso/${response.data.id}`);
            setPermiso(responsePermiso.data);
        }
        catch (error) {
            console.log("Error al registrar el permiso:", error);
            alert("Error al registrar el permiso");
        }

    };

    const handleSeleccionEmpleado = (empleado) => {
        setBusqueda(empleado.nombre);
        setEmpleado(empleado)
        setMostrarLista(false);
    };

    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
        setMostrarLista(true);
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="flex flex-col gap-2 bg-white p-8 shadow-lg rounded-xl max-w-xl w-full overflow-y-auto">
                <div className="flex justify-between">
                    <h1 className="text-3xl font-bold text-gray-700 text-center">Solicitud</h1>
                    {permiso &&
                        <button
                            type="button"
                            onClick={crearNuevoPermiso}
                            className="text-3xl">
                            📝
                        </button>}
                </div>
                <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                    {/* Campo de Búsqueda */}
                    <div className="w-full text-xl text-red-500 font-semibold">
                        {numeroPermiso}
                    </div>
                    <div className="relative">
                        <label className="block text-lg font-bold text-gray-600 mb-2">
                            Empleado
                        </label>
                        <input
                            type="text"
                            value={busqueda}
                            onChange={handleBusquedaChange}
                            onFocus={() => setMostrarLista(true)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Buscar empleado por nombre..."
                        />
                        {mostrarLista && busqueda && (
                            <ul className="absolute bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto mt-1 w-full z-10">
                                {empleadosFiltrados.length > 0 ? (
                                    empleadosFiltrados.map((empleado) => (
                                        <li
                                            key={empleado.idPersonal}
                                            onClick={() =>
                                                handleSeleccionEmpleado(empleado)
                                            }
                                            className="cursor-pointer hover:bg-blue-100 px-4 py-2 text-gray-700"
                                        >
                                            {empleado.nombre}
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-4 py-2 text-gray-500">
                                        No se encontraron empleados
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>

                    {/* Tipo de Permiso */}
                    <div className="">
                        <h2 className="text-lg font-bold text-gray-600 mb-2">Tipo</h2>
                        <div className="flex items-center gap-4">
                            <div>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        value={1}
                                        name="tipoPermiso"
                                        checked={tipoPermiso === "1"}
                                        onChange={(e) => setTipoPermiso(e.target.value)}
                                        className="accent-blue-500"
                                    />
                                    <span>Personal</span>
                                </label>
                            </div>
                            <div>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        value={2}
                                        name="tipoPermiso"
                                        checked={tipoPermiso === "2"}
                                        onChange={(e) => setTipoPermiso(e.target.value)}
                                        className="accent-blue-500"
                                    />
                                    <span>Médico</span>
                                </label>
                            </div>
                            <div>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        value={3}
                                        name="tipoPermiso"
                                        checked={tipoPermiso === "3"}
                                        onChange={(e) => setTipoPermiso(e.target.value)}
                                        className="accent-blue-500"
                                    />
                                    <span>Calamidad doméstica</span>
                                </label>
                            </div>
                        </div>

                        {tipoPermiso === 2 && (
                                    <p className="text-sm text-red-500 mt-2">
                                        * Es necesario un certificado médico.
                                    </p>
                                )}
                    </div>

                    {/* Duración del Permiso */}
                    <div className="">
                        <h2 className="text-lg font-bold text-gray-600 mb-2">Duración</h2>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="tiempoPermiso"
                                    checked={tiempoPermiso === "horas"}
                                    value="horas"
                                    onChange={(e) => handleTiempoPermisoChange(e.target.value)}
                                />
                                <span>Por horas</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="tiempoPermiso"
                                    checked={tiempoPermiso === "dias"}
                                    value="dias"
                                    onChange={(e) => handleTiempoPermisoChange(e.target.value)}
                                />
                                <span>Por días</span>
                            </label>
                        </div>

                        {/* Horas */}
                        {tiempoPermiso === "horas" && (
                            <div className="flex flex-col mt-4 gap-4">
                                <div className="flex gap-4">
                                    <label className="flex flex-col">
                                        Fecha
                                        <input
                                            value={diaPermiso}
                                            onChange={(e) => setDiaPermiso(e.target.value)}
                                            type="date"
                                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </label>
                                </div>
                                <div className="flex gap-4">
                                    <label className="flex flex-col">
                                        Hora de salida
                                        <input
                                            type="time"
                                            value={horaSalida}
                                            onChange={(e) => setHoraSalida(e.target.value)}
                                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-36"
                                        />
                                    </label>
                                    <label className="flex flex-col">
                                        Hora de ingreso
                                        <input
                                            type="time"
                                            value={horaIngreso}
                                            onChange={(e) => setHoraIngreso(e.target.value)}
                                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-36"
                                        />
                                    </label>
                                </div>
                                {totalHoras && (
                                    <p className="text-gray-600">
                                        Total de horas: <strong>{totalHoras}</strong>
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Días */}
                        {tiempoPermiso === "dias" && (
                            <div className="flex flex-col mt-4 gap-2">
                                <label className="flex flex-col">
                                    Fecha de salida
                                    <input
                                        type="date"
                                        value={diaSalida}
                                        onChange={(e) => setDiaSalida(e.target.value)}
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </label>
                                <label className="flex flex-col">
                                    Fecha de presentación
                                    <input
                                        value={diaIngreso}
                                        type="date"
                                        onChange={(e) => setDiaIngreso(e.target.value)}
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </label>
                                {totalDias && (
                                    <p className="text-gray-600">
                                        Total de días: <strong>{totalDias}</strong>
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Botón Guardar */}

                    <button
                        disabled={permiso || !validarFormulario()}
                        type="submit"
                        className={`w-full py-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${(permiso || !validarFormulario()) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-900 text-white hover:bg-blue-600'}`}
                    >
                        Guardar
                    </button>
                </form>
                {permiso && (
                    <PdfPermiso permiso={permiso} />
                )}

            </div>
        </div>
    );
}

export default Solicitud;
