<?php
declare(strict_types=1);

/*
 * Чистая вода — серверная копия заказа.
 * Принимает только POST с подтверждённым в интерфейсе согласием.
 */
$to = 'internet.list@internet.ru';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit('Method Not Allowed');
}

$honeypot = trim((string)($_POST['website'] ?? ''));
if ($honeypot !== '') { http_response_code(204); exit; }

// Не принимаем запросы с явно чужого Origin/Referer.
$host = preg_replace('/[^a-zA-Z0-9.:-]/', '', (string)($_SERVER['HTTP_HOST'] ?? ''));
$origin = trim((string)($_SERVER['HTTP_ORIGIN'] ?? ''));
$referer = trim((string)($_SERVER['HTTP_REFERER'] ?? ''));
if ($origin !== '') {
    $originHost = (string)parse_url($origin, PHP_URL_HOST);
    if ($host !== '' && $originHost !== '' && strcasecmp($originHost, preg_replace('/:\\d+$/', '', $host)) !== 0) {
        http_response_code(403); exit('Forbidden');
    }
} elseif ($referer !== '') {
    $refHost = (string)parse_url($referer, PHP_URL_HOST);
    if ($host !== '' && $refHost !== '' && strcasecmp($refHost, preg_replace('/:\\d+$/', '', $host)) !== 0) {
        http_response_code(403); exit('Forbidden');
    }
}

$personalConsent = (string)($_POST['personal_consent'] ?? '') === '1';
$privacyAcknowledgement = (string)($_POST['privacy_acknowledgement'] ?? '') === '1';
$offerAcceptance = (string)($_POST['offer_acceptance'] ?? '') === '1';
if (!$personalConsent || !$privacyAcknowledgement || !$offerAcceptance) {
    http_response_code(400);
    exit('Required consent missing');
}

$orderNumber = trim((string)($_POST['order_number'] ?? ''));
$orderText   = trim((string)($_POST['order_text'] ?? ''));
$page        = trim((string)($_POST['page'] ?? ''));
$sentAt      = trim((string)($_POST['sent_at'] ?? ''));
$consentAt   = trim((string)($_POST['consent_at_client'] ?? ''));
$consentVer  = trim((string)($_POST['consent_version'] ?? ''));
$privacyVer  = trim((string)($_POST['privacy_version'] ?? ''));
$offerVer    = trim((string)($_POST['offer_version'] ?? ''));

$textLen = static function (string $value): int {
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
};
$cutText = static function (string $value, int $length): string {
    return function_exists('mb_substr') ? mb_substr($value, 0, $length, 'UTF-8') : substr($value, 0, $length);
};

$ip = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$rateFile = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'cw_mail_' . hash('sha256', $ip) . '.json';
$now = time();
$attempts = [];
if (is_file($rateFile)) {
    $decoded = json_decode((string)@file_get_contents($rateFile), true);
    if (is_array($decoded)) {
        $attempts = array_values(array_filter($decoded, static fn($t) => is_int($t) && $t > $now - 300));
    }
}
if (count($attempts) >= 8) { http_response_code(429); exit('Too Many Requests'); }
$attempts[] = $now;
@file_put_contents($rateFile, json_encode($attempts), LOCK_EX);

if ($orderText === '' || $textLen($orderText) < 10) {
    http_response_code(400);
    exit('Empty order');
}

$orderNumber = $cutText($orderNumber, 80);
$orderText   = $cutText($orderText, 12000);
$page        = $cutText($page, 500);
$sentAt      = $cutText($sentAt, 100);
$consentAt   = $cutText($consentAt, 100);
$consentVer  = $cutText($consentVer, 40);
$privacyVer  = $cutText($privacyVer, 40);
$offerVer    = $cutText($offerVer, 40);

$subject = 'Новый заказ ' . preg_replace('/[\r\n]+/', ' ', $orderNumber ?: 'с сайта');
$hostForMail = preg_replace('/[^a-zA-Z0-9.-]/', '', (string)($_SERVER['HTTP_HOST'] ?? '')) ?: 'localhost';
$from = 'no-reply@' . $hostForMail;

$body  = "Новый заказ с сайта «Чистая вода»\n\n";
$body .= $orderText . "\n\n";
$body .= "Факт согласий:\n";
$body .= "— согласие на обработку ПДн: ДА\n";
$body .= "— ознакомление с Политикой ПДн: ДА\n";
$body .= "— принятие публичной оферты: ДА\n";
$body .= "— версия согласия: " . ($consentVer ?: 'не указана') . "\n";
$body .= "— версия политики ПДн: " . ($privacyVer ?: 'не указана') . "\n";
$body .= "— версия оферты: " . ($offerVer ?: 'не указана') . "\n";
$body .= "— время согласия по часам клиента: " . ($consentAt ?: 'не указано') . "\n";
$body .= "— время получения сервером: " . date('c') . "\n";
$body .= "— IP: " . $ip . "\n";
$body .= "— User-Agent: " . $cutText((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 500) . "\n";
if ($sentAt !== '') $body .= "Время отправки заказа по данным клиента: {$sentAt}\n";
if ($page !== '') $body .= "Страница: {$page}\n";

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Чистая вода <' . $from . '>',
    'Reply-To: ' . $from,
];

$ok = @mail(
    $to,
    '=?UTF-8?B?' . base64_encode($subject) . '?=',
    $body,
    implode("\r\n", $headers),
    '-f' . $from
);

if (!$ok) {
    http_response_code(500);
    exit('Mail send failed');
}

http_response_code(204);
