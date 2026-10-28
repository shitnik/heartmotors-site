<?php

declare(strict_types=1);

// ============================================================
// API заявок на консультацию.
// Используется hero-формой и формой внизу страницы.
// ============================================================

$configPath = __DIR__ . '/config.php';

if (!is_file($configPath)) {
    respond(['error' => 'Server is not configured'], 500);
}

$config = require $configPath;
setCorsHeaders((string)($config['allowed_origin'] ?? '*'));

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['error' => 'Method not allowed'], 405);
}

$payload = json_decode(file_get_contents('php://input'), true);
$payload = is_array($payload) ? $payload : [];

$name = trim((string)($payload['name'] ?? ''));
$email = trim((string)($payload['email'] ?? ''));
$phone = trim((string)($payload['phone'] ?? ''));
$car = trim((string)($payload['car'] ?? ''));
$comment = trim((string)($payload['comment'] ?? ''));
$source = trim((string)($payload['source'] ?? 'website')) ?: 'website';

if ($name === '') {
    respond(['error' => 'Name is required'], 422);
}

try {
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=%s',
        $config['host'],
        $config['database'],
        $config['charset'] ?? 'utf8mb4',
    );

    $pdo = new PDO(
        $dsn,
        $config['user'],
        $config['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ],
    );

    $statement = $pdo->prepare(
        'INSERT INTO consultation_requests
         (name, email, phone, car, source, comment)
         VALUES (:name, :email, :phone, :car, :source, :comment)',
    );
    $statement->execute([
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'car' => $car,
        'source' => $source,
        'comment' => $comment,
    ]);

    respond([
        'success' => true,
        'requestId' => (int)$pdo->lastInsertId(),
    ]);
} catch (Throwable $error) {
    error_log($error->getMessage());
    respond(['error' => 'Could not save consultation request'], 500);
}

function setCorsHeaders(string $allowedOrigin): void
{
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: ' . ($allowedOrigin ?: '*'));
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
}

function respond(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}
