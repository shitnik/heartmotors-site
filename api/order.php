<?php

declare(strict_types=1);

// ============================================================
// API заказа из корзины.
// Принимает JSON из js/cart.js и сохраняет заказ в MySQL.
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
$customer = is_array($payload['customer'] ?? null) ? $payload['customer'] : [];
$items = is_array($payload['items'] ?? null) ? $payload['items'] : [];

$name = trim((string)($customer['name'] ?? ''));
$phone = trim((string)($customer['phone'] ?? ''));

if ($name === '' || $phone === '' || count($items) === 0) {
    respond(['error' => 'Name, phone and cart items are required'], 422);
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

    $pdo->beginTransaction();

    // Сначала сохраняем клиента, чтобы связать его с заказом.
    $userStatement = $pdo->prepare(
        'INSERT INTO users (name, email, phone)
         VALUES (:name, :email, :phone)',
    );
    $userStatement->execute([
        'name' => $name,
        'email' => trim((string)($customer['email'] ?? '')),
        'phone' => $phone,
    ]);
    $userId = (int)$pdo->lastInsertId();

    $total = 0.0;
    $normalizedItems = [];

    foreach ($items as $item) {
        $sku = trim((string)($item['sku'] ?? ''));
        $title = trim((string)($item['title'] ?? ''));
        $price = max(0, (float)($item['price'] ?? 0));
        $quantity = max(1, (int)($item['qty'] ?? 1));

        if ($sku === '' || $title === '') {
            continue;
        }

        $normalizedItems[] = [
            'sku' => $sku,
            'title' => $title,
            'price' => $price,
            'quantity' => $quantity,
        ];
        $total += $price * $quantity;
    }

    if (count($normalizedItems) === 0) {
        throw new InvalidArgumentException('Cart items are invalid');
    }

    $comment = trim(implode("\n", array_filter([
        (string)($customer['address'] ?? ''),
        (string)($customer['comment'] ?? ''),
    ])));

    $orderStatement = $pdo->prepare(
        'INSERT INTO orders (user_id, total, comment)
         VALUES (:user_id, :total, :comment)',
    );
    $orderStatement->execute([
        'user_id' => $userId,
        'total' => $total,
        'comment' => $comment,
    ]);
    $orderId = (int)$pdo->lastInsertId();

    $productIdStatement = $pdo->prepare(
        'SELECT id FROM products WHERE sku = :sku LIMIT 1',
    );
    $itemStatement = $pdo->prepare(
        'INSERT INTO order_items
         (order_id, product_id, sku, title, price, quantity)
         VALUES (:order_id, :product_id, :sku, :title, :price, :quantity)',
    );

    foreach ($normalizedItems as $item) {
        $productIdStatement->execute(['sku' => $item['sku']]);
        $product = $productIdStatement->fetch();

        $itemStatement->execute([
            'order_id' => $orderId,
            'product_id' => $product ? (int)$product['id'] : null,
            'sku' => $item['sku'],
            'title' => $item['title'],
            'price' => $item['price'],
            'quantity' => $item['quantity'],
        ]);
    }

    $pdo->commit();
    respond(['success' => true, 'orderId' => $orderId]);
} catch (Throwable $error) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log($error->getMessage());
    respond(['error' => 'Could not save order'], 500);
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
