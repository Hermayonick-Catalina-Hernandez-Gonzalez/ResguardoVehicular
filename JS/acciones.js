document.addEventListener("DOMContentLoaded", function () {
    let links = document.querySelectorAll(".menu-link");
    let currentPath = window.location.pathname.split('/').pop(); 

    links.forEach(link => {
        if (link.getAttribute("href").includes(currentPath)) {
            link.classList.add("active");
        }
    });
});

function cerrar() {
    finalizarFormulario();
    window.location.href = "../../php/logout.php";
}

function salir() {
    window.location.href = "../php/logout.php";
}

function verVehiculo(numeroEconomico) {
    localStorage.setItem("numeroEconomico", numeroEconomico);
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

document.addEventListener("DOMContentLoaded", function () {
    let links = document.querySelectorAll(".menu-link");
    let currentPath = window.location.pathname.split('/').pop(); 

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

function normalizarTexto(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function togglePassword() {
    const passwordField = document.getElementById('contra');
    const toggleIcon = document.getElementById('toggle-password');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.src = 'img/cerrar-ojo.png'; 
        toggleIcon.alt = 'Ocultar contraseña';
    } else {
        passwordField.type = 'password';
        toggleIcon.src = 'img/ojo.png'; 
        toggleIcon.alt = 'Mostrar contraseña';
    }
}

function final() {
    Swal.fire({
        icon: 'success',
        title: '¡Se ha Guardado Exitosamente!',
        timer: 1500,
        showConfirmButton: false,
        backdrop: false
    }).then(() => {
        window.location.href = '../../vistas/formulario/pdfs.php';  
    });
}

function finalizarFormulario() {
    localStorage.clear();
}

