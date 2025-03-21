document.addEventListener("DOMContentLoaded", function () {
    cargarUsuarios();

    if (sessionStorage.getItem("modalAbierto") === "true") {
        sessionStorage.removeItem("modalAbierto"); 
    } else {
        cerrarModal(); 
    }
});


function cargarUsuarios() {
    fetch("../php/usuarios_crud.php?action=leer")
        .then(response => response.json())
        .then(data => {
            let tbody = document.getElementById("usuarios-lista");
            tbody.innerHTML = "";

            data.forEach(usuario => {
                if (usuario.id != usuarioActualId) {  
                    let fila = `
                        <tr>
                            <td>${usuario.Nombre}</td>
                            <td>${usuario.rol}</td>
                            <td>${usuario.correo}</td>
                            <td>
                                <button class="btn-editar" onclick="editarUsuario(${usuario.id}, '${usuario.Nombre}', '${usuario.correo}', '${usuario.rol}')">Editar</button>
                                <button class="btn-eliminar" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
                            </td>
                        </tr>
                    `;
                    tbody.innerHTML += fila;
                }
            });
        })
        .catch(error => console.error("Error al cargar usuarios:", error));
}


function abrirModal() {
    document.getElementById("titulo-modal").textContent = "Agregar Usuario";
    document.getElementById("id_usuario").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("correo").value = "";
    document.getElementById("contra").value = "";
    document.getElementById("rol").value = "administrador";

    let modal = document.getElementById("modalUsuario");
    if (modal) {
        modal.classList.add("show");
        modal.style.display = "block";  
        sessionStorage.setItem("modalAbierto", "true");
    }
}


function editarUsuario(id, nombre, correo, rol) {
    document.getElementById("titulo-modal").textContent = "Editar Usuario";
    document.getElementById("id_usuario").value = id;
    document.getElementById("nombre").value = nombre;
    document.getElementById("correo").value = correo;
    document.getElementById("contra").value = "";
    document.getElementById("rol").value = rol;

    let modal = document.getElementById("modalUsuario");
    if (modal) {
        modal.classList.add("show");
        modal.style.display = "block";  
        sessionStorage.setItem("modalAbierto", "true");
    }
}

function cerrarModal() {
    let modal = document.getElementById("modalUsuario");
    if (modal) {
        modal.classList.remove("show");
        modal.style.display = "none";  
        sessionStorage.removeItem("modalAbierto");
    }
}

function guardarUsuario() {
    let id = document.getElementById("id_usuario").value;
    let nombre = document.getElementById("nombre").value;
    let correo = document.getElementById("correo").value;
    let contra = document.getElementById("contra").value;
    let rol = document.getElementById("rol").value;

    let datos = new FormData();
    datos.append("id", id);
    datos.append("nombre", nombre);
    datos.append("correo", correo);
    datos.append("contra", contra);
    datos.append("rol", rol);
    datos.append("action", id ? "editar" : "agregar");

    fetch("../php/usuarios_crud.php", {
        method: "POST",
        body: datos
    })
    .then(() => {
        cerrarModal();
        cargarUsuarios();
    })
    .catch(error => console.error("Error al guardar usuario:", error));
}

function eliminarUsuario(id) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`../php/usuarios_crud.php?action=eliminar&id=${id}`)
                .then(() => cargarUsuarios())
                .catch(error => console.error("Error al eliminar usuario:", error));
        }
    });
}
