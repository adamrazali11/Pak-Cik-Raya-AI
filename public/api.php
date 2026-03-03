<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Load environment variables (you might need a library like vlucas/phpdotenv for this in production, 
// or just set them in your server config. For this example, we'll use getenv or defaults)
$dbHost = getenv('DB_HOST') ?: 'localhost';
$dbUser = getenv('DB_USER') ?: 'root';
$dbPass = getenv('DB_PASSWORD') ?: '';
$dbName = getenv('DB_NAME') ?: 'chat_db';

try {
    $pdo = new PDO("mysql:host=$dbHost;charset=utf8mb4", $dbUser, $dbPass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create database if not exists
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbName`");
    $pdo->exec("USE `$dbName`");

    // Create table if not exists
    $pdo->exec("CREATE TABLE IF NOT EXISTS user_chats (
        ip_address VARCHAR(45) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        messages JSON,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id)
    )");

} catch(PDOException $e) {
    http_response_code(500);
    echo JSON_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['messages']) || !isset($data['user_id'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing messages or user_id"]);
        exit();
    }

    $userId = $data['user_id'];
    $messages = json_encode($data['messages']);
    $ip = $_SERVER['REMOTE_ADDR'];

    try {
        $stmt = $pdo->prepare("INSERT INTO user_chats (ip_address, user_id, messages) VALUES (:ip, :user_id, :messages) ON DUPLICATE KEY UPDATE messages = :messages, ip_address = :ip");
        $stmt->execute([':ip' => $ip, ':user_id' => $userId, ':messages' => $messages]);

        echo json_encode(["success" => true, "message" => "Chat saved successfully"]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to save chat: " . $e->getMessage()]);
    }
} elseif ($method === 'GET') {
    if (!isset($_GET['user_id'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing user_id"]);
        exit();
    }

    $userId = $_GET['user_id'];

    try {
        $stmt = $pdo->prepare("SELECT messages FROM user_chats WHERE user_id = :user_id");
        $stmt->execute([':user_id' => $userId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            echo json_encode(["success" => true, "messages" => json_decode($row['messages'])]);
        } else {
            echo json_encode(["success" => false, "message" => "No chat found"]);
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch chat: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
?>
