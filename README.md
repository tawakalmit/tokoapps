# AppStore - Toko Aplikasi dengan Device Binding

Toko aplikasi online yang menjual APK dengan sistem device binding. Setiap pembelian terikat ke device ID tertentu sehingga APK tidak bisa dishare ke perangkat lain.

## Tech Stack

- **Frontend**: SvelteKit + Tailwind CSS v4
- **Backend**: SvelteKit Server (API routes)
- **Database & Auth**: Supabase
- **Styling**: Google-style UI/UX

## Setup

### 1. Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka SQL Editor, jalankan isi file `supabase/schema.sql`
3. Buat user admin di Authentication > Users > Add User (email + password)
4. Copy URL dan anon key dari Settings > API

### 2. Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:
```
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Install & Run

```bash
npm install
npm run dev
```

## Fitur

- ✅ Homepage dengan list produk (dinamis dari CMS)
- ✅ Halaman detail produk dengan SEO meta tags
- ✅ Sistem pembelian dengan device binding
- ✅ API endpoint untuk verifikasi binding dari aplikasi
- ✅ Dashboard admin (auth protected)
- ✅ CMS: kelola produk, pesanan, bindings, navigasi
- ✅ Navbar & footer dinamis (dikelola dari admin)
- ✅ SEO friendly (meta tags, OG tags, semantic HTML)

## API Endpoints (untuk Aplikasi)

### POST `/api/verify-binding`

Verifikasi apakah device authorized untuk menjalankan app.

```json
{
  "product_id": "uuid-produk",
  "device_id": "unique-device-id",
  "binding_key": "key-yang-didapat-saat-beli"
}
```

Response sukses:
```json
{ "valid": true, "message": "Device authorized" }
```

Response gagal:
```json
{ "valid": false, "message": "Invalid binding key or device not authorized" }
```

### POST `/api/request-binding`

Request binding key (jika user sudah beli tapi belum punya key di device).

```json
{
  "product_id": "uuid-produk",
  "device_id": "unique-device-id",
  "email": "email-saat-beli@contoh.com"
}
```

---

## Alur Device Binding

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Customer   │────▶│  Web Store   │────▶│  Supabase   │
│  (Browser)  │     │  (SvelteKit) │     │  (Database) │
└─────────────┘     └──────────────┘     └─────────────┘
       │                                        │
       │ 1. Beli produk + input device_id       │
       │ 2. Order created                       │
       │ 3. Binding key generated               │
       │ 4. Customer dapat binding key          │
       │                                        │
┌─────────────┐                                 │
│  App (APK)  │─────────────────────────────────┘
│  di Device  │  5. App request verify-binding
└─────────────┘  6. Server cek: product_id + device_id + key
                 7. Return valid/invalid
```

1. Customer beli app di web store, input email + device ID
2. Server generate binding key (hash dari product_id + device_id + timestamp)
3. Customer masukkan binding key di app
4. App call `/api/verify-binding` setiap kali launch
5. Jika valid → app jalan. Jika invalid → app block.

---

## Prompt untuk Developer Aplikasi (Device Binding Integration)

Berikan prompt ini ke AI agent untuk mengintegrasikan device binding ke aplikasi Android/iOS/Desktop:

```
Saya ingin mengintegrasikan sistem device binding ke aplikasi saya. Berikut spesifikasinya:

1. DEVICE ID:
   - Generate unique device ID yang persistent (tidak berubah setelah reinstall)
   - Android: gunakan Settings.Secure.ANDROID_ID atau kombinasi Build.SERIAL + Build.FINGERPRINT
   - iOS: gunakan identifierForVendor
   - Desktop: gunakan kombinasi MAC address + motherboard serial

2. BINDING KEY STORAGE:
   - Simpan binding key di SharedPreferences (Android) / UserDefaults (iOS) / Registry (Windows)
   - Encrypt binding key sebelum disimpan menggunakan device-specific key

3. VERIFICATION FLOW:
   - Saat app pertama kali dibuka, tampilkan form input binding key
   - Setelah user input binding key, panggil API:
     POST https://[YOUR_DOMAIN]/api/verify-binding
     Body: { "product_id": "[PRODUCT_UUID]", "device_id": "[DEVICE_ID]", "binding_key": "[USER_INPUT]" }
   - Jika response { "valid": true } → simpan key dan lanjut ke app
   - Jika response { "valid": false } → tampilkan error, minta user beli ulang

4. ONGOING VERIFICATION:
   - Setiap kali app dibuka, verifikasi ulang binding key ke server
   - Jika offline, gunakan cached verification (valid selama 7 hari)
   - Jika expired atau invalid, block akses ke app

5. ANTI-TAMPERING:
   - Obfuscate kode verifikasi
   - Jangan hardcode URL server, simpan encrypted
   - Tambahkan checksum verification untuk detect modifikasi APK
   - Implementasi certificate pinning untuk API calls

6. UI YANG DIBUTUHKAN:
   - Splash screen dengan loading verification
   - Form input binding key (untuk pertama kali)
   - Error screen jika binding invalid
   - Settings screen yang menampilkan Device ID (agar user bisa copy untuk pembelian)

Product ID untuk app ini: [ISI_PRODUCT_UUID_DARI_DATABASE]
Server URL: [ISI_URL_DEPLOYMENT_ANDA]
```

---

## Deployment

Untuk production, ganti `@sveltejs/adapter-auto` dengan adapter yang sesuai:

- **Vercel**: `@sveltejs/adapter-vercel`
- **Netlify**: `@sveltejs/adapter-netlify`
- **Node.js**: `@sveltejs/adapter-node`

```bash
npm install -D @sveltejs/adapter-vercel
```

Update `svelte.config.js` sesuai adapter yang dipilih.
