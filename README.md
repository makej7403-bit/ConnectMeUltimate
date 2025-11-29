# ConnectMe Ultimate — Next.js + Firebase (Vercel-ready)

This is a minimal Next.js 14 (App Router) starter with your ConnectMeUltimate component and your Firebase web config inserted.

## How to use

1. Unzip the project.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run dev:
   ```bash
   npm run dev
   ```
4. Deploy: push to GitHub and import the repo in Vercel.  
   Add the same Firebase variables to Vercel **Environment Variables** (optional, since keys are embedded).

## Notes
- You provided the Firebase config; it is embedded into `firebase/client.js`.
- For production, store secrets in Vercel environment variables and update `firebase/client.js` to read from `process.env`.
