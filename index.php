<?php
session_start();
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
<body`>
    <div class="container">
        <div class="left-section">
            <img src="img/Logo2.png" alt="Logo FGJ">
        </div>

        <div class="right-section">
            <form method="POST" action="php/login.php">
                <h1>Inicia sesión</h1>

                <label for="correo">Correo:</label>
                <input type="email" id="correo" name="correo" placeholder="Ingresa tu correo" required>

                <label for="contra">Contraseña:</label>
                <div class="password-container">
                    <input type="password" id="contra" name="contra" placeholder="Ingresa tu contraseña" required>
                    <img id="toggle-password" src="img/ojo.png" alt="Mostrar contraseña" class="toggle-icon" onclick="togglePassword()">
                </div>

                <button type="submit" class="btn-iniciar">Iniciar Sesión</button>
            </form>
        </div>
    </div>

    <script src="JS/acciones.js"></script>

    <script>
        document.addEventListener("DOMContentLoaded", function () {
            <?php
            if (isset($_SESSION['error'])) {
                echo "Swal.fire({
                    icon: 'error',
                    title: 'Error...',
                    text: '" . $_SESSION['error'] . "',
                    backdrop: false
                });";
                unset($_SESSION['error']);
            }
            ?>
        });
    </script>
</body>
</html>
