# 💬 Chat en Tiempo Real con WebSocket

## 📌 Descripción

Este proyecto es una Prueba de Concepto que implementa un sistema de chat en tiempo real utilizando WebSockets con autenticación básica (usuario y contraseña).

Permite múltiples usuarios conectados simultáneamente, validación de credenciales en el servidor, control de sesiones activas y notificaciones de entrada/salida.

---

## 🎯 Objetivo

Demostrar el funcionamiento de comunicación bidireccional en tiempo real mediante WebSockets aplicando:

- Autenticación básica
- Control de usuarios conectados
- Validación en frontend y backend
- Arquitectura cliente-servidor

---

## 🏗 Arquitectura

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

## 🛠 Tecnologías utilizadas

- Node.js
- WebSocket (ws)
- HTML5
- CSS3
- JavaScript
- JSON

---

## 🔐 Usuarios de prueba

| Usuario | Contraseña |
|----------|------------|
| juan     | 1234       |
| maria    | abcd       |
| admin    | admin      |

---

## ▶️ Cómo ejecutar el proyecto

### 1️⃣ Requisitos

- Tener instalado Node.js (v14 o superior)

Verificar instalación:

```bash
node -v
