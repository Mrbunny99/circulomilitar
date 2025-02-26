import React, { useState } from "react";
import axios from 'axios';

const Usuario = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    clave: '',
    confirmarClave: '',
    rol_id: '',
    mail: '',
  });

  const [errors, setErrors] = useState({});

  // Maneja cambios genericamente
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "rol_id" ? Number(value) : value, 
    }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.usuario) newErrors.usuario = "El nombre de usuario es obligatorio";
    if (!formData.clave) newErrors.clave = "La contraseña es obligatoria";
    if (!formData.confirmarClave) newErrors.confirmarClave = "Debe confirmar la contraseña";
    if (!formData.rol_id) newErrors.rol_id = "Debe seleccionar un rol";
    if (!formData.mail) newErrors.mail = "El correo es obligatorio";
    else if (!/\S+@\S+\.\S+/.test(formData.mail))
      newErrors.mail = "Ingrese un correo válido";
    if (formData.clave !== formData.confirmarClave)
      newErrors.confirmarClave = "Las contraseñas no coinciden";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      console.log("formData", formData);
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/register`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Usuario creado:', response.data);
      alert("Usuario registrado con éxito");
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      alert("Error al registrar usuario");
    }
  };

  // Formulario para la creación de usuario
  return (
    <div className='border mx-auto my-auto p-10 bg-gray-100'>
      <div className='flex flex-col item-center justify-center mb-5'>
        <span className='font-bold text-sm'>Gestión de Usuario</span>
      </div>
      <form className='form' onSubmit={handleSubmit}>
        <div className='form__group'>
          <label className='form__label'>Usuario</label>
          <input
            className='p-2 border'
            type="text"
            name="usuario"
            placeholder='Ingrese el nombre del Usuario'
            value={formData.usuario}
            onChange={handleChange}
            required
          />
          {errors.usuario && <p className="text-red-500">{errors.usuario}</p>}
        </div>
        <div className='form__group'>
          <label className='form__label'>Clave</label>
          <input
            className='p-2 border'
            type="password"
            name="clave"
            placeholder="Ingrese la contraseña"
            value={formData.clave}
            onChange={handleChange}
            required
          />
          {errors.clave && <p className="text-red-500">{errors.clave}</p>}
        </div>
        <div className='form__group'>
          <label className='form__label'>Confirmar Clave</label>
          <input
            className='p-2 border'
            type="password"
            name="confirmarClave"
            placeholder="Confirme la contraseña"
            value={formData.confirmarClave}
            onChange={handleChange}
            required
          />
          {errors.confirmarClave && (<p className="text-red-500">{errors.confirmarClave}</p>)}
        </div>
        <div className="form__group">
          <label className="form__label">Rol</label>
          <select
            className="p-2 border"
            name="rol_id"
            value={formData.rol_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un rol</option> 
            <option value="1">Administrador</option>
            <option value="2">Talento Humano</option>
            <option value="3">Servicios Múltiples</option>
            <option value="4">General</option>
          </select>
          {errors.rol_id && <p className="text-red-500">{errors.rol_id}</p>}
        </div>
        <div className="form__group">
          <label className="form__label">Email</label>
          <input
            className="p-2 border"
            type="email"
            name="mail"
            placeholder="Ingrese el correo electrónico"
            value={formData.mail}
            onChange={handleChange}
            required
          />
          {errors.mail && <p className="text-red-500">{errors.mail}</p>}
        </div>
        <button type="submit" className="bg-blue-900 text-white py-2 rounded-md hover:bg-blue-600">Guardar Usuario</button>
      </form>
    </div>
  );
};

export default Usuario;