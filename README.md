# "Ichki uyg'onish" sotuvchi sayti: o'rnatish yo'riqnomasi

## Fayllar
```
index.html               ← asosiy sotuv sahifasi
google-apps-script.gs    ← arizalarni Google Sheets ga yozuvchi skript
img/iman.webp            ← Iman opaning fonsiz surati (sahifa ichiga ham joylangan, alohida fayl zaxira uchun)
img/natija-1.jpg … natija-12.jpg ← o'quvchi fikrlari skrinshotlari (eski saytdagilar)
```
Rasm qo'yilmasa ham sayt buzilmaydi: rasm bloki va "Natijalar" bo'limi o'zi yashirinadi.
Rasmlarni **.jpg, 100–150 KB dan katta bo'lmagan** holda qo'ying (squoosh.app orqali siqing): bu sahifa tez ochilishi uchun eng muhim narsa.

## 1. Sozlamalar
`index.html` ning yuqorisidagi `CONFIG` blokini to'ldiring:

| Maydon | Nima yoziladi |
|---|---|
| `PIXEL_ID` | Meta Pixel ID. Hozir eski saytdagi `647005224750459` turibdi, shu pixelni ishlatsangiz, u yig'gan auditoriya saqlanib qoladi |
| `LEAD_WEBHOOK` | 3-bo'limda olinadigan Google Apps Script URL. **Bo'sh qolsa, arizalar hech qayerga saqlanmaydi!** |
| `START_DATE`, `START_LABEL` | Kurs boshlanish sanasi |
| `ADMINS` | VIP va Premium menejerlari (@iimaan_admin2 / @iimaan_admin3 qo'yilgan) |
| `COURSE_NAME` | Menejerga yuboriladigan xabardagi kurs nomi |



## 2. Saytni joylash (Vercel, bepul)
1. vercel.com → Add New → Project → papkani yuklang (yoki GitHub orqali).
2. Domains → `imanakhmedovna.uz` yoki subdomen ulang, masalan `kurs.imanakhmedovna.uz`.
3. Meta Business → Brand Safety → Domains: domen tasdiqlangan bo'lishi kerak. Eski `facebook-domain-verification` kodini `index.html` dagi izohga qo'ying.

## 3. Arizalarni Google Sheets ga yig'ish
1. Yangi Google Sheet oching → Kengaytmalar → Apps Script.
2. `google-apps-script.gs` matnini to'liq qo'ying va saqlang.
3. Joylashtirish → Yangi joylashtirish → turi **Veb-ilova**; "Kim kira oladi": **Hamma**.
4. Berilgan `https://script.google.com/macros/s/.../exec` URL ni `CONFIG.LEAD_WEBHOOK` ga qo'ying.
5. Ixtiyoriy: skriptdagi `TG_BOT_TOKEN` va `TG_CHAT_ID` ni to'ldirsangiz, har bir ariza Telegram guruhga ham tushadi.

## 4. Pixel eventlari

| Qadam | Harakat | Event |
|---|---|---|
| 1 | Sayt ochildi | `PageView` |
| 2 | Tariflar bo'limi ko'rindi | `ViewContent` |
| 3 | "Yozilish" bosildi (forma ochildi) | `InitiateCheckout` |
| 4 | Ism + raqam to'g'ri yozilib, **"Telegram'da menejerga yozish"** bosildi | **`Lead`** + `Lead_VIP` / `Lead_Premium` + `Contact` |

- Formadagi tugma oddiy Telegram havolasi: bosilganda tanlangan tarif menejeri (VIP → @iimaan_admin2, Premium → @iimaan_admin3) tayyor xabar bilan darhol ochiladi.
- `Lead` aynan menejerga o'tish paytida, telefon va ism Meta'ga shifrlangan holda (Advanced Matching) yuboriladi.

**Targetda qanday sozlash kerak (xaridorlarni topish uchun):**
1. Boshlanishida kampaniya maqsadini Leads (Website) qilib, eventni **Lead** ga qo'ying.
2. Events Manager → Custom conversions → `Lead_VIP` va `Contact_VIP` dan custom conversion yarating.
3. Haftasiga ~50 ta `Contact_VIP` yig'ilgach, optimizatsiyani **Contact_VIP** ga o'tkazing. Menejerga o'zi yozgan odam xaridorga eng yaqin signal hisoblanadi.
4. Keyingi qadam: to'lov qilganlar ro'yxatini (telefon raqamlarini) Meta'ga "Purchase" sifatida yuklab borsangiz, algoritm haqiqiy xaridorlarni o'rganadi.

Tekshirish: Events Manager → Test events → sayt manzilini kiriting, formani to'ldirib, menejer tugmasini bosing.
Claude preview va localhost'da pixel o'chiq turadi, faqat haqiqiy domenda ishlaydi.

UTM bilan reklama havolasi:
`https://kurs.imanakhmedovna.uz/?utm_source=instagram&utm_campaign={{campaign.name}}&utm_content={{ad.name}}`

## 5. "Visit rate"ni 90%+ ushlab turish uchun
Landing page view rate = reklamani bosganlar ichidan sahifa to'liq ochilganlar ulushi. Unga asosan **yuklanish tezligi** ta'sir qiladi:
- Sahifa hech qanday framework ishlatmaydi, shrift yuklamaydi, video faqat bosilganda yuklanadi. Sahifa rasm bilan birga ~95 KB.
- Eng katta xavf — og'ir rasmlar. `iman.jpg` 150 KB dan oshmasin.
- Vercel (CDN) da joylang, oddiy shared hostingda emas.
- Tekshirish: pagespeed.web.dev → Mobile natija 90+ bo'lishi kerak.
