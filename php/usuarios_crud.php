<?php
require_once "../php/conexion.php";
session_start();

$action = $_REQUEST['action'] ?? '';
$usuario_id_sesion = $_SESSION['usuario_id']; 

if ($action == "leer") {
    $stmt = $conn->prepare("SELECT id, Nombre, correo, rol FROM usuarios WHERE id != ?");
    $stmt->execute([$usuario_id_sesion]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} elseif ($action == "agregar" || $action == "editar") {
    $id = $_POST['id'] ?? '';
    $nombre = $_POST['nombre'];
    $correo = $_POST['correo'];
    $contra = $_POST['contra'];
    $rol = $_POST['rol'];

    if ($action == "agregar") {
        $stmt = $conn->prepare("INSERT INTO usuarios (Nombre, correo, contra, rol) VALUES (?, ?, ?, ?)");
        $stmt->execute([$nombre, $correo, password_hash($contra, PASSWORD_BCRYPT), $rol]);
    } else {
        if (!empty($contra)) {
            $stmt = $conn->prepare("UPDATE usuarios SET Nombre=?, correo=?, contra=?, rol=? WHERE id=?");
            $stmt->execute([$nombre, $correo, password_hash($contra, PASSWORD_BCRYPT), $rol, $id]);
        } else {
            $stmt = $conn->prepare("UPDATE usuarios SET Nombre=?, correo=?, rol=? WHERE id=?");
            $stmt->execute([$nombre, $correo, $rol, $id]);
        }
    }
} elseif ($action == "eliminar") {
    $stmt = $conn->prepare("DELETE FROM usuarios WHERE id=?");
    $stmt->execute([$_GET['id']]);
}
