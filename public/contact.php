<?php
// Written to run on old PHP versions too (no scalar types, no ??).

$locales = array('el', 'de', 'fr', 'it', 'ru', 'sv', 'no');
$lang = isset($_POST['lang']) ? $_POST['lang'] : '';
$prefix = (is_string($lang) && in_array($lang, $locales, true)) ? '/' . $lang : '';

function redirect_to_contact($status)
{
    global $prefix;
    header('Location: ' . $prefix . '/contact/?status=' . $status, true, 303);
    exit;
}

function field($key)
{
    return (isset($_POST[$key]) && is_string($_POST[$key])) ? trim($_POST[$key]) : '';
}

require_once __DIR__ . '/recaptcha.php';

if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit('Method not allowed');
}

// Honeypot: bots fill this hidden field; pretend success and drop the message
if (field('website') !== '') {
    redirect_to_contact('sent');
}

$name = field('name');
$email = field('email');
$message = field('message');

if (
    $name === '' ||
    strlen($name) > 200 ||
    strlen($email) > 254 ||
    filter_var($email, FILTER_VALIDATE_EMAIL) === false ||
    $message === '' ||
    strlen($message) > 10000
) {
    redirect_to_contact('error');
}

if (!recaptcha_verify(field('g-recaptcha-response'))) {
    redirect_to_contact('error');
}

// Strip line breaks to prevent header injection
$safe_email = str_replace(array("\r", "\n"), '', $email);
$safe_name = str_replace(array("\r", "\n"), ' ', $name);

$body = "Name: {$name}\nEmail: {$email}\n\n{$message}";
$subject = 'Website contact form message';

$config = is_file(__DIR__ . '/contact-config.php') ? include __DIR__ . '/contact-config.php' : null;

function smtp_read($fp)
{
    $data = '';
    while (($line = fgets($fp, 515)) !== false) {
        $data .= $line;
        if (strlen($line) < 4 || $line[3] === ' ') {
            break;
        }
    }
    return $data;
}

function smtp_cmd($fp, $cmd, $ok)
{
    if ($cmd !== null) {
        fwrite($fp, $cmd . "\r\n");
    }
    $res = smtp_read($fp);
    return in_array((int) substr($res, 0, 3), (array) $ok, true);
}

function smtp_send($c, $replyTo, $subject, $body)
{
    $ssl = $c['secure'] === 'ssl';
    $ctx = stream_context_create(array('ssl' => array(
        'verify_peer' => !empty($c['verify_cert']),
        'verify_peer_name' => !empty($c['verify_cert']),
    )));
    $fp = @stream_socket_client(
        ($ssl ? 'ssl://' : 'tcp://') . $c['host'] . ':' . $c['port'],
        $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $ctx
    );
    if (!$fp) {
        error_log("Contact SMTP connect failed: $errstr");
        return false;
    }
    stream_set_timeout($fp, 15);
    $host = isset($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'localhost';

    $ok = smtp_cmd($fp, null, 220) && smtp_cmd($fp, 'EHLO ' . $host, 250);
    if ($ok && !$ssl) {
        $ok = smtp_cmd($fp, 'STARTTLS', 220)
            && stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)
            && smtp_cmd($fp, 'EHLO ' . $host, 250);
    }
    $ok = $ok
        && smtp_cmd($fp, 'AUTH LOGIN', 334)
        && smtp_cmd($fp, base64_encode($c['username']), 334)
        && smtp_cmd($fp, base64_encode($c['password']), 235)
        && smtp_cmd($fp, 'MAIL FROM:<' . $c['from'] . '>', 250)
        && smtp_cmd($fp, 'RCPT TO:<' . $c['to'] . '>', array(250, 251))
        && smtp_cmd($fp, 'DATA', 354);

    if ($ok) {
        $msg = implode("\r\n", array(
            'From: =?UTF-8?B?' . base64_encode($c['from_name']) . '?= <' . $c['from'] . '>',
            'To: <' . $c['to'] . '>',
            'Reply-To: ' . $replyTo,
            'Subject: =?UTF-8?B?' . base64_encode($subject) . '?=',
            'Date: ' . date('r'),
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
            '',
            chunk_split(base64_encode($body), 76, "\r\n"),
        ));
        fwrite($fp, $msg . "\r\n.\r\n");
        $ok = in_array((int) substr(smtp_read($fp), 0, 3), array(250), true);
    }
    @fwrite($fp, "QUIT\r\n");
    fclose($fp);
    if (!$ok) {
        error_log('Contact SMTP send failed (check host, port, username and password).');
    }
    return $ok;
}

if (is_array($config)) {
    $sent = smtp_send($config, $safe_email, $subject, $body);
} else {
    // Fallback when no SMTP config is present
    $headers = implode("\r\n", array(
        'From: Golden Views Studios <no-reply@golden-view.gr>',
        'Reply-To: ' . $safe_email,
        'Content-Type: text/plain; charset=UTF-8',
    ));
    $sent = @mail('info@golden-view.gr', $subject, $body, $headers);
}

if (!$sent) {
    redirect_to_contact('error');
}

redirect_to_contact('sent');
