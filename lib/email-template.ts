const emailLogoUrl = "https://www.zondergezeur.nl/icon-192.png";

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function htmlToPlainText(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
}

export function paragraphsToHtml(value: string) {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p style="margin:0 0 18px;font-size:17px;line-height:1.6;color:#5e6b67;">${escapeHtml(paragraph).replaceAll("\n", "<br />")}</p>`)
    .join("");
}

export function emailShell(content: string) {
  return `
    <div style="margin:0;background:#fbfff8;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#16211f;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid rgba(22,33,31,0.13);border-radius:18px;overflow:hidden;">
        <div style="background:#16211f;padding:28px 30px;color:#fbfff8;">
          <img src="${emailLogoUrl}" width="74" height="74" alt="Zonder Gezeur" style="display:block;width:74px;height:74px;border-radius:50%;margin:0 0 16px;" />
          <div style="font-size:13px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#42d9c8;">Zonder Gezeur</div>
          <div style="margin-top:10px;font-size:30px;line-height:1.05;font-weight:900;">Websites bouwen zonder gedoe</div>
        </div>
        <div style="padding:30px;">
          ${content}
        </div>
        <div style="border-top:1px solid rgba(22,33,31,0.1);padding:18px 30px;color:#5e6b67;font-size:14px;">
          Rust. Structuur. Vakmanschap. Vertrouwen.
        </div>
      </div>
    </div>
  `;
}
