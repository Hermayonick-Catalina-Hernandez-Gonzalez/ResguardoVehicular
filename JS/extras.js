document.getElementById('Pdf').addEventListener('submit', function(event) {
    event.preventDefault(); // Previene que la página se recargue
});

document.addEventListener("DOMContentLoaded", function () {
    // Ocultar todas las pestañas al inicio
    document.querySelectorAll(".tabcontent").forEach(tab => {
        tab.style.display = "none";
    });

    // Seleccionar y mostrar la pestaña "Reglas" por defecto
    const defaultTab = document.getElementById("Reglas");
    const defaultButton = document.getElementById("reglas");

    if (defaultTab && defaultButton) {
        defaultTab.style.display = "block";
        defaultButton.classList.add("active");
    } else {
        console.error("No se encontró la pestaña 'Reglas' o su botón.");
    }

    const iframe1 = document.getElementById("preview1");
    if (iframe1) {
        iframe1.style.display = "block"; 
    } else {
        console.error("No se encontró el iframe 'preview1'.");
    }
});

// Función para cambiar de pestañas manualmente
function openTab(evt, tabName) {
    document.querySelectorAll(".tabcontent").forEach(tab => tab.style.display = "none");
    document.querySelectorAll(".tablink").forEach(btn => btn.classList.remove("active"));

    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.style.display = "block";
    }

    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add("active");
    }
}

// Funciones para la firma
function abrirFirma() {
    document.getElementById("modalFirma").style.display = "flex";
}

function cerrarFirma() {
    document.getElementById("modalFirma").style.display = "none";
}

// Funciones para capturar la firma en canvas
let esTactil = "ontouchstart" in window || navigator.maxTouchPoints > 0;

let canvas = document.getElementById("canvasFirma");
let ctx = canvas.getContext("2d");
let pintando = false;

// Eventos para mouse
canvas.addEventListener("mousedown", iniciarDibujo);
canvas.addEventListener("mouseup", detenerDibujo);
canvas.addEventListener("mousemove", dibujar);

// Eventos para dispositivos táctiles
canvas.addEventListener("touchstart", iniciarDibujo);
canvas.addEventListener("touchend", detenerDibujo);
canvas.addEventListener("touchmove", dibujar);

function obtenerCoordenadas(event) {
    let rect = canvas.getBoundingClientRect();
    if (event.touches) {
        return {
            x: event.touches[0].clientX - rect.left,
            y: event.touches[0].clientY - rect.top
        };
    } else {
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }
}

function iniciarDibujo(event) {
    event.preventDefault();
    pintando = true;
    let coord = obtenerCoordenadas(event);
    ctx.beginPath();
    ctx.moveTo(coord.x, coord.y);
}

function detenerDibujo(event) {
    event.preventDefault();
    pintando = false;
    ctx.beginPath();
}

function dibujar(event) {
    if (!pintando) return;
    event.preventDefault();
    let coord = obtenerCoordenadas(event);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineTo(coord.x, coord.y);
    ctx.stroke();
}

function limpiarFirma() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function guardarFirma() {
    let canvas = document.getElementById("canvasFirma");
    let imagenFirma = canvas.toDataURL("image/png"); // Convertir firma a base64

    localStorage.setItem("firmaBase64", imagenFirma); // Guardar en localStorage

    Swal.fire({
        icon: "success",
        title: "Firma Guardada",
        text: "La firma ha sido registrada correctamente.",
        backdrop: false
    });

    cerrarFirma();
    verPDF(); // Regenerar PDF con la firma
}


document.addEventListener("DOMContentLoaded", function() {
    let vehiculoId = localStorage.getItem("vehiculo_id");

    if (vehiculoId) {
        // Agregar el ID a la URL si no está presente
        let url = new URL(window.location.href);
        if (!url.searchParams.has("vehiculo_id")) {
            url.searchParams.set("vehiculo_id", vehiculoId);
            window.location.href = url.toString();
        }
    } else {
        alert("No se encontró el ID del vehículo en localStorage.");
    }
});
