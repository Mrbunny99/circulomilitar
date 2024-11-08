import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { SocioContext } from '../context/SocioContext';
import '../styles/BuscarSocio.css';

function BuscarSocio() {
    const [datoConsulta, setDatoConsulta] = useState('');
    const [campoActivo, setCampoActivo] = useState('');
    const [invitados, setInvitados] = useState(0);
    const { socio, setSocio, registro, setRegistro } = useContext(SocioContext);
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);
    const [esperandoDatos, setEsperandoDatos] = useState(true);

    const buscarDatos = async (e) => {
        e.preventDefault();
        setError(null);
        setSocio(null);
        setRegistro(false);
        setCargando(true); // Iniciar la carga cuando comienza la búsqueda

        if (!datoConsulta) {
            setError('Llene uno de los dos campos');
            setCargando(false); // Detener el cargando si no se llena el campo
            return;
        }

        // Determinar el campo a buscar basado en el campo activo
        const campo = campoActivo;

        try {
            const url = `${process.env.REACT_APP_BACKEND_URL}/api/socio/buscar`;
            const respuesta = await axios.post(url, {
                [campo]: datoConsulta // Usar el name del input como clave
            });
            setSocio(respuesta.data);
            setCampoActivo('');
            setDatoConsulta('');
            setCargando(false); // Detener el cargando cuando la respuesta esté lista
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError('No se encontraron resultados');
            } else {
                console.error('Error en la solicitud:', error);
            }
        }
    };

    const borrarCampos = () => {
        setDatoConsulta('');
        setCampoActivo('');
        setSocio(null);
        setError(null);
        setRegistro(false);
        setInvitados(0);
        setCargando(false);
        setEsperandoDatos(true);
    };

    const manejarCambio = (campo, datoConsulta) => {

        if (datoConsulta === '') {
            setCampoActivo('');
            setError(false);
            setCargando(false);
        } else {
            setCampoActivo(campo);
        }
        setDatoConsulta(datoConsulta);
    };

    const registrarVisita = async () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        try {
            const id = setTimeout(() => {
                setSocio(null);
                setRegistro(false);
                setInvitados(0);
            }, 20000);

            setTimeoutId(id);

            if (socio) {
                await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/socio/registro`, {
                    id_socio: socio.id_socio,
                    invitados: invitados
                });
                setRegistro(true);
            } else {
                alert('Consulte un socio antes de registrar');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);

    return (
        <div className='registro'>
            <div className='registro__titulo'>
                <h2>Registro de acceso</h2>
                <h3>Servicios Múltiples</h3>
            </div>
            <div className='busqueda'>
                <form className='busqueda__form' onSubmit={buscarDatos}>
                    <h3>Por favor coloque la tarjeta en el lector o ingrese la cédula</h3>

                    <label className='busqueda__label'>Tarjeta: </label>
                    <input
                        className='busqueda__input'
                        name='num_tarjeta'
                        value={campoActivo === 'num_tarjeta' ? datoConsulta : ''}
                        onChange={(e) => manejarCambio('num_tarjeta', e.target.value)}
                        disabled={campoActivo && campoActivo !== 'num_tarjeta'}
                    />

                    <label className='busqueda__label'>Cédula:</label>
                    <input
                        className='busqueda__input'
                        name='cedula'
                        value={campoActivo === 'cedula' ? datoConsulta : ''}
                        onChange={(e) => manejarCambio('cedula', e.target.value)}
                        disabled={campoActivo && campoActivo !== 'cedula'}
                        minLength={10}
                        maxLength={10}
                    />

                    <label className='busqueda__label'>Nombres:</label>
                    <input
                        type='text'
                        className='busqueda__input'
                        name='nombres'
                        value={campoActivo === 'nombres' ? datoConsulta : ''}
                        onChange={(e) => manejarCambio('nombres', e.target.value)}
                        disabled={campoActivo && campoActivo !== 'nombres'}
                    />

                    <label className='busqueda__label'>F.A.F (Solo para socios):</label>
                    <input
                        className='busqueda__input'
                        name='faf'
                        value={campoActivo === 'faf' ? datoConsulta : ''}
                        onChange={(e) => manejarCambio('faf', e.target.value)}
                        disabled={campoActivo && campoActivo !== 'faf'}
                        maxLength={6}
                    />

                    {error && <p className='busqueda-form__error'>{error}</p>}

                    {/* Mensaje de Cargando */}
                    {!error && cargando && <p className="cargando">Cargando...</p>}

                    <button className='busqueda__button busqueda__button--consultar' type='submit'>Consultar</button>
                    <button className='busqueda__button busqueda__button--borrar' type='button' onClick={borrarCampos}>Borrar</button>
                </form>
                <div className='info'>
                    {(!error && cargando) ? <p className="cargando">Cargando...</p> : (socio ?
                        <>
                            <h2 className='info__titulo'>DATOS</h2>
                            <ul className='info__lista'>
                                <div>
                                    <li className='info__item foto'><img src={socio.fotoBase64} /></li>
                                </div>
                                <div className='info__item datos'>
                                    <li className='info__item'>Nombres: {socio.nombres}</li>
                                    <li className='info__item'>Edad: {socio.edad}</li>
                                    {socio.id_socio && 
                                        <>
                                        <li className='info__item'>Grado: {socio.grado}</li>
                                        <li className='info__item'>Fuerza: {socio.fuerza}</li>
                                        </>
                                    }
                                </div>
                            </ul>

                            <div className='busqueda__registro'>
                                <button
                                    className='busqueda__button busqueda__button--registrar'
                                    type='submit'
                                    onClick={registrarVisita}
                                    disabled={registro}>
                                    Registrar
                                </button>
                                <div className='busqueda__registro-invitados'>
                                    <label>Nro. de invitados: </label>
                                    <input
                                        type='number'
                                        value={invitados}
                                        min='0'
                                        max='6'
                                        onChange={(e) => setInvitados(e.target.value)}
                                        disabled={registro}
                                    />
                                </div>
                            </div>
                            {!error && cargando && <p className="cargando">Cargando...</p>}
                            {registro &&
                                <>
                                    <p>Visita registrada</p>
                                    <p>Número de acompañantes: {invitados} </p>
                                </>
                            }
                        </> : (
                            // Mostrar mensaje de error o esperando datos si no hay socio
                            error ? (
                                <p>{error}</p>
                            ) : (
                                <h2 className='mensaje-container__titulo'>Esperando datos...</h2>
                            )
                        )




                    )}



                </div>
            </div>
        </div>
    );
}

export default BuscarSocio;
