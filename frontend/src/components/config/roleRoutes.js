export const roleRoutes = {
    1: {
        displayName: 'Administrador',
        routes: [
            { path: 'admin/dashboard', label: 'Dashboard' },
        ],
    },
    2: {
        displayName: 'Talento Humano',
        routes: [
            { path: 'talento-humano/empleados', label: 'Empleados' },
            { path: 'talento-humano/permisos', label: 'Permisos' },
            { path: 'talento-humano/reportes', label: 'Reportes' },
        ],
    },
    3: {
        displayName: 'Servicios Múltiples',
        routes: [
            { path: 'servicios-multiples/registro', label: 'Gestión de Socios' },
            { path: 'servicios-multiples/informacion', label: 'Mensaje' },
            { path: 'servicios-multiples/reportes', label: 'Reportes' },
        ],
    },
    4: {
        displayName: 'Usuario',
        routes: [
            { path: 'general/permisos', label: 'Permiso'}
        ]
    }
};
