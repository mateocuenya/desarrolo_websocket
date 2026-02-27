# Chat en Tiempo Real con WebSocket

Este proyecto es una Prueba de Concepto que implementa un sistema de chat en tiempo real utilizando WebSockets con autenticación básica (usuario y contraseña).

Permite múltiples usuarios conectados simultáneamente, validación de credenciales en el servidor, control de sesiones activas y notificaciones de entrada/salida.

# Objetivo

Demostrar el funcionamiento de comunicación bidireccional en tiempo real mediante WebSockets aplicando:

- Autenticación básica
- Control de usuarios conectados
- Validación en frontend y backend
- Arquitectura cliente-servidor

---

# Arquitectura

Cliente (HTML, CSS, JS)  
⬇  
WebSocket (protocolo JSON personalizado)  
⬇  
Servidor Node.js (ws)

El servidor:

- Valida credenciales
- Controla usuarios activos
- Evita usuarios duplicados
- Realiza broadcast de mensajes
- Notifica eventos del sistema

---

# Tecnologías utilizadas

- Node.js
- WebSocket (ws)
- HTML5
- CSS3
- JavaScript
- JSON


# Usuarios de prueba

juan --- > abcd
admin ---> 1234
testt ---> test

# Cómo ejecutar el proyecto

# Requisitos

- Tener instalado Node.js (v14 o superior)

Verificar instalación:

```bash
node -v
