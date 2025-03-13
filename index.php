<?php
session_start(); // Asegúrate de iniciar la sesión
require_once "php/conexion.php";
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="shortcut icon" href="img/Icono.png" />
    <link rel="stylesheet" href="css/styleslogin.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>
    <div class="container">
        <!-- Sección izquierda -->
        <div class="left-section">
            <img src="img/Logo2.png" alt="Logo FGJ">
        </div>

        <!-- Sección derecha -->
        <div class="right-section">
            <form method="POST" action="php/login.php">
                <h1>Inicia sesión</h1>

                <!-- Campo de correo -->
                <label for="correo">Correo:</label>
                <input type="email" id="correo" name="correo" placeholder="Ingresa tu correo" required>

                <!-- Campo de contraseña -->
                <label for="contra">Contraseña:</label>
                <div class="password-container">
                    <input type="password" id="contra" name="contra" placeholder="Ingresa tu contraseña" required>
                    <img id="toggle-password" src="img/ojo.png" alt="Mostrar contraseña" class="toggle-icon" onclick="togglePassword()">
                </div>

                <!-- Botón -->
                <button type="submit" class="btn-iniciar">Iniciar Sesión</button>
            </form>
        </div>
    </div>

    <script src="JS/acciones.js"></script>

    <!-- Script para mostrar alertas -->
    <script>
        <?php
        if (isset($_SESSION['error'])) {
            echo "Swal.fire({
                icon: 'error',
                title: 'Oops...',
                backdrop: false,
                text: '" . $_SESSION['error'] . "'
            });";
            unset($_SESSION['error']); // Eliminar la sesión de error después de mostrarla
        }
        ?>
    </script>
</body>
</html>

