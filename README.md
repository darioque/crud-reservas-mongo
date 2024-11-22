# Sistema de Reservas para Restaurante

Este proyecto es un sistema de reservas para un restaurante, donde los usuarios pueden crear cuentas, hacer reservas, y los administradores pueden gestionar mesas y reservas.

## Tabla de Contenidos

- [Instalación](#instalación)
- [Uso](#uso)
- [Tecnologías](#tecnologías)
- [API](#api)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

## Instalación

### Requisitos previos

Asegúrate de tener instalado lo siguiente en tu sistema:

- [Node.js](https://nodejs.org/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Un administrador de paquetes como npm o yarn

### Dependencias del proyecto
El proyecto utiliza las siguientes bibliotecas y herramientas principales:

- Express: Framework para construir APIs y aplicaciones web.
- Mongoose: ODM para interactuar con MongoDB.
- dotenv: Para gestionar variables de entorno.
- bcrypt: Para el hash de contraseñas.
- jsonwebtoken: Para manejar autenticación con JWT.

### Pasos para instalar

1. Clona el repositorio:

```bash
git clone https://github.com/usuario/proyecto.git
```
2. Ingresa a la carpeta del proyecto:

```bash
cd proyecto
```
3. Instala las dependencias:

```bash
npm install
```
4. Crea un archivo .env con las siguientes variables:

```bash
PORT=3000
DB_NAME=reservasdb
JWT_SECRET=secreto_para_token
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/reservasdb
```
5. Inicia el servidor:

```bash
npm start
```

## Uso
Puedes probar el sistema haciendo peticiones a la API con herramientas como Postman o Thunder Client.

### Tecnologías
- Node.js - Entorno de ejecución de JavaScript.
- Express - Framework de Node.js.
- MongoDB - Base de datos NoSQL.
- Mongoose - ODM para MongoDB.
- JWT - JSON Web Tokens para autenticación.

## API

### Rutas de Usuario

- `POST /api/users`: Crear un nuevo usuario.  
  **Body**: `{ "name": "Nombre", "email": "email@dominio.com", "password": "contraseña", "role": "client/admin" }`  
  **Respuesta exitosa**: `201 Created` con los datos del usuario.

- `POST /api/users/login`: Iniciar sesión.  
  **Body**: `{ "email": "email@dominio.com", "password": "contraseña" }`  
  **Respuesta exitosa**: `200 OK` con el token de acceso.

- `GET /api/users/profile`: Obtener perfil del usuario (requiere autenticación JWT).  
  **Respuesta exitosa**: `200 OK` con los datos del perfil del usuario.

- `POST /api/users/logout`: Cerrar sesión (requiere autenticación).  
  **Respuesta exitosa**: `200 OK` con un mensaje de logout.

### Rutas de Mesa

- `POST /api/tables`: Crear una nueva mesa (requiere autenticación de admin).  
  **Body**: `{ "table_number": 1, "capacity": 4 }`  
  **Respuesta exitosa**: `201 Created` con los detalles de la mesa creada.

- `GET /api/tables`: Obtener todas las mesas.  
  **Respuesta exitosa**: `200 OK` con una lista de mesas.

- `GET /api/tables/:id`: Obtener una mesa específica por ID.  
  **Respuesta exitosa**: `200 OK` con los detalles de la mesa.

- `PUT /api/tables/:id`: Actualizar los detalles de una mesa (requiere autenticación de admin).  
  **Body**: `{ "table_number": 1, "capacity": 6, "available": true }`  
  **Respuesta exitosa**: `200 OK` con los detalles actualizados.

- `DELETE /api/tables/:id`: Eliminar una mesa (requiere autenticación de admin).  
  **Respuesta exitosa**: `200 OK` con un mensaje de éxito.

### Rutas de Reserva

- `POST /api/reservations`: Crear una nueva reserva.  
  **Body**: `{ "date": "YYYY-MM-DD", "time": "HH:MM", "party_size": 4, "table_id": "ID_de_mesa" }`  
  **Respuesta exitosa**: `201 Created` con los detalles de la reserva.

- `GET /api/reservations`: Obtener todas las reservas.  
  **Respuesta exitosa**: `200 OK` con una lista de reservas.

- `GET /api/reservations/:id`: Obtener una reserva específica por ID.  
  **Respuesta exitosa**: `200 OK` con los detalles de la reserva.

- `DELETE /api/reservations/:id`: Eliminar una reserva.  
  **Respuesta exitosa**: `200 OK` con un mensaje de éxito.

## Contribuir

1. Haz un fork de este repositorio.
2. Crea una nueva rama para tus cambios:
```bash
git checkout -b nueva-funcionalidad
```
3. Realiza un commit con tus cambios:
```bash
git commit -m "Descripción de los cambios"
```
4. Sube la rama
```bash
git push origin nueva-funcionalidad
```
5. Abre un pull request

## Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](./LICENSE) para más detalles.