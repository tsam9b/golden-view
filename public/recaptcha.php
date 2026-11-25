<?php
// Kept compatible with older PHP versions, like contact.php.

function recaptcha_response_is_valid($response)
{
    return is_array($response)
        && isset($response['success']) && $response['success'] === true
        && isset($response['action']) && $response['action'] === 'contact'
        && isset($response['score'])
        && (is_float($response['score']) || is_int($response['score']))
        && $response['score'] >= 0.5 && $response['score'] <= 1.0;
}

function recaptcha_config_path($script_dir)
{
    $script_dir = rtrim($script_dir, '/');
    if (basename($script_dir) === 'public_html') {
        return dirname($script_dir) . '/recaptcha-config.php';
    }
    if (basename(dirname($script_dir)) === 'public_html') {
        return dirname(dirname($script_dir)) . '/recaptcha-config.php';
    }
    return false;
}

function recaptcha_secret($config_path)
{
    $secret = getenv('RECAPTCHA_SECRET_KEY');
    if (is_string($secret) && trim($secret) !== '') {
        return $secret;
    }

    if ($config_path === false) {
        error_log('Contact reCAPTCHA config location is unsupported; set RECAPTCHA_SECRET_KEY in the PHP environment.');
        return false;
    }

    if (is_file($config_path)) {
        $secret = include $config_path;
        if (is_string($secret) && trim($secret) !== '') {
            return $secret;
        }
        error_log('Contact reCAPTCHA configuration file must return a non-empty secret key.');
        return false;
    }

    error_log('Contact reCAPTCHA secret key is not configured.');
    return false;
}

function recaptcha_verify($token)
{
    $secret = recaptcha_secret(recaptcha_config_path(__DIR__));
    if ($secret === false) {
        return false;
    }
    if ($token === '' || strlen($token) > 4096) {
        error_log('Contact reCAPTCHA token is missing or invalid.');
        return false;
    }

    $context = stream_context_create(array(
        'http' => array(
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => http_build_query(array('secret' => $secret, 'response' => $token)),
            'timeout' => 10,
        ),
        'ssl' => array('verify_peer' => true, 'verify_peer_name' => true),
    ));
    $result = @file_get_contents('https://www.google.com/recaptcha/api/siteverify', false, $context);
    if ($result === false) {
        error_log('Contact reCAPTCHA verification request failed.');
        return false;
    }
    if (!recaptcha_response_is_valid(json_decode($result, true))) {
        error_log('Contact reCAPTCHA verification rejected the submission.');
        return false;
    }
    return true;
}
