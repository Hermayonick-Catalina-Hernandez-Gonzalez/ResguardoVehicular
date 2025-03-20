document.addEventListener("DOMContentLoaded", function () {
    let links = document.querySelectorAll(".menu-link");
    let currentPath = window.location.pathname.split('/').pop(); // Obtiene el nombre del archivo actual

    links.forEach(link => {
        if (link.getAttribute("href").includes(currentPath)) {
            link.classList.add("active");
        }
    });
    let fgjrmInput = document.getElementById("FGJRM");

    if (localStorage.getItem("FGJRM")) {
        fgjrmInput.value = localStorage.getItem("FGJRM"); 
        fgjrmInput.setAttribute("readonly", "readonly");
    } else {
        fgjrmInput.addEventListener("input", function () {
            localStorage.setItem("FGJRM", fgjrmInput.value);
            fgjrmInput.setAttribute("readonly", "readonly"); 
        });
    }
});

// Función para formatear la fecha al formato YYYY-MM-DD
function formatearFecha(fechaHora) {
    var fecha = new Date(fechaHora);
    var año = fecha.getFullYear();
    var mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
    var dia = ('0' + fecha.getDate()).slice(-2);
    return año + '-' + mes + '-' + dia;
}

document.addEventListener("DOMContentLoaded", function () {
    var observer = new MutationObserver(() => {
        var fechaInput = document.getElementById('fecha');
        if (fechaInput) {
            observer.disconnect();
            asignarFecha();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
});

function asignarFecha() {
    var fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        fechaInput.removeAttribute("disabled");
        var today = new Date();
        // Formatear la fecha antes de asignarla
        fechaInput.value = formatearFecha(today);
        fechaInput.setAttribute("disabled", "disabled");
    }
}


function cerrar() {
    window.location.href = "../../php/logout.php";
}

function buscarEmpleado(tipo) {
    let numeroEmpleadoElement = document.getElementById(tipo);

    if (!numeroEmpleadoElement) {
        return;
    }

    let numeroEmpleado = numeroEmpleadoElement.value.trim();

    if (numeroEmpleado === "") {
        return;
    }

    let url = `https://pruebas-vehiculos.fgjtam.gob.mx/php/buscarEmpleado.php?numero_empleado=${encodeURIComponent(numeroEmpleado)}`;

    fetch(url)
        .then(response => response.text())
        .then(data => {
            const jsonResponse = data.substring(data.indexOf("{"));
            try {
                const jsonData = JSON.parse(jsonResponse);
                if (jsonData.error) {
                    Swal.fire({
                        title: "Oops...",
                        text: jsonData.error,
                        icon: "error",
                        backdrop: false
                    });
                } else {
                    // Llenar los campos del formulario con los datos recibidos solo si existen
                    if (tipo === "numero_empleado") {
                        // Llenar los datos del resguardante
                        document.getElementById("resguardante").value = jsonData.nombre_completo || "";
                        document.getElementById("cargo").value = jsonData.NOMBRE_PUESTO_TABULAR || "";
                        document.getElementById("fiscalia_general").value = jsonData.FISCALIA_GENERAL || "";
                        document.getElementById("fiscalia_especializada_en").value = jsonData.AREA_DE_ADSCIPCION || "";
                        document.getElementById("vicefiscalia_en").value = jsonData.DIRECCION || "";
                        document.getElementById("direccion_general").value = jsonData.DIRECCION || "";
                        document.getElementById("departamento_area").value = jsonData.AREA_DE_ADSCIPCION || "";
                        document.getElementById("licencia").value = jsonData.FOLIO_LICENCIA_MANEJO || "";
                        document.getElementById("vigencia").value = formatearFecha(jsonData.FECHA_VENCIMIENTO_LICENCIA) || "";

                        localStorage.setItem("resguardante", jsonData.nombre_completo || "");
                        localStorage.setItem("cargo", jsonData.NOMBRE_PUESTO_TABULAR || "");
                        localStorage.setItem("fiscalia_general", jsonData.FISCALIA_GENERAL || "");
                        localStorage.setItem("fiscalia_especializada_en", jsonData.AREA_DE_ADSCIPCION || "");
                        localStorage.setItem("vicefiscalia_en", jsonData.DIRECCION || "");
                        localStorage.setItem("direccion_general", jsonData.DIRECCION || "");
                        localStorage.setItem("departamento_area", jsonData.AREA_DE_ADSCIPCION || "");
                        localStorage.setItem("licencia", jsonData.FOLIO_LICENCIA_MANEJO || "");
                        localStorage.setItem("vigencia", formatearFecha(jsonData.FECHA_VENCIMIENTO_LICENCIA) || "");
                    } else if (tipo === "numero_empleado_interno") {
                        // Llenar los datos del resguardante interno
                        document.getElementById("resguardante_interno").value = jsonData.nombre_completo || "";
                        document.getElementById("cargo_interno").value = jsonData.NOMBRE_PUESTO_TABULAR || "";
                        document.getElementById("numero_empleado_interno").value = jsonData.NUMERO_DE_EMPLEADO || "";
                        document.getElementById("celular").value = jsonData.CELULAR || "";
                        document.getElementById("licencia_interna").value = jsonData.FOLIO_LICENCIA_MANEJO || "";
                        document.getElementById("vigencia_interna").value = formatearFecha(jsonData.FECHA_VENCIMIENTO_LICENCIA) || "";

                        localStorage.setItem("resguardante_interno", jsonData.nombre_completo || "");
                        localStorage.setItem("cargo_interno", jsonData.NOMBRE_PUESTO_TABULAR || "");
                        localStorage.setItem("numero_empleado_interno", jsonData.NUMERO_DE_EMPLEADO || "");

                        localStorage.setItem("licencia_interna", jsonData.FOLIO_LICENCIA_MANEJO || "");
                        localStorage.setItem("vigencia_interna", formatearFecha(jsonData.FECHA_VENCIMIENTO_LICENCIA) || "");
                    }

                    Swal.fire({
                        title: "¡Éxito!",
                        text: "Empleado encontrado.",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                        backdrop: false
                    });
                }
            } catch (error) {

                Swal.fire({
                    title: "Oops...",
                    text: "La respuesta del servidor no es un JSON válido.",
                    icon: "error",
                    backdrop: false
                });
            }
        })
        .catch(error => {
            Swal.fire({
                title: "Oops...",
                text: "Error en la solicitud.",
                icon: "error",
                backdrop: false
            });
        });

}


document.addEventListener("DOMContentLoaded", function () {
    cargarDatosFormulario(); // Carga los datos almacenados en localStorage
    // Guardar cambios a medida que el usuario escribe
    document.querySelectorAll("#formularioResguardante input").forEach(input => {
        input.addEventListener("input", function () {
            localStorage.setItem(input.id, input.value);
        });
    });
});

// Cargar los datos desde localStorage
function cargarDatosFormulario() {
    document.querySelectorAll("#formularioResguardante input").forEach(input => {
        let valorGuardado = localStorage.getItem(input.id);
        if (valorGuardado) {
            input.value = valorGuardado;
        }
    });
}

function validarCelular() {
    let celularInput = document.getElementById("celular");
    let celular = celularInput.value.trim();

    let regex = /^[0-9]{10}$/; // Expresión regular para validar 10 dígitos numéricos

    if (!regex.test(celular)) {
        Swal.fire({
            title: "Número inválido",
            text: "El número de celular debe contener exactamente 10 dígitos numéricos.",
            icon: "warning"
        });

        celularInput.style.border = "2px solid red"; // Resaltar campo en rojo si es incorrecto
        celularInput.value = ""; // Limpiar campo si es inválido
    } else {
        celularInput.style.border = "2px solid green"; // Resaltar campo en verde si es correcto
    }
}

function guardarDatos() {
    var formElements = document.getElementById('formularioResguardante').elements;
    var allFieldsFilled = true;

    for (var i = 0; i < formElements.length; i++) {
        var element = formElements[i];

        if (element.required && element.value.trim() === "") {
            allFieldsFilled = false;
            element.style.border = "1px solid red";
        } else {
            element.style.border = "";
        }
    }

    if (!allFieldsFilled) {
        Swal.fire({
            icon: 'warning',
            title: 'Faltan campos por llenar',
            text: 'Por favor, completa todos los campos obligatorios.',
            backdrop: false
        });
        return;
    }

    var formData = new FormData(document.getElementById('formularioResguardante'));

    fetch('https://pruebas-vehiculos.fgjtam.gob.mx/php/guardar_resguardante.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text()) 
    .then(data => {
        try {
            var jsonData = JSON.parse(data);

            if (jsonData.resguardante_id) {
                localStorage.setItem("resguardante_id", jsonData.resguardante_id);
                window.location.href = "../formulario/unidadVehicular.php";
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al guardar los datos',
                    text: jsonData.error || "Error desconocido"
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error en la respuesta del servidor',
                text: 'La respuesta no es un JSON válido. Revisa la consola.'
            });
            console.error("Error al procesar JSON:", error);
        }
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error en la solicitud',
            text: error
        });
    });
}


// Limpiar localStorage solo cuando el usuario presiona "Aceptar"
function finalizarFormulario() {
    localStorage.clear();
    location.reload();
}