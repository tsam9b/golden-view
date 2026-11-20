interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

const LOCALES = ["el", "de", "fr", "it", "ru", "sv", "no"];

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const form = await request.formData();
  const lang = String(form.get("lang") ?? "en");
  const base = LOCALES.includes(lang) ? `/${lang}/contact` : "/contact";
  const back = (status: string) =>
    Response.redirect(new URL(`${base}?status=${status}`, request.url).toString(), 303);

  // Honeypot: bots fill this hidden field
  if (form.get("website")) return back("sent");

  const name = String(form.get("name") ?? "").trim().slice(0, 200);
  const email = String(form.get("email") ?? "").trim().slice(0, 200);
  const message = String(form.get("message") ?? "").trim().slice(0, 5000);

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return back("error");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM ?? "The Cellar Project <contact@thecellarproject.gr>",
      to: [env.CONTACT_TO ?? "info@thecellarproject.gr"],
      reply_to: email,
      subject: `New website message from ${name.replace(/[\r\n]/g, " ")}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
    }),
  });

  return back(res.ok ? "sent" : "error");
};
