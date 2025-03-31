document.addEventListener("DOMContentLoaded", function () {
    let numeroEconomico = localStorage.getItem("numeroEconomico");

    if (!numeroEconomico) {
        Swal.fire({
            icon: "error",
            title: "Vehículo no encontrado",
            text: "No se encontró información del vehículo.",
            confirmButtonText: "Aceptar",
            backdrop: false
        }).then(() => {
            window.location.href = 'index.php';
        });
    } else {
        obtenerDatosVehiculo(numeroEconomico);
    }
});

function obtenerDatosVehiculo(numeroEconomico) {
    $.ajax({
        url: '../php/obtenerVehiculo.php',
        type: 'GET',
        data: { numeroEconomico: numeroEconomico },
        dataType: 'json', 
        success: function(response) {
            const vehiculo = response;
            if (vehiculo && !vehiculo.error) {
                document.getElementById("numeroEconomico").textContent = vehiculo.numero_economico;
                document.getElementById("placa").textContent = vehiculo.placa;
                document.getElementById("serie").textContent = vehiculo.serie;
                document.getElementById("color").textContent = vehiculo.color;
                document.getElementById("clase").textContent = vehiculo.clase;
                document.getElementById("marca").textContent = vehiculo.marca;
                document.getElementById("submarca").textContent = vehiculo.submarca;
                document.getElementById("modelo").textContent = vehiculo.modelo;
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "Datos no encontrados",
                    text: "No se encontró información del vehículo en la base de datos.",
                    confirmButtonText: "Aceptar",
                    backdrop: false
                });
            }
        },
        error: function() {
            Swal.fire({
                icon: "error",
                title: "Error de conexión",
                text: "Error al cargar los datos del vehículo. Inténtalo de nuevo.",
                confirmButtonText: "Aceptar",
                backdrop: false
            });
        }
    });
}


function redirigirHistorial(numeroEconomico) {
    document.getElementById("numeroEconomicoInput").value = numeroEconomico;
    document.getElementById("formHistorial").submit();
}

$(document).ready(function () {
    let numeroEconomico = localStorage.getItem("numeroEconomico");

    if (numeroEconomico) {
        $.ajax({
            url: "../php/getHistorial.php",
            type: "POST",
            data: { numeroEconomico: numeroEconomico },
            success: function (response) {
                $("#history-section").html(response);
            },
            error: function () {
                $("#history-section").html("<p>Error al cargar el historial.</p>");
            }
        });
    } 
});

document.addEventListener("DOMContentLoaded", function () {
    let numeroEconomico = localStorage.getItem("numeroEconomico");
    let imgVehiculo = document.querySelector(".profile-picture");

    fetch("../php/getImagen.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "numeroEconomico=" + encodeURIComponent(numeroEconomico),
    })
    .then(response => response.json())
    .then(data => {
        if (data.imagenFrontal) {
            imgVehiculo.src = data.imagenFrontal;
        } else if (data.error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: data.error,
                backdrop: false
            });
        }
    })
    .catch(error =>  
        Swal.fire({
            icon: "error",
            title: "Error de conexión",
            backdrop: false
        })
    );
});


function descargarPDFs(button) {
    let archivosJSON = button.getAttribute("data-pdfs");

    if (!archivosJSON) {
        Swal.fire({
            icon: "warning",
            title: "No hay archivos disponibles",
            text: "No hay archivos PDF disponibles para descargar.",
            confirmButtonText: "Aceptar",
            backdrop: false
        });
        return;
    }
    

    let archivos = JSON.parse(archivosJSON);

    archivos.forEach(url => {
        let a = document.createElement("a");
        a.href = url;
        a.download = url.split("/").pop(); 
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
}

document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});
document.addEventListener('keydown', function(event) {
    if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I')) {
        event.preventDefault();
    }
});