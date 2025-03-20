document.addEventListener("DOMContentLoaded", function () {
    let numeroEconomico = localStorage.getItem("numeroEconomico");

    if (!numeroEconomico) {
        alert("No se encontró información del vehículo.");
        window.location.href = 'index.php';
    } else {
        obtenerDatosVehiculo(numeroEconomico);
    }
});

function obtenerDatosVehiculo(numeroEconomico) {
    $.ajax({
        url: '../php/obtenerVehiculo.php',
        type: 'GET',
        data: { numeroEconomico: numeroEconomico },
        success: function(response) {
            const vehiculo = JSON.parse(response);
            if (vehiculo) {
                document.getElementById("numeroEconomico").textContent = vehiculo.numero_economico;
                document.getElementById("placa").textContent = vehiculo.placa;
                document.getElementById("serie").textContent = vehiculo.serie;
                document.getElementById("color").textContent = vehiculo.color;
                document.getElementById("clase").textContent = vehiculo.clase;
                document.getElementById("marca").textContent = vehiculo.marca;
                document.getElementById("submarca").textContent = vehiculo.submarca;
                document.getElementById("modelo").textContent = vehiculo.modelo;
            } else {
                alert("No se encontró información del vehículo.");
            }
        },
        error: function() {
            alert("Error al cargar los datos del vehículo.");
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
    } else {
        console.error("Número Económico no encontrado en localStorage.");
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
        } else {
            console.error("No se encontró imagen para el vehículo.");
        }
    })
    .catch(error => console.error("Error al cargar la imagen:", error));
});

function descargarPDFs(button) {
    let archivosJSON = button.getAttribute("data-pdfs");

    if (!archivosJSON) {
        alert("No hay archivos PDF disponibles para descargar.");
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
