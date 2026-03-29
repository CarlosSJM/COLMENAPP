# Feature: Autenticacion

## Pantallas

### Login
- Campos: email, contrasena
- Enlace a Registro
- Enlace a Recuperar contrasena
- Autenticacion via JWT

### Registro
- Campos: nombre completo, email, contrasena, confirmar contrasena
- Validacion: contrasena minimo 6 caracteres
- Enlace a Login

### Recuperar Contrasena
- Campo: email
- Feedback de confirmacion de envio
- Enlace de vuelta a Login

## Flujo de Autenticacion

```
Login/Register -> JWT Token -> Header Authorization: Bearer <token>
```

- Token expira en 24h (configurable via `JWT_EXPIRES_IN`)
- Password hasheado con bcrypt
- Rutas protegidas requieren token valido

## API Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | /api/v1/auth/register | Crear cuenta |
| POST | /api/v1/auth/login | Iniciar sesion |
| POST | /api/v1/auth/forgot-password | Solicitar recuperacion |
| GET | /api/v1/auth/me | Obtener usuario actual |

## Estilo Visual
- Paleta amber/miel
- Logo hexagonal COLMENAPP centrado
- Card centrada en pantalla con gradiente de fondo
