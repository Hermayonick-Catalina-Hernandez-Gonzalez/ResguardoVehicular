<?php
session_start();
if ($_SESSION['rol'] != 'administrador') {
    header("Location: ../index.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Usuarios</title>
    <link rel="shortcut icon" href="../img/Icono.png" />
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="../css/stylesInicio.css">
</head>

<body>
    <header class="head">
        <div class="esquina-container">
            <button class="btn-salir" onclick="salir()">
                <img src="../img/Salir.png" alt="Salir">
            </button>
            <div class="esquina">
                <img src="../img/Esquina.png" alt="Imagen de Esquina">
            </div>
        </div>
        <div class="titulo">
            <h1>Usuarios del Sistema</h1>
        </div>
        <div class="logo">
            <img src="../img/Logo.png" alt="Logo FGJ">
        </div>
    </header>

    <div class="barra-busqueda">
        <input type="text" id="search" placeholder="Buscar..." oninput="buscar()">
        <img src="../img/Buscador.png" alt="Buscar" class="icono-buscar">
    </div>

    <button class="btn-agregar" onclick="abrirModal()"> Agregar Usuario</button>

    <table>
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Correo</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody id="usuarios-lista">

        </tbody>
    </table>

    <!-- Modal para Agregar/Editar Usuario -->
    <div id="modalUsuario" class="modal">
        <div class="modal-content">
            <span class="close" onclick="cerrarModal()">
                <i class="fa-solid fa-xmark"></i>
            </span>

            <div class="modal-header">
                <img src="../img/editar.png" alt="User Icon" class="icono-usuario">
                <h2 id="titulo-modal">Agregar Usuario</h2>
            </div>

            <div class="modal-body">
                <input type="hidden" id="id_usuario">

                <div class="input-group">
                    <i class="fa-solid fa-user"></i>
                    <input type="text" id="nombre" placeholder="Nombre">
                </div>


                <div class="input-group">
                    <i class="fa-solid fa-envelope"></i>
                    <input type="email" id="correo" placeholder="Correo">
                </div>

                <div class="input-group">
                    <i class="fa-solid fa-lock"></i>
                    <input type="password" id="contra" placeholder="Contraseña">
                </div>

                <div class="input-group">
                    <i class="fa-solid fa-briefcase"></i>
                    <select id="rol">
                        <option value="administrador">Administrador</option>
                        <option value="verificador">Verificador</option>
                        <option value="resguardante">Resguardante</option>
                    </select>
                </div>

                <button class="btn-guardar" onclick="guardarUsuario()">Guardar</button>
            </div>
        </div>
    </div>


    <script src="../JS/usuarios.js"></script>
    <script src="../JS/acciones.js"></script>
    <script>
        const usuarioActualId = <?php echo json_encode($_SESSION['usuario_id']); ?>;
    </script>

</body>

</html>