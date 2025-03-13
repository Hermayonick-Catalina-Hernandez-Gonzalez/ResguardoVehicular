document.addEventListener("DOMContentLoaded", function () {
    let links = document.querySelectorAll(".menu-link");
    let currentPath = window.location.pathname.split('/').pop(); // Obtiene el nombre del archivo actual

    links.forEach(link => {
        if (link.getAttribute("href").includes(currentPath)) {
            link.classList.add("active");
        }
    });
});

function salir() {
    window.location.href = "../php/logout.php";  
}

function cerrar() {
    window.location.href = "../../php/logout.php";  
}
function ver(numeroEconomico) {
    localStorage.setItem('numeroEconomico', numeroEconomico);
    window.location.href = "../vistas/historial.php";
}

function regresar() {
    window.location.href = "../vistas/inicio.php";
}

function iniciar() {
    window.location.href = "../vistas/inicio.php";
}

function editar() {
    window.location.href = "../vistas/formulario/resguardante.php";
}

function validarFormulario() {
    let camposValidos = true;

    // Verificar campos de texto
    const inputsTexto = document.querySelectorAll("input[type='text'], input[type='number']");
    inputsTexto.forEach(input => {
        if (input.value.trim() === "") {
            camposValidos = false;
            input.style.borderColor = "red"; // Cambiar color del borde en caso de error
        } else {
            input.style.borderColor = ""; // Restablecer el borde si el campo es válido
        }
    });

    // Verificar si algún campo de radio está seleccionado
    const radios = document.querySelectorAll("input[type='radio']");
    let radioSeleccionado = false;
    radios.forEach(radio => {
        if (radio.checked) {
            radioSeleccionado = true;
        }
    });
    if (!radioSeleccionado) {
        camposValidos = false;
        Swal.fire({
            title: "Oops...",
            text: "Debe seleccionar una opción en el tipo de condición.",
            icon: "error",
            backdrop: false
        });
    }

    // Verificar si se ha seleccionado una opción en el select
    const select = document.getElementById("tipo_ocupacion");
    if (select.value === "") {
        camposValidos = false;
        Swal.fire({
            title: "Oops...",
            text: "Debe seleccionar una opción en el tipo de ocupación.",
            icon: "error",
            backdrop: false
        });
    }

    return camposValidos;
}



document.addEventListener("DOMContentLoaded", function () {
    let links = document.querySelectorAll(".menu-link");
    let currentPath = window.location.pathname.split('/').pop(); // Obtiene el nombre del archivo actual

    links.forEach(link => {
        if (link.getAttribute("href").includes(currentPath)) {
            link.classList.add("active");
        }
    });
});

function verVehiculo(numeroEconomico) {
    localStorage.setItem("numeroEconomico", numeroEconomico);
    window.location.href = `../vistas/historial.php`;
}

function buscar() {
    const searchText = normalizarTexto(document.getElementById('search').value.toLowerCase());
    const rows = document.querySelectorAll('#vehiculos tr');
    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        let match = false;
        for (let i = 0; i < cells.length; i++) {
            if (normalizarTexto(cells[i].textContent.toLowerCase()).includes(searchText)) {
                match = true;
                break;
            }
        }
        row.style.display = match ? '' : 'none';
    });
}

// Función para normalizar texto (eliminar acentos y convertir a minúsculas)
function normalizarTexto(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function togglePassword() {
    const passwordField = document.getElementById('contra');
    const toggleIcon = document.getElementById('toggle-password');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.src = 'img/cerrar-ojo.png'; // Cambia a la imagen de ojo cerrado
        toggleIcon.alt = 'Ocultar contraseña';
    } else {
        passwordField.type = 'password';
        toggleIcon.src = 'img/ojo.png'; // Cambia a la imagen de ojo abierto
        toggleIcon.alt = 'Mostrar contraseña';
    }
}

function buscarHistorial() {
    const searchText = normalizarTexto(document.getElementById('search').value.toLowerCase());
    const historyCards = document.querySelectorAll('#history-section .history-card');

    historyCards.forEach(card => {
        const fecha = normalizarTexto(card.querySelector('p:nth-child(1)').textContent.toLowerCase());
        const municipio = normalizarTexto(card.querySelector('p:nth-child(2)').textContent.toLowerCase());
        const resguardante = normalizarTexto(card.querySelector('p:nth-child(3)').textContent.toLowerCase());
        const resguardanteInterno = normalizarTexto(card.querySelector('p:nth-child(4)').textContent.toLowerCase());
        const observaciones= normalizarTexto(card.querySelector('p:nth-child(5)').textContent.toLowerCase());

        // Verifica si alguno de los campos normalizados coincide con el texto de búsqueda
        if (
            fecha.includes(searchText) ||
            municipio.includes(searchText) ||
            resguardante.includes(searchText) ||
            resguardanteInterno.includes(searchText) ||
            observaciones.includes(searchText)
        ) {
            card.style.display = '';  // Mostrar el div
        } else {
            card.style.display = 'none';  // Ocultar el div
        }
    });
}

function final() {
    // Mostrar el mensaje de éxito antes de redirigir
    Swal.fire({
        icon: 'success',
        title: '¡Se ha Guardado Exitosamente!',
        timer: 1500,
        showConfirmButton: false,
        backdrop: false
    }).then(() => {
        // Redirige a la página de PDFs después de generar el PDF
        window.location.href = '../../vistas/formulario/pdfs.php';  // Ajusta esta ruta según sea necesario
    });
}


function validarFormulario() {
    let camposValidos = true;

    // Verificar campos de texto
    const inputsTexto = document.querySelectorAll("input[type='text'], input[type='number']");
    inputsTexto.forEach(input => {
        if (input.value.trim() === "") {
            camposValidos = false;
            input.style.borderColor = "red"; // Cambiar color del borde en caso de error
        } else {
            input.style.borderColor = ""; // Restablecer el borde si el campo es válido
        }
    });

    // Verificar si algún campo de radio está seleccionado
    const radios = document.querySelectorAll("input[type='radio']");
    let radioSeleccionado = false;
    radios.forEach(radio => {
        if (radio.checked) {
            radioSeleccionado = true;
        }
    });
    if (!radioSeleccionado) {
        camposValidos = false;
        Swal.fire({
            title: "Oops...",
            text: "Debe seleccionar una opción en el tipo de condición.",
            icon: "error",
            backdrop: false
        });
    }

    // Verificar si se ha seleccionado una opción en el select
    const select = document.getElementById("tipo_ocupacion");
    if (select.value === "") {
        camposValidos = false;
        Swal.fire({
            title: "Oops...",
            text: "Debe seleccionar una opción en el tipo de ocupación.",
            icon: "error",
            backdrop: false
        });
    }

    return camposValidos;
}

function siguiente() {
    if (validarFormulario()) {
        window.location.href = "../../vistas/formulario/verificacion.php"; 
    } else {
        Swal.fire({
            title: "Faltan campos por llenar",
            text: "Por favor, complete todos los campos requeridos.",
            icon: "warning",
            backdrop: false
        });
    }
}

// Limpiar localStorage solo cuando el usuario presiona "Aceptar"
function finalizarFormulario() {
    localStorage.clear();
}