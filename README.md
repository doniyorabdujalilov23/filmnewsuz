# FilmNews.uz

Kino, serial, multfilm va anime olamiga ixtisoslashgan zamonaviy, tezkor va xavfsiz yangiliklar
platformasi. Next.js 15 (App Router), TypeScript, Tailwind CSS va Firebase (Authentication,
Firestore, Storage) asosida qurilgan, to'liq ishlaydigan production-ready loyiha.

## Texnologiyalar

- **Next.js 15** (App Router, Server Components, ISR)
- **TypeScript** (strict mode)
- **Tailwind CSS** — qizil (`#E11D2E`) + to'q ko'k navy (`#0B3D91`) rang palitrasi, shaffof
  (glass) panellar
- **Firebase Authentication** (Email/Password) — admin panel uchun
- **Cloud Firestore** — maqolalar, kategoriyalar, teglar, izohlar, foydalanuvchilar, sozlamalar
- **Firebase Storage** — rasm va video fayllar
- **TipTap** — rich text editor
- **Framer Motion** — animatsiyalar
- **Lucide React** — ikonkalar
- Vercel'ga deploy qilishga tayyor (Cron Jobs bilan)

## Asosiy imkoniyatlar

### Frontend
- **Bosh sahifa**: hero slider, 4 ta kattaroq rasmli "So'nggi yangiliklar" bloki, so'ngra
  mavzuli bo'limlar (**Videolar, Kinolar, Seriallar, Multfilmlar, Anime, Retsenziyalar**),
  har birida "Barchasini ko'rish" havolasi
- Kategoriyalar: **Kinolar, Seriallar, Multfilmlar, Anime, Treylerlar, Retsenziyalar,
  Aktyorlar, TOP ro'yxatlar**
- Har bir maqola sahifasida: to'liq matn, galereya (lightbox), video (YouTube **yoki**
  to'g'ridan-to'g'ri yuklangan video fayl), muallif, o'qilishlar soni, like, ulashish
  tugmalari, teglar, o'xshash yangiliklar, izohlar tizimi
- Qidiruv, breadcrumb, dark/light mode, loading skeleton, maxsus 404 va xatolik sahifalari
- **Reklama bloklari** (header, sidebar, maqola ichi, footer) — bosh sahifa, kategoriya, teg,
  qidiruv va maqola sahifalarining barchasida ko'rsatiladi, admin panelning Sozlamalar
  bo'limidan boshqariladi
- Shaffof (glass) sidebar kartalar, admin panel, login va mobil menyu
- To'liq SEO: dynamic metadata, OpenGraph, Twitter Cards, JSON-LD, sitemap.xml, robots.txt,
  RSS lenta (`/rss.xml`)
- PWA: web manifest + service worker (oflayn keshlash)

### Admin panel (`/admin`, kirish `/login` orqali)
- Faqat Firebase Authentication orqali ro'yxatdan o'tgan va **admin/muharrir/moderator** roli
  tayinlangan foydalanuvchilar kira oladi (Firebase custom claims orqali)
- **Dashboard**: statistikalar, bugungi maqolalar, eng mashhur maqolalar, oxirgi foydalanuvchilar
- **Yangiliklar**: qo'shish/tahrirlash/o'chirish, Draft/Publish/Schedule Publish, Featured
  belgilash, TipTap rich text editor
  - **Asosiy rasm va galereya**: ham drag & drop fayl yuklash, ham tashqi havola (URL) orqali
    qo'shish mumkin (rejim almashtirgich orqali)
  - **Video**: ham YouTube havolasi kiritish, ham video faylni to'g'ridan-to'g'ri yuklash
    mumkin (rejim almashtirgich orqali)
  - SEO Title/Description, avtomatik URL slug
- **Media manager**: barcha yuklangan fayllar, qidiruv, preview, o'chirish
- **Kategoriyalar** va **Teglar**: to'liq CRUD
- **Foydalanuvchilar**: Admin/Editor/Moderator rollarini boshqarish (Firebase custom claims)
- **Izohlar**: tasdiqlash, spam belgilash, o'chirish
- **Sozlamalar**: sayt nomi, logo, favicon, footer, ijtimoiy tarmoqlar, Google Analytics,
  **reklama kodlari** (header/sidebar/maqola ichi/footer — barcha sahifalarda qo'llaniladi)

## Loyiha tuzilishi

```
filmnews-uz/
├── src/
│   ├── app/
│   │   ├── (site)/              # Ommaviy sahifalar (Header/Footer bilan)
│   │   │   ├── page.tsx         # Bosh sahifa (4-katta karta + mavzuli bo'limlar)
│   │   │   ├── kategoriya/[slug]/
│   │   │   ├── yangilik/[slug]/
│   │   │   ├── teg/[slug]/
│   │   │   └── qidiruv/
│   │   ├── admin/               # Admin panel (AdminGuard bilan himoyalangan)
│   │   ├── login/
│   │   ├── api/
│   │   ├── sitemap.ts, robots.ts, manifest.ts
│   │   └── rss.xml/route.ts
│   ├── components/
│   │   ├── admin/                # ImageUploader, VideoUploader, GalleryUploader, TiptapEditor...
│   │   ├── news/                 # NewsCard, CategorySection, VideoSection, ArticleVideoPlayer...
│   │   └── layout/, ads/, ui/, skeletons/
│   ├── context/                  # Auth va Theme context'lari
│   ├── lib/
│   │   ├── firebase/              # Client va Admin SDK konfiguratsiyasi
│   │   ├── data/                  # Firestore/Storage data-access qatlami + mappers.ts
│   │   │                           (Timestamp -> ISO-string konvertatsiyasi shu yerda)
│   │   └── utils/
│   └── types/
├── scripts/
│   ├── create-admin.ts
│   └── seed-categories.ts
├── firestore.rules, storage.rules, firestore.indexes.json, firebase.json
├── vercel.json
└── .env.example
```

## Muhim texnik eslatma: Firestore Timestamp seriализация

Firestore'dan o'qilgan barcha sana maydonlari (`createdAt`, `publishedAt`, `updatedAt`,
`scheduledAt`) `src/lib/data/mappers.ts` faylidagi funksiyalar orqali **ISO-string**
ko'rinishiga aylantiriladi, so'ngra Component'larga uzatiladi. Bu Next.js'ning "Only plain
objects can be passed to Client Components from Server Components" xatoligining oldini oladi
— xom Firestore `Timestamp` obyekti hech qachon Server Component'dan Client Component'ga
to'g'ridan-to'g'ri prop sifatida uzatilmaydi. Yangi data-access funksiya yozganda, doim shu
mapperlardan (`mapArticleDoc`, `mapCategoryDoc`, `mapTagDoc`, `mapCommentDoc`, `mapUserDoc`,
`mapMediaDoc`) foydalaning.

## O'rnatish (lokal muhitda)

### 1. Paketlarni o'rnatish

```bash
git clone <repo-url> filmnews-uz
cd filmnews-uz
npm install
```

### 2. Firebase loyihasini yaratish

1. [Firebase Console](https://console.firebase.google.com) da yangi loyiha yarating.
2. **Authentication** > **Email/Password** provayderini yoqing.
3. **Firestore Database** yarating (production mode).
4. **Storage** yoqing.
5. Project Settings > General > **Web App** qo'shib konfiguratsiya qiymatlarini oling.
6. Project Settings > Service Accounts > **yangi maxfiy kalit yarating** (Admin SDK uchun).

### 3. Muhit o'zgaruvchilari

```bash
cp .env.example .env.local
```

`.env.local` faylini to'ldiring: `NEXT_PUBLIC_FIREBASE_*`, `FIREBASE_ADMIN_*`,
`ADMIN_BOOTSTRAP_EMAIL`/`PASSWORD`, `CRON_SECRET`, `REVALIDATE_SECRET_TOKEN`.

### 4. Firestore qoidalari va indekslarni joylashtirish

```bash
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy --only firestore:rules,firestore:indexes,storage
```

### 5. Standart ma'lumotlar

```bash
npm run seed          # 8 ta kino-mavzu kategoriyasi + sayt sozlamalarini yaratadi
npm run create-admin   # Birinchi admin hisobini yaratadi
```

### 6. Ishga tushirish

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) — sayt, [http://localhost:3000/login](http://localhost:3000/login) — admin panel.

## Foydali buyruqlar

```bash
npm run dev / build / start
npm run lint / lint:fix
npm run format / format:check
npm run type-check
npm run create-admin
npm run seed
```

## GitHub'ga yuklash

```bash
git init && git add . && git commit -m "FilmNews.uz: boshlang'ich commit"
git branch -M main
git remote add origin https://github.com/<username>/filmnews-uz.git
git push -u origin main
```

> `.env.local` va `serviceAccountKey.json` fayllari `.gitignore` orqali repozitoriyaga
> kirmaydi — maxfiy ma'lumotlarni hech qachon GitHub'ga yuklamang.

## Vercel'ga deploy qilish

1. [vercel.com](https://vercel.com) da GitHub repozitoriyangizni import qiling.
2. **Environment Variables** bo'limiga `.env.example` dagi barcha o'zgaruvchilarni qo'shing.
3. **Deploy** tugmasini bosing.
4. Deploy tugagach, **Cron Jobs** yoqilganini tekshiring (`vercel.json` — rejalashtirilgan
   maqolalarni avtomatik chop etish uchun har 5 daqiqada ishga tushadi).
5. Domenni ulang va `NEXT_PUBLIC_SITE_URL` ni yangilab qayta deploy qiling.

### Firebase Storage CORS (agar kerak bo'lsa)

```bash
gsutil cors set cors.json gs://<your-bucket-name>
```

```json
[
  {
    "origin": ["https://filmnews.uz", "http://localhost:3000"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type"]
  }
]
```

## Xavfsizlik arxitekturasi

- **Firebase Authentication** (Email/Password) — admin panelga kirish shu orqali.
- **Custom Claims** (`role: admin | editor | moderator`) 3 qatlamda tekshiriladi: Middleware
  (tezkor UX redirect) → AdminGuard (client-side rol tekshiruvi) → Firestore/Storage Security
  Rules (asosiy xavfsizlik qatlami).
- Admin SDK API route'lari (`/api/users/*`) faqat server tomonida, ID token tasdiqlangandan
  so'ng foydalanuvchi rollarini boshqaradi.
- Xavfsizlik header'lari (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`) `next.config.ts` orqali barcha sahifalarga qo'llaniladi.
- **Eslatma**: admin panelda rasm/video uchun tashqi havola kiritish imkoniyati borligi
  sababli, `next.config.ts` da `images.remotePatterns` istalgan HTTPS/HTTP domenidan rasm
  yuklashga ruxsat beradi. Bu faqat vakolatli (admin/editor) foydalanuvchilarga ochiq
  funksiya bo'lgani uchun xavfsiz.

## Litsenziya

Ushbu loyiha sizning buyurtmangiz asosida yaratildi va istalgan maqsadda erkin foydalanishingiz
mumkin.
