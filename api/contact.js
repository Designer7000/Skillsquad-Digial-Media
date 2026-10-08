/* ============================================================
   SKILLSQUAD — CONTACT FORM API
   Vercel serverless function. Receives inquiry JSON from the
   static site's form and delivers it via Resend.

   Requires env var: RESEND_API_KEY
   (Vercel Dashboard → Project → Settings → Environment Variables)

   NOTE: Resend's onboarding@resend.dev sender can only deliver
   to the Resend account owner's email until a domain is verified
   at resend.com/domains. After verifying a domain, change FROM
   and TO below to the business address.
   ============================================================ */

const FROM = "onboarding@resend.dev";
const TO = "tayyab.insta@gmail.com"; // Resend account owner (verified sender target)

function esc(s) {
  return String(s == null ? "" : s).replace(/[<>&"]/g, function (c) {
    return { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c];
  });
}

export default async function handler(req, res) {
  // CORS for the static frontend
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const details = String(body.details || "").trim();

  if (!name || !email || !details) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const apiKey = process.env.RESEND_API_KEY || process.env.Resend_Key;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY not set");
    return res.status(500).json({ error: "Email service not configured" });
  }

  const company = String(body.company || "").trim();
  const phone = String(body.phone || "").trim();
  const service = String(body.service || "").trim();
  const budget = String(body.budget || "").trim();

  const subject = `New inquiry from ${name} — Skillsquad website`;
  const text =
    `Name: ${name}\n` +
    `Email: ${email}\n` +
    `Phone: ${phone || "—"}\n` +
    `Company: ${company || "—"}\n` +
    `Service: ${service || "—"}\n` +
    `Budget: ${budget || "—"}\n\n` +
    `Details:\n${details}`;

  const html =
    `<h2>New inquiry — Skillsquad website</h2>` +
    `<table cellpadding="6" cellspacing="0" border="0">` +
    `<tr><td><strong>Name</strong></td><td>${esc(name)}</td></tr>` +
    `<tr><td><strong>Email</strong></td><td>${esc(email)}</td></tr>` +
    `<tr><td><strong>Phone</strong></td><td>${esc(phone) || "—"}</td></tr>` +
    `<tr><td><strong>Company</strong></td><td>${esc(company) || "—"}</td></tr>` +
    `<tr><td><strong>Service</strong></td><td>${esc(service) || "—"}</td></tr>` +
    `<tr><td><strong>Budget</strong></td><td>${esc(budget) || "—"}</td></tr>` +
    `</table><p><strong>Details:</strong></p><p>${esc(details).replace(/\n/g, "<br>")}</p>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: TO,
        reply_to: email,
        subject,
        text,
        html,
      }),
    });

    if (!r.ok) {
      const errText = await r.text().catch(() => "");
      console.error("[contact] Resend error:", r.status, errText);
      return res.status(502).json({ error: "Failed to deliver inquiry" });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("[contact] exception:", e);
    return res.status(500).json({ error: "Internal error" });
  }
}
