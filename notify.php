<?php

// 🔴 PON AQUÍ TU WEBHOOK DE DISCORD
$webhook = "https://discord.com/api/webhooks/1450534630657888368/FIWSmNa2-4WiWZuL30mJPQssuNNrmEoKZIm0WNtaz-NXSYMeUbzuY3__CWTMusm934Bn";

// Obtener IP real
function getUserIP() {
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        return $_SERVER['HTTP_CF_CONNECTING_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        return $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        return $_SERVER['REMOTE_ADDR'];
    }
}

$ip = getUserIP();

// Archivo base de datos simple
$dbFile = "visits.json";

if (!file_exists($dbFile)) {
    file_put_contents($dbFile, json_encode([]));
}

$data = json_decode(file_get_contents($dbFile), true);

// Contador de visitas
if (!isset($data[$ip])) {
    $data[$ip] = 0;
}

$data[$ip] += 1;

file_put_contents($dbFile, json_encode($data, JSON_PRETTY_PRINT));

// Obtener geolocalización
$location = "Desconocido";
$response = @file_get_contents("http://ip-api.com/json/" . $ip);

if ($response !== false) {
    $geo = json_decode($response, true);
    if ($geo['status'] === "success") {
        $location = $geo['country'] . ", " . $geo['city'];
    }
}

// Mensaje para Discord
$message = [
    "content" => "🌐 Nueva visita:\nIP: $ip\nUbicación: $location\nVeces que ha entrado: " . $data[$ip]
];

// Enviar webhook
$ch = curl_init($webhook);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-type: application/json']);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($message));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_exec($ch);
curl_close($ch);

?>
