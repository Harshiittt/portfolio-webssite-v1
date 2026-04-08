# Harshit's Portfolio

Dark-mode techy personal portfolio built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Project Structure

```
portfolio/
├── app/
│   ├── globals.css       # Global styles + dark theme base
│   ├── layout.tsx        # Root layout + metadata
│   └── page.tsx          # Main page (composes all sections)
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Projects.tsx
│   ├── Skills.tsx
│   ├── Contact.tsx
│   ├── Footer.tsx
│   └── SectionTitle.tsx
└── public/
    └── resume.pdf        # Add your resume here
```

## Customization

- **Personal info**: Update `components/Hero.tsx`, `components/About.tsx`
- **Projects**: Edit the `projects` array in `components/Projects.tsx`
- **Skills**: Edit the `skillGroups` array in `components/Skills.tsx`
- **Contact links**: Update hrefs in `components/Contact.tsx`
- **Metadata**: Update title/description in `app/layout.tsx`
- **Resume**: Drop your `resume.pdf` into the `/public` folder

## Deployment on Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project → select your repo
3. Click **Deploy** — Vercel auto-detects Next.js, no config needed
4. Add your custom domain: Vercel Dashboard → Your Project → Settings → Domains

### Connecting a Custom Domain

After adding your domain in Vercel:
- For **Namecheap/GoDaddy**: Add the CNAME and A records Vercel provides
- For **Cloudflare Registrar** (recommended, free): Add Vercel's nameservers or DNS records
- DNS propagation takes 5–30 minutes typically

## Build

```bash
npm run build   # production build
npm run start   # run production build locally
```
