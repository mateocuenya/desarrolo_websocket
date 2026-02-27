let socket;
let usuario = localStorage.getItem("usuario");

// Detectar página actual
const path = window.location.pathname;
const esLogin = path === "/" || path.includes("login.html");
const esChat = path.includes("chat.html");

// Redirecciones
if (esChat && !usuario) {
  window.location.href = "/login.html";
}

if (esLogin && usuario) {
  window.location.href = "/chat.html";
}

// ---------------- LOGIN ----------------
if (esLogin) {

  window.addEventListener("DOMContentLoaded", () => {

  const botonLogin = document.getElementById("botonLogin");
  const usuarioInput = document.getElementById("usuarioInput");
  const contrasenaInput = document.getElementById("contrasenaInput");

  function login() {
    const user = usuarioInput.value.trim();
    const pass = contrasenaInput.value.trim();

    if (!user || !pass) {
      alert("Completar todos los campos");
      return;
    }

    if (user.length > 30) {
      alert("El usuario no puede tener más de 30 caracteres");
      return;
    }

    const socketLogin = new WebSocket("ws://localhost:3000");

    socketLogin.onopen = () => {
      socketLogin.send(JSON.stringify({
        type: "login",
        usuario: user,
        contrasena: pass
      }));
    };

    socketLogin.onmessage = (event) => {
      const respuesta = JSON.parse(event.data);

      if (respuesta.type === "login_exito") {
        localStorage.setItem("usuario", user);
        window.location.href = "/chat.html";
      }

      if (respuesta.type === "login_error") {
        mostrarPopUpLogin(respuesta.message);
      }

      socketLogin.close();
    };
  }

  botonLogin.addEventListener("click", login);

  contrasenaInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") login();
  });

  });
}

// CHAT 
if (esChat) {

  window.addEventListener("DOMContentLoaded", () => {
  socket = new WebSocket("ws://localhost:3000");

  const botonLogOut = document.getElementById("botonLogOut");
  const mensajeInput = document.getElementById("mensajeInput");
  const enviarBoton = document.getElementById("enviarBoton");
  const mensajes = document.getElementById("mensajes");

  // Logout
  botonLogOut.addEventListener("click", () => {
    const confirmacion = confirm("¿Seguro que querés salir?");
    if (confirmacion) {
      localStorage.removeItem("usuario");
      window.location.href = "/login.html";
    }
  });

  // Deshabilito botón si está vacío
  enviarBoton.disabled = true;

  mensajeInput.addEventListener("input", () => {
    enviarBoton.disabled = mensajeInput.value.trim() === "";
  });

  function enviarMensaje() {
    const msg = document.getElementById("mensajeInput").value.trim();
    console.log("Valor real del input:", msg);

   if (msg === "") return;

   if (msg.length > 200) {
     mostrarPopUp("El mensaje no puede superar los 200 caracteres.");
     return;
   }

   if (socket.readyState !== WebSocket.OPEN) {
     console.log("Socket no listo");
     return;
   }

   socket.send(JSON.stringify({
     type: "chat",
     user: usuario,
     text: msg
   }));

   mensajeInput.value = "";
   enviarBoton.disabled = true;
}





  enviarBoton.addEventListener("click", enviarMensaje);

  mensajeInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") enviarMensaje();
  });

  socket.onmessage = (event) => {
    console.log("MENSAJE RECIBIDO DEL SERVER:", event.data);
    const data = JSON.parse(event.data);

    if (data.type === "chat") {
      const li = document.createElement("li");

      // Contenedor del mensaje
      const mensajeBurbuja = document.createElement("div");
      mensajeBurbuja.classList.add("burbuja");

      // Texto
      const text = document.createElement("div");
      text.classList.add("mensaje-texto");
      text.textContent = data.text;

      // Hora
      const hora = document.createElement("div");
      hora.classList.add("mensaje-hora");

      const ahora = new Date();
      hora.textContent = ahora.getHours().toString().padStart(2, "0") + ":" +
                        ahora.getMinutes().toString().padStart(2, "0");

      // Si es mensaje de otro usuario, muestro nombre arriba
      if (data.user !== usuario) {
        const etiquetaUsuario = document.createElement("div");
        etiquetaUsuario.classList.add("mensaje-usuario");
        etiquetaUsuario.textContent = data.user;
        mensajeBurbuja.appendChild(etiquetaUsuario);
      }

      mensajeBurbuja.appendChild(text);
      mensajeBurbuja.appendChild(hora);
      li.appendChild(mensajeBurbuja);

      if (data.user === usuario) {
        li.classList.add("mensaje-propio");
      } else {
        li.classList.add("mensaje-otro");
      }

      mensajes.appendChild(li);
      mensajes.scrollTop = mensajes.scrollHeight;
    }
  };
  });
}

// ---------------- POPUPS ----------------

function mostrarPopUp(message) {
  document.getElementById("popup-mensaje").textContent = message;
  document.getElementById("popup").style.display = "flex";
}

function cerrarPopUp() {
  document.getElementById("popup").style.display = "none";
}

function mostrarPopUpLogin(message) {
  document.getElementById("popUpLoginMensaje").textContent = message;
  document.getElementById("loginPopup").style.display = "flex";
}

function cerrarPopUpLogin() {
  document.getElementById("loginPopup").style.display = "none";
}
