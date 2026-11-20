<?php
// Copy this file to contact-config.php (same folder as contact.php) and fill it in.
// contact-config.php is git-ignored; upload it to the server together with contact.php.
return array(
    // SMTP server of the mailbox. Use your server's mail host (cPanel/Plesk shows it as "Mail Server").
    'host' => 'mail.example.gr',
    // 465 = SSL, 587 = STARTTLS
    'port' => 465,
    'secure' => 'ssl', // 'ssl' or 'tls'
    // Full mailbox address and password of an email account that exists on this server.
    'username' => 'info@thecellarproject.gr',
    'password' => 'CHANGE_ME',
    // Sender shown in the email. Must be the mailbox above (or one it is allowed to send as).
    'from' => 'info@thecellarproject.gr',
    'from_name' => 'The Cellar Project',
    // Where the messages are delivered.
    'to' => 'info@thecellarproject.gr',
    // Set to false only if the server certificate does not match the host name.
    'verify_cert' => true,
);
