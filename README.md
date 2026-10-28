# HeartMotors — сайт и база заказов

## Что работает на сайте

- `index.html` — одностраничный сайт с якорной навигацией.
- Каталог загружает товары из `data/catalog.csv`.
- Фильтры работают без перезагрузки страницы.
- Корзина сохраняется в `localStorage`.
- Оформление заказа отправляет имя, телефон, адрес, комментарий и состав корзины.
- Две формы консультации отправляют имя, email, автомобиль и комментарий.

## Важное ограничение GitHub Pages

GitHub Pages запускает только HTML, CSS и JavaScript. Он не запускает PHP и не предоставляет MySQL.

Поэтому рабочая схема такая:

```text
GitHub Pages → PHP API на PHP-хостинге → MySQL
```

Фронтенд можно оставить на GitHub Pages, а папку `api` загрузить на обычный PHP-хостинг с MySQL.

## Как подключить базу

1. Откройте phpMyAdmin на хостинге.
2. Выполните файл `schema.sql`.
3. Скопируйте `api/config.example.php` в `api/config.php`.
4. В `api/config.php` укажите хост, имя базы, пользователя и пароль MySQL.
5. В `allowed_origin` укажите адрес GitHub Pages, например `https://ваш-логин.github.io`.
6. Загрузите `api/order.php`, `api/lead.php` и `api/config.php` на PHP-хостинг.
7. В конце `index.html` укажите адреса API:

```html
<script>
  window.HEARTMOTORS_API_URL = 'https://ваш-домен.ru/api/order.php';
  window.HEARTMOTORS_LEAD_API_URL = 'https://ваш-домен.ru/api/lead.php';
</script>
```

После этого:

- заказы будут появляться в таблицах `users`, `orders`, `order_items`;
- заявки на консультацию будут появляться в `consultation_requests`.

## Локальный режим до подключения хостинга

Если адреса API оставить пустыми, сайт не ломается:

- заказы сохраняются в `localStorage` под ключом `heartmotors_orders`;
- заявки сохраняются в `localStorage` под ключом `heartmotors_leads`.

Это только режим тестирования. Для реальной базы нужно указать адреса PHP API.

## Безопасность

- Не загружайте `api/config.php` в публичный GitHub.
- В репозитории хранится только `api/config.example.php` без настоящего пароля.
- Файл `.gitignore` исключает `api/config.php` из Git.
- Для рабочего сайта в `allowed_origin` лучше указать конкретный домен, а не `*`.
