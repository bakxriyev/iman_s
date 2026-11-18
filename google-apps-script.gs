/**
 * Arizalarni Google Sheets ga yozadi (+ ixtiyoriy Telegram botga yuboradi).
 * O'rnatish: README.md, 3-bo'lim.
 */

// Ixtiyoriy: Telegram bot orqali har bir arizani guruhga yuborish
const TG_BOT_TOKEN = "";   // @BotFather bergan token
const TG_CHAT_ID   = "";   // guruh yoki kanal ID (masalan -1001234567890)

const COLS = ["vaqt","name","phone","tarif","narx","variant","utm_source","utm_medium","utm_campaign","utm_content","utm_term","fbclid","sahifa","event_id"];

function doPost(e) {
  const p = e.parameter || {};
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(COLS);
  sheet.appendRow(COLS.map(k => p[k] || ""));

  if (TG_BOT_TOKEN && TG_CHAT_ID) {
    const text =
      "🆕 Yangi ariza\n" +
      "Ism: " + (p.name || "") + "\n" +
      "Tel: " + (p.phone || "") + "\n" +
      "Tarif: " + (p.tarif || "").toUpperCase() + " (" + (p.narx || "") + " so'm)\n" +
      "Manba: " + (p.utm_source || "-") + " / " + (p.utm_campaign || "-");
    UrlFetchApp.fetch("https://api.telegram.org/bot" + TG_BOT_TOKEN + "/sendMessage", {
      method: "post",
      payload: { chat_id: TG_CHAT_ID, text: text },
      muteHttpExceptions: true
    });
  }
  return ContentService.createTextOutput("ok");
}
