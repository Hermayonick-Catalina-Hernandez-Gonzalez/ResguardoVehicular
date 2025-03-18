<?php
require_once "../php/conexion.php";

$action = $_REQUEST['action'] ?? '';

if ($action == "leer") {
    $stmt = $conn->query("SELECT id, Nombre, correo, rol FROM usuarios");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} elseif ($action == "agregar" || $action == "editar") {
    $id = $_POST['id'] ?? '';
    $nombre = $_POST['nombre'];
    $correo = $_POST['correo'];
    $contra = $_POST['contra'];
    $rol = $_POST['rol'];

    if ($action == "agregar") {
        // Insertar un nuevo usuario con contraseña encriptada
        $stmt = $conn->prepare("INSERT INTO usuarios (Nombre, correo, contra, rol) VALUES (?, ?, ?, ?)");
        $stmt->execute([$nombre, $correo, password_hash($contra, PASSWORD_BCRYPT), $rol]);
    } else {
        if (!empty($contra)) {
            // Si el usuario ingresó una nueva contraseña, actualizarla
            $stmt = $conn->prepare("UPDATE usuarios SET Nombre=?, correo=?, contra=?, rol=? WHERE id=?");
            $stmt->execute([$nombre, $correo, password_hash($contra, PASSWORD_BCRYPT), $rol, $id]);
        } else {
            // Si no ingresó nueva contraseña, mantener la actual
            $stmt = $conn->prepare("UPDATE usuarios SET Nombre=?, correo=?, rol=? WHERE id=?");
            $stmt->execute([$nombre, $correo, $rol, $id]);
        }
    }
} elseif ($action == "eliminar") {
    $stmt = $conn->prepare("DELETE FROM usuarios WHERE id=?");
    $stmt->execute([$_GET['id']]);
}