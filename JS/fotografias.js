let videoStream;
let imagenDestino;
let contadorExtra = 1;

function abrirCamara(idImagen) {
    imagenDestino = document.getElementById(idImagen);
    const modal = document.getElementById("modalCamara");
    const video = document.getElementById("video");
    modal.style.display = "flex";

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Tu navegador no soporta acceso a la cámara.");
        return;
    }

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            videoStream = stream;
            video.srcObject = stream;
        })
        .catch(function (error) {
            alert("No se pudo acceder a la cámara.");
        });
}

function tomarFoto() {
    const canvas = document.getElementById("canvas");
    const video = document.getElementById("video");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imagenBase64 = canvas.toDataURL("image/png");
    imagenDestino.src = imagenBase64;
    localStorage.setItem(imagenDestino.id, imagenBase64);
    cerrarCamara();
}

function cerrarCamara() {
    const modal = document.getElementById("modalCamara");
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
    }
    modal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
    const imagenes = document.querySelectorAll("img");
    imagenes.forEach(imagen => {
        const imagenGuardada = localStorage.getItem(imagen.id);
        if (imagenGuardada) {
            imagen.src = imagenGuardada;
        }
    });

    let observaciones = document.querySelectorAll("textarea[id^='observaciones-']");
    observaciones.forEach((observacion) => {
        const observacionGuardada = localStorage.getItem(observacion.id);
        if (observacionGuardada) {
            observacion.value = observacionGuardada;
        }
        observacion.addEventListener("input", function () {
            localStorage.setItem(observacion.id, observacion.value);
        });
    });

    // Esperar a que el contenedor de fotos extra esté disponible antes de restaurarlas
    const esperarContenedor = setInterval(() => {
        if (document.getElementById("extra-fotos-container")) {
            clearInterval(esperarContenedor);
            restaurarFotosExtras();
        }
    }, 100);
});


function agregarFotoExtra() {
    const contenedor = document.getElementById("extra-fotos-container");
    let ultimaFila = contenedor.lastElementChild;
    if (!ultimaFila || ultimaFila.children.length >= 2) {
        ultimaFila = document.createElement("div");
        ultimaFila.classList.add("foto-apartado-container");
        contenedor.appendChild(ultimaFila);
    }
    const idExtra = `extra-dinamico-${contadorExtra}`;
    const nuevoApartado = document.createElement("div");
    nuevoApartado.classList.add("foto-apartado");
    nuevoApartado.innerHTML = `
        <p>Extra ${contadorExtra}:</p>
        <button class="btn-remove" onclick="eliminarFotoExtra(this, '${idExtra}')">✖</button>
        <img src="../../img/agregar.png" alt="extra" class="foto-preview" id="${idExtra}" onclick="abrirCamara('${idExtra}')">
        <textarea id="observaciones-${idExtra}" name="observaciones_extra" rows="2" cols="5" placeholder="Observaciones"></textarea>
    `;
    ultimaFila.appendChild(nuevoApartado);
    guardarFotoExtra(idExtra);
    const textarea = document.getElementById(`observaciones-${idExtra}`);
    textarea.addEventListener("input", function () {
        localStorage.setItem(`observacion-${idExtra}`, textarea.value);
    });
    contadorExtra++;
}

function eliminarFotoExtra(boton, idImagen) {
    const apartado = boton.parentElement;
    const fila = apartado.parentElement;

    apartado.remove();
    localStorage.removeItem(idImagen);

    let fotosExtras = JSON.parse(localStorage.getItem("fotosExtras")) || [];
    fotosExtras = fotosExtras.filter(id => id !== idImagen);
    localStorage.setItem("fotosExtras", JSON.stringify(fotosExtras));

    if (fila.children.length === 0) {
        fila.remove();
    }

    // Si no quedan imágenes, reiniciar el contador a 1
    const contenedor = document.getElementById("extra-fotos-container");
    if (contenedor.getElementsByClassName("foto-apartado").length === 0) {
        contadorExtra = 1;
    }
}

function guardarFotoExtra(idImagen) {
    let fotosExtras = JSON.parse(localStorage.getItem("fotosExtras")) || [];
    if (!fotosExtras.includes(idImagen)) {
        fotosExtras.push(idImagen);
        localStorage.setItem("fotosExtras", JSON.stringify(fotosExtras));
    }

    const observacionElement = document.getElementById(`observaciones-${idImagen}`);
    if (observacionElement) {
        observacionElement.addEventListener("input", function () {
            localStorage.setItem(`observacion-${idImagen}`, observacionElement.value);
        });
    }
}


function restaurarFotosExtras() {
    const contenedor = document.getElementById("extra-fotos-container");

    if (!contenedor) {
        console.warn("⚠️ No se encontró el contenedor de fotos extra en el DOM.");
        return;
    }

    let fotosExtras = JSON.parse(localStorage.getItem("fotosExtras")) || [];

    fotosExtras.forEach(idExtra => {
        let filas = contenedor.getElementsByClassName("foto-apartado-container");
        let ultimaFila = filas[filas.length - 1];

        if (!ultimaFila || ultimaFila.children.length >= 2) {
            ultimaFila = document.createElement("div");
            ultimaFila.classList.add("foto-apartado-container");
            contenedor.appendChild(ultimaFila);
        }

        const nuevoApartado = document.createElement("div");
        nuevoApartado.classList.add("foto-apartado");

        nuevoApartado.innerHTML = ` 
            <p>Extra ${idExtra.split('-')[2]}:</p>
            <button class="btn-remove" onclick="eliminarFotoExtra(this, '${idExtra}')"> ✖</button>
            <img src="../../img/agregar.png" alt="extra" class="foto-preview" id="${idExtra}" onclick="abrirCamara('${idExtra}')">
            <textarea id="observaciones-${idExtra}" name="observaciones" rows="2" cols="5" placeholder="Observaciones"></textarea>
        `;

        ultimaFila.appendChild(nuevoApartado);

        // Restaurar imagen si existe en localStorage
        const imagenGuardada = localStorage.getItem(idExtra);
        if (imagenGuardada) {
            document.getElementById(idExtra).src = imagenGuardada;
        }

        // Restaurar observación si existe en localStorage
        const observacionGuardada = localStorage.getItem(`observacion-${idExtra}`);
        if (observacionGuardada) {
            document.getElementById(`observaciones-${idExtra}`).value = observacionGuardada;
        }
    });

    contadorExtra = fotosExtras.length > 0 ? parseInt(fotosExtras[fotosExtras.length - 1].split('-')[2]) + 1 : 1;
}


function guardar() {
    let formData = new FormData();
    let vehiculoId = localStorage.getItem("vehiculo_id");

    if (!vehiculoId) {
        Swal.fire("Error", "No se encontró el ID del vehículo.", "error");
        return;
    }


    let fotosObligatorias = [
        'foto-frontal',
        'foto-posterior',
        'foto-derecho',
        'foto-izquierdo',
        'foto-kilometraje',
        'foto-numero-serie'
    ];

    let fotosFaltantes = [];

    fotosObligatorias.forEach(fotoId => {
        const img = document.getElementById(fotoId);
        if (!img || !img.src.startsWith("data:image")) {
            fotosFaltantes.push(fotoId);
        }
    });

    if (fotosFaltantes.length > 0) {
        Swal.fire({
            title: "Faltan fotografías",
            text: "Debe capturar al menos las 6 imágenes obligatorias.",
            icon: "warning",
            backdrop: false
        });
        return;
    }
    
    fotosObligatorias.forEach(fotoId => {
        const img = document.getElementById(fotoId);
        const blob = dataURLtoBlob(img.src);
        formData.append('imagenes[]', blob, `${fotoId}.png`);

        const observacionElement = document.getElementById(`observaciones-${fotoId}`);
        const observacion = observacionElement ? observacionElement.value : "";
        formData.append('observaciones_normales[]', observacion);
    });

    let fotosExtras = JSON.parse(localStorage.getItem("fotosExtras")) || [];
    fotosExtras.forEach(idExtra => {
        const img = document.getElementById(idExtra);
        if (img && img.src.startsWith("data:image")) {
            const blob = dataURLtoBlob(img.src);
            formData.append('imagenes_extra[]', blob, `${idExtra}.png`);

            const observacionElement = document.getElementById(`observaciones-${idExtra}`);
            const observacion = observacionElement ? observacionElement.value : "";
            formData.append('observaciones_extra[]', observacion);
        }
    });

    formData.append("vehiculo_id", vehiculoId);

    fetch('http://localhost/xampp/VehiculosSQLSERVE/php/guardar_fotografias.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        Swal.fire({
            icon: 'success',
            title: '¡Se ha Guardado Exitosamente!',
            timer: 1500,
            showConfirmButton: false,
            backdrop: false
        }).then(() => {
            localStorage.setItem("vehiculo_id", data.vehiculo_id);
            window.location.href = "../formulario/pdfs.php";
        });
    })
    .catch(error => {
        console.error("Error:", error);
        Swal.fire("Error", "No se pudo guardar las imágenes.", "error");
    });
}


function dataURLtoBlob(dataurl) {
    const [header, base64] = dataurl.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const binary = atob(base64);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: mime });
}