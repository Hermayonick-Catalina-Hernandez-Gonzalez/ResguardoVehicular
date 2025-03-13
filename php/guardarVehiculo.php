<?php
session_start();

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['numeroEconomico'])) {
    $_SESSION['numeroEconomico'] = $data['numeroEconomico'];
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Número económico no proporcionado"]);
}
?>
