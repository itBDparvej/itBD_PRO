# itBD Ai Signal - Vercel Deployment Guide

এই প্রজেক্টটি Vercel-এ সফলভাবে ডেপ্লয় করার জন্য নিচের স্ট্রাকচারটি অনুসরণ করুন:

## সঠিক ফাইল স্ট্রাকচার (Root Directory):
- `index.html`
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `src/` (ফোল্ডার)
  - `App.tsx`
  - `main.tsx`
  - `index.css`

## Deployment Steps:
1. AI Studio থেকে **Download as ZIP** করুন।
2. ফাইলগুলো আনজিপ করুন।
3. আপনার GitHub রিপোজিটরিতে এই ফাইলগুলো আপলোড করুন (নিশ্চিত করুন `src` ফোল্ডারটি আছে)।
4. Vercel-এ গিয়ে প্রজেক্টটি ইমপোর্ট করুন।
5. **Framework Preset:** `Vite` সিলেক্ট করুন।
6. **Build Command:** `npm run build`
7. **Output Directory:** `dist`

প্রয়োজনে যোগাযোগ করুন: [Telegram @ITBD_Parvej](https://t.me/ITBD_Parvej)
