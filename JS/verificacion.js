document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".tabcontent").forEach(tab => {
        tab.style.display = "none";
    });

    const defaultTab = document.getElementById("Exterior");
    const defaultButton = document.getElementById("exterior");

    if (defaultTab && defaultButton) {
        defaultTab.style.display = "block";
        defaultButton.classList.add("active");
    }

    const iframes = document.querySelectorAll("iframe");

    iframes.forEach(iframe => {
        iframe.addEventListener("load", function () {
            iframe.contentWindow.postMessage({ type: "loadRadios" }, "*");
        });
    });

    window.addEventListener("message", function (event) {
        if (event.data.type === "saveRadio") {
            localStorage.setItem(event.data.name, event.data.value);
        } else if (event.data.type === "loadRadios") {
            let storedValues = {};
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                storedValues[key] = localStorage.getItem(key);
            }
            event.source.postMessage({ type: "restoreRadios", values: storedValues }, "*");
        }
    });
});

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


function nextTab() {
    const tabs = ["Exterior", "Interior", "Accesorios"];
    let currentTabIndex = tabs.findIndex(tab => document.getElementById(tab).style.display === "block");

    if (currentTabIndex < tabs.length - 1) {
        document.getElementById(tabs[currentTabIndex]).style.display = "none";
        document.getElementById(tabs[currentTabIndex + 1]).style.display = "block";

        document.querySelectorAll(".tablink").forEach(btn => btn.classList.remove("active"));
        document.getElementById(tabs[currentTabIndex + 1].toLowerCase()).classList.add("active");
    } else {
        guardarVerificacion();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        const storedValue = localStorage.getItem(radio.name);
        if (storedValue && radio.value === storedValue) {
            radio.checked = true;
        }

        radio.addEventListener("change", function () {
            localStorage.setItem(radio.name, radio.value);
        });
    });
});

function finalizarFormulario() {
    localStorage.clear();
}

function guardarVerificacion() {
    let datos = [];
    let allFieldsFilled = true;
    let vehiculoId = localStorage.getItem("vehiculo_id");

    if (!vehiculoId) {
        Swal.fire({
            title: "Error",
            text: "LLenar el Formulario de Unidad Vehicular antes de guardar la verificación",
            icon: "error"
        });
        return;
    }

    const iframes = document.querySelectorAll("iframe");
    let pendientes = iframes.length;

    iframes.forEach(iframe => {
        iframe.contentWindow.postMessage({ type: "getDatos" }, "*");
    });

    window.addEventListener("message", function recibirMensaje(event) {
        if (event.data.type === "respuestaDatos") {
            datos.push(...event.data.datos);
            pendientes--;

            event.data.datos.forEach(dato => {
                let radiosDelGrupo = document.querySelectorAll(`input[name="${dato.elemento}"]`);

                if (!dato.estado || dato.estado.trim() === "") {
                    allFieldsFilled = false;
                    radiosDelGrupo.forEach(radio => {
                        radio.parentNode.style.border = "2px solid red"; 
                    });
                } else {
                    radiosDelGrupo.forEach(radio => {
                        radio.parentNode.style.border = ""; 
                    });
                }
            });

            if (pendientes === 0) {
                window.removeEventListener("message", recibirMensaje);

                if (!allFieldsFilled) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Faltan campos por llenar',
                        text: 'Por favor, selecciona todas las opciones antes de guardar.',
                        backdrop: false
                    });
                    return;
                }
                enviarDatos(vehiculoId, datos);
            }
        }
    });
}

function enviarDatos(vehiculoId, datos) {
    fetch("https://pruebas-vehiculos.fgjtam.gob.mx/php/guardar_verificacion.php", {
        method: "POST",
        body: JSON.stringify({ vehiculo_id: vehiculoId, datos: datos }), 
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json()) 
    .then(data => {
        if (data.mensaje) {
            localStorage.setItem("vehiculo_id", data.vehiculo_id);
            localStorage.setItem("seccion_verificacion", "completado");
            window.location.href = "../formulario/fotografias.php";
        } else {
            Swal.fire("Error", data.error || "No se pudo guardar la verificación", "error");
        }
    })
    .catch(error => {
        Swal.fire("Error", "No se pudo guardar la verificación", "error");
    });
}
