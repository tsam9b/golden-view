# Deployment

The site is static (Astro). `npm run build` produces the `dist/` folder.

## Stage 1 (current): your own server, pre-production

Everything, including the contact form, runs on your server. No DNS change is needed.

### Requirements
- Any web server (Apache/Nginx) with **PHP** enabled, plus PHP streams and OpenSSL for authenticated SMTP and reCAPTCHA verification. The server needs `allow_url_fopen`, trusted CA certificates, and outbound HTTPS access to Google. PHP `mail()` is only needed if SMTP is not configured.

### Steps
1. Set the real site URL in `astro.config.mjs` (`site: '...'`). It is currently a placeholder (`https://motionhotel.example`) and affects canonical URLs and the sitemap.
2. Configure reCAPTCHA v3 as described below, then build:
   ```sh
   npm install
   npm run build
   ```
3. Upload the **contents** of `dist/` to the server's web root (or a staging subdomain/folder), including `contact.php`.
4. Make sure the server serves `index.html` for directories (default on Apache/Nginx).
5. Test the form on `/contact/`: you should be redirected to `/contact/?status=sent` and receive the email at `info@golden-view.gr`.

### Contact form details
- The form posts to `/contact.php` (source: `public/contact.php`, copied to `dist/` on build).
- The recipient is set in `public/contact.php` (`mail('info@golden-view.gr', ...)`).
- Spam protection: a hidden honeypot input named `website` and Google reCAPTCHA v3. Both the contact form and booking request use the same PHP handler and require a valid reCAPTCHA token.
- The form must be served from the same server as `contact.php`. If the site is in a subfolder, change the form `action` in `src/pages/contact.astro` accordingly.

### Google reCAPTCHA v3 setup
1. Register a **reCAPTCHA v3** site in the [Google reCAPTCHA admin console](https://www.google.com/recaptcha/admin/create), add the production and any staging domains, and leave domain verification enabled. Google Maps API keys and reCAPTCHA v2 keys do not work.
2. Set `PUBLIC_RECAPTCHA_SITE_KEY` to the site key in the build environment (or in the git-ignored `.env` file), then rebuild. This key is public and is included in the generated HTML.
3. Configure the matching **secret key** on the hosting server using the cPanel steps below, or set `RECAPTCHA_SECRET_KEY` as an environment variable accessible to PHP. The environment variable takes precedence over the configuration file. A variable in Astro's `.env` file is not automatically available to PHP. Never put the secret in `PUBLIC_` variables, the website's public folder, or version control.
4. Deploy the build, including both `contact.php` and `recaptcha.php`, and test both forms on a registered domain. The server verifies the token's success, `contact` action and score of at least **0.5**. Adjust that threshold in `public/recaptcha.php` only after observing legitimate traffic in the Google console.

reCAPTCHA v3 runs in the background rather than displaying a checkbox. Both forms fail closed if either key is missing, JavaScript is unavailable, Google cannot be reached, or verification fails; the visitor is shown an error and may contact the hotel by email. See the PHP error log for messages beginning `Contact reCAPTCHA`. The widget loads on submission and sends information to Google. Review the privacy/cookie templates and any applicable consent requirements before deployment.

#### Adding the secret in cPanel
1. In cPanel, open **File Manager** and locate `public_html`. For the staging site, the deployed `recaptcha.php` is in `/home/ACCOUNT/public_html/stage.golden-view.gr/`.
2. Go to the account home folder, `/home/ACCOUNT/`, one level above `public_html`. Confirm that this folder is not publicly served by this or another website.
3. Create `/home/ACCOUNT/recaptcha-config.php` there, **not inside `public_html`**. The PHP code supports `recaptcha.php` directly in `public_html` or in a folder directly inside it; both use this same config file. For other directory layouts, configure `RECAPTCHA_SECRET_KEY` in the PHP environment instead.
4. Edit the new file and enter the following, replacing the placeholder with your actual reCAPTCHA v3 **secret** key:

   ```php
   <?php
   return 'YOUR_RECAPTCHA_V3_SECRET_KEY';
   ```

   The example is also in `recaptcha-config.sample.php` in the project root. Do not copy the secret file into `public_html`, `dist`, a downloadable archive, or version control.
5. Save the file and ensure only your hosting account can read it (typically file permission `600`; ask your host if PHP cannot read it or `open_basedir` blocks access). Deploy the updated build and test both forms. The file stays on the server when you rebuild locally.

### Email setup (authenticated SMTP)
`contact.php` sends through an authenticated SMTP mailbox when `contact-config.php` exists next to it. Without that file it falls back to PHP `mail()`, which is often blocked or flagged on servers hosting many domains.

1. Create (or pick) a mailbox on the server, for example `info@golden-view.gr`.
2. Copy `public/contact-config.sample.php` to `public/contact-config.php` and fill in the SMTP host, port (465 SSL or 587 TLS), username, password, `from` and `to`. This file is git-ignored; it is copied to `dist/` on build, so rebuild after creating it, or upload it manually next to `contact.php`.
3. If the SMTP host name does not match its certificate (common before DNS is moved), use the server's own host name or set `'verify_cert' => false`.
4. On failure the form redirects to `?status=error` and the reason is written to the PHP error log.

Never commit `contact-config.php`.

#### About `contact-config.php`
- It holds the mailbox password, so it is git-ignored and exists only on your machine and the server. `public/contact-config.sample.php` is the committed template.
- Create it once: `cp public/contact-config.sample.php public/contact-config.php`, then fill in `host`, `port`, `secure`, `username`, `password`, `from`, `from_name`, `to`.
- `npm run build` copies it into `dist/`, so it is uploaded with everything else. Re-edit and rebuild (or edit the file on the server) whenever the mailbox changes.
- Never leave a zip of `dist/` on the server: it would be downloadable and contain the password. Delete `dist.zip` after extracting.
- If the form shows the error toast, check the PHP `error_log` next to `contact.php` for lines starting with "Contact SMTP".

### File permissions
Shared cPanel hosts (suPHP/suEXEC) answer **500** for PHP files that are group-writable (664) or folders that are 775. Required: **folders 755, files 644**.

- `npm run build` now sets these automatically on `dist/` (`scripts/fix-permissions.mjs`).
- To upload a single file, run `npm run package`: it builds and creates `dist.zip` with correct permissions. Upload it to the web root, use File Manager's *Extract*, then delete `dist.zip`.
- FTP clients may override permissions on upload; if you get a 500 on `contact.php`, set them in the client's settings (default file 644, folder 755), or run on the server:
  ```sh
  find . -type d -exec chmod 755 {} + && find . -type f -exec chmod 644 {} +
  ```
- A 500 on every missing URL (including `/nope.html`) on staging is a host ErrorDocument quirk, not a sign the files are missing.

## Stage 2 (production, later): Cloudflare Pages + Resend

Prepared but **inactive**, stored in `deploy/cloudflare/`. Use it when you move the domain DNS to Cloudflare.

The inactive Cloudflare handler does not implement reCAPTCHA verification. Add server-side verification there and update both form actions before using it; changing an action alone would bypass this protection.

1. Move the function so Cloudflare Pages detects it:
   ```sh
   cp -r deploy/cloudflare/functions ./functions
   ```
2. In `src/pages/contact.astro` change the form to `action="/api/contact"`.
3. Create a Resend account (free: 3,000 emails/month), add the domain `golden-view.gr` and add the DNS records it gives you.
4. Create a Cloudflare Pages project connected to the repo: build command `npm run build`, output directory `dist`.
5. In Pages, Settings, Variables and Secrets, add:
   - `RESEND_API_KEY` (secret, required)
   - `CONTACT_TO` (optional, default `info@golden-view.gr`)
   - `CONTACT_FROM` (optional, default `Golden Views Studios <contact@golden-view.gr>`)
6. Optionally delete `public/contact.php` (it is not executed on Cloudflare).
7. Local test: `npx wrangler pages dev dist` with the key in a `.dev.vars` file (do not commit it).

The function redirects to `/contact?status=sent|error` (locale-prefixed for non-English pages), which the contact page already handles.
