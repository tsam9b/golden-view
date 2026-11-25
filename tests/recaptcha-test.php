<?php
require_once __DIR__ . '/../public/recaptcha.php';

$cases = array(
    array(array('success' => true, 'action' => 'contact', 'score' => 0.5), true),
    array(array('success' => true, 'action' => 'contact', 'score' => 1), true),
    array(array('success' => true, 'action' => 'contact', 'score' => 0.499), false),
    array(array('success' => true, 'action' => 'contact', 'score' => 1.01), false),
    array(array('success' => true, 'action' => 'other', 'score' => 0.9), false),
    array(array('success' => false, 'action' => 'contact', 'score' => 0.9), false),
    array(array('success' => true, 'action' => 'contact', 'score' => '0.9'), false),
    array(array('success' => true, 'action' => 'contact'), false),
    array(null, false),
);

foreach ($cases as $index => $case) {
    if (recaptcha_response_is_valid($case[0]) !== $case[1]) {
        fwrite(STDERR, "reCAPTCHA response test $index failed\n");
        exit(1);
    }
}

$pathCases = array(
    array('/home/account/public_html/stage.golden-view.gr', '/home/account/recaptcha-config.php'),
    array('/home/account/public_html', '/home/account/recaptcha-config.php'),
    array('/home/account/public_html/stage.golden-view.gr/', '/home/account/recaptcha-config.php'),
    array('/home/account/public_html/stage.golden-view.gr/nested', false),
    array('/home/account/other-site', false),
);
foreach ($pathCases as $index => $case) {
    if (recaptcha_config_path($case[0]) !== $case[1]) {
        fwrite(STDERR, "reCAPTCHA configuration path test $index failed\n");
        exit(1);
    }
}

class MockRecaptchaStream
{
    public $context;
    public static $response = '';
    public static $request = array();
    public static $fail = false;
    private $offset = 0;

    public function stream_open($path, $mode, $options, &$openedPath)
    {
        if (self::$fail || $path !== 'https://www.google.com/recaptcha/api/siteverify') {
            return false;
        }
        self::$request = stream_context_get_options($this->context);
        return true;
    }

    public function stream_read($count)
    {
        $chunk = substr(self::$response, $this->offset, $count);
        $this->offset += strlen($chunk);
        return $chunk;
    }

    public function stream_eof()
    {
        return $this->offset >= strlen(self::$response);
    }

    public function stream_stat()
    {
        return array();
    }
}

$originalSecret = getenv('RECAPTCHA_SECRET_KEY');
$configPath = tempnam(sys_get_temp_dir(), 'recaptcha-test-');
if ($configPath === false) {
    fwrite(STDERR, "Could not create temporary configuration file\n");
    exit(1);
}
file_put_contents($configPath, "<?php return 'file-secret';");
putenv('RECAPTCHA_SECRET_KEY');
if (recaptcha_secret($configPath) !== 'file-secret') {
    fwrite(STDERR, "Configuration file secret was not loaded\n");
    unlink($configPath);
    exit(1);
}
putenv('RECAPTCHA_SECRET_KEY=environment-secret');
if (recaptcha_secret($configPath) !== 'environment-secret') {
    fwrite(STDERR, "Environment secret did not take precedence\n");
    unlink($configPath);
    exit(1);
}
if (recaptcha_secret(false) !== 'environment-secret') {
    fwrite(STDERR, "Environment secret was not used for an unsupported layout\n");
    unlink($configPath);
    exit(1);
}
putenv('RECAPTCHA_SECRET_KEY');
file_put_contents($configPath, "<?php return array();");
if (recaptcha_secret($configPath) !== false) {
    fwrite(STDERR, "Invalid configuration file was accepted\n");
    unlink($configPath);
    if (recaptcha_secret(false) !== false) {
        fwrite(STDERR, "Unsupported configuration path was accepted\n");
        exit(1);
    }
    exit(1);
}
unlink($configPath);

stream_wrapper_unregister('https');
stream_wrapper_register('https', 'MockRecaptchaStream');
putenv('RECAPTCHA_SECRET_KEY=test-secret');
MockRecaptchaStream::$response = '{"success":true,"action":"contact","score":0.5}';
if (!recaptcha_verify('test-token')) {
    fwrite(STDERR, "Valid verification request was rejected\n");
    exit(1);
}
parse_str(MockRecaptchaStream::$request['http']['content'], $parameters);
if ($parameters !== array('secret' => 'test-secret', 'response' => 'test-token')
    || MockRecaptchaStream::$request['http']['method'] !== 'POST'
    || MockRecaptchaStream::$request['ssl']['verify_peer'] !== true) {
    fwrite(STDERR, "Verification request was not constructed correctly\n");
    exit(1);
}
MockRecaptchaStream::$response = '{"success":true,"action":"other","score":0.9}';
if (recaptcha_verify('test-token')) {
    fwrite(STDERR, "Wrong action was accepted\n");
    exit(1);
}
MockRecaptchaStream::$fail = true;
if (recaptcha_verify('test-token') || recaptcha_verify('') || recaptcha_verify(str_repeat('x', 4097))) {
    fwrite(STDERR, "Invalid verification request was accepted\n");
    exit(1);
}
putenv('RECAPTCHA_SECRET_KEY');
if (recaptcha_verify('test-token')) {
    fwrite(STDERR, "Missing secret was accepted\n");
    exit(1);
}
stream_wrapper_restore('https');
if ($originalSecret !== false) {
    putenv('RECAPTCHA_SECRET_KEY=' . $originalSecret);
}
echo "reCAPTCHA validation and request tests passed\n";
