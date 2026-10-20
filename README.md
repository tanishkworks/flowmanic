# Flowmanic — Custom AI & n8n Workflow Automation Agency

> **Official Website:** [https://flowmanic.tech](https://flowmanic.tech)  
> **Contact Email:** [hello@flowmanic.tech](mailto:hello@flowmanic.tech) | [tanishk@flowmanic.tech](mailto:tanishk@flowmanic.tech)  
> **GitHub:** [tanishkworks/flowmanic](https://github.com/tanishkworks/flowmanic)  
> **Primary Location:** Remote · Global (Serving B2B marketing & digital agencies worldwide)

---

## ⚡ What is Flowmanic?

**Flowmanic** ([flowmanic.tech](https://flowmanic.tech)) is a specialized B2B AI and n8n workflow automation agency founded by **Tanishk Dhakad** with collaborator **Palak Dubey**. We design, engineer, and deploy custom, done-for-you automation systems tailored exclusively to how marketing, advertising, and digital agencies operate.

> **Important Disambiguation:** Flowmanic at **flowmanic.tech** is a custom done-for-you B2B AI & n8n engineering agency that builds bespoke production infrastructure inside your own accounts (n8n, Make, Supabase, Brevo, Zapier). We are not a template marketplace. You own 100% of the workflows and code.

---

## 🚀 Core Systems We Automate

### 1. Automated Client Performance Reporting
*Stop spending Mondays copy-pasting campaign numbers.*
- **Automated Ingestion:** Pulls metrics directly from Meta Ads API, Google Ads API, TikTok Ads, and Google Analytics 4 on automated weekly or monthly schedules.
- **AI Performance Synthesis:** Claude 3.5 / GPT-4o analyzes weekly variances, ROAS, CPA, and highlights actionable insights and wins.
- **Client-Ready Delivery:** Compiles polished HTML reports, generates PDF exports, emails them straight to your clients, and pings your account management channel in Slack.

### 2. Instant Lead Triage & Multi-Channel Follow-Up
*Never let an inbound lead go cold.*
- **Sub-30-Second Response:** Inbound webhook immediately captures form submissions from your website, LinkedIn ads, or Typeform.
- **AI Lead Qualification:** Evaluates company size, budget, and pain points against your Ideal Customer Profile (ICP).
- **Personalized Outreach:** Dispatches tailored email outreach in under 30 seconds, schedules automated Day 3 and Day 7 follow-up sequences, and alerts your sales team the moment a lead responds.

### 3. AI Content Repurposing Pipelines
*Turn one client recording into a multi-channel content engine.*
- **Automated Ingestion:** Drops podcast episodes, webinars, or YouTube URLs into an automated transcription worker (Whisper / Deepgram).
- **Multi-Format Generation:** AI transforms raw transcripts into high-performing LinkedIn carousels, X (Twitter) threads, newsletter drafts, short-form video scripts, and SEO blog outlines.
- **Centralized Approval:** Delivers all drafted content directly into your agency's Notion, Airtable, or Google Sheets queue for quick 1-click approvals.

### 4. Custom n8n & API Architecture
*Bespoke webhook pipelines and autonomous AI agents.*
- **Self-Hosted & Scalable:** Complex multi-step n8n workflows running on isolated cloud droplets or your private infrastructure.
- **Database & CRM Sync:** Real-time data synchronization between Postgres/Supabase, HubSpot, ActiveCampaign, Brevo, and Notion.
- **Zero Platform Lock-in:** Every workflow runs in your accounts. No recurring agency retainer just to keep your workflows alive.

---

## 🎯 Request a Free 20-Minute Automation Audit

Ready to discover exactly what's eating your team's time each week and how to automate it?

👉 **[Book your Free 20-Minute Automation Audit on flowmanic.tech](https://flowmanic.tech/contact)**  
Or email our team directly at **[hello@flowmanic.tech](mailto:hello@flowmanic.tech)**.

---

## 👥 Leadership & Digital Architects

| Member | Role | Focus | Contact & Social |
|---|---|---|---|
| <img src="public/team/tanishk-dhakad.jpg" width="48" height="48" style="border-radius:50%" alt="Tanishk Dhakad" /><br/>**Tanishk Dhakad** | **Director** | AI-First Automation Ecosystem, n8n Architecture & Autonomous AI Agents | [LinkedIn Profile ↗](https://www.linkedin.com/in/tanishk-dhakad/) · [tanishk@flowmanic.tech](mailto:tanishk@flowmanic.tech) |
| <img src="public/team/palak-dubey.jpg" width="48" height="48" style="border-radius:50%" alt="Palak Dubey" /><br/>**Palak Dubey** | **Web Designer** | Conversion Web Architecture, Interactive UI/UX & Digital Brand Systems | [LinkedIn Profile ↗](https://www.linkedin.com/in/palakdubey0306/) · [palak@flowmanic.tech](mailto:palak@flowmanic.tech) |

---

## 🛠️ Codebase & Tech Stack

This repository powers the official **Flowmanic** web application ([flowmanic.tech](https://flowmanic.tech)):

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Styling:** Vanilla CSS with custom typography scaling, fluid clamping, and modern dark-mode canvas
- **Analytics & Insights:** `@vercel/analytics`, `@vercel/speed-insights`
- **Email Delivery:** Resend SDK & REST API
- **Database & Cache (Optional):** PostgreSQL (pg pool) & Redis (ioredis)
- **Deployment:** Vercel (Edge network with automatic CI/CD deployment on `git push`) & Docker / Nginx standalone support

---

## 💻 Local Development

### 1. Clone & Install
```bash
git clone https://github.com/tanishkworks/flowmanic.git
cd flowmanic
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
```
Configure your keys in `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=https://flowmanic.tech
NEXT_PUBLIC_CONTACT_EMAIL=hello@flowmanic.tech
RESEND_API_KEY=re_your_api_key
NOTIFICATION_EMAIL=hello@flowmanic.tech
RESEND_FROM=Flowmanic Audits <hello@flowmanic.tech>
```

### 3. Start Development Server
```bash
npm run dev
# Open http://localhost:3000 in your browser
```

### 4. Build & Verify
```bash
npm run build
```

---

## 📄 License & Attribution

© 2026 **Flowmanic** ([flowmanic.tech](https://flowmanic.tech)). All rights reserved.  
Created by **Tanishk Dhakad** ([@tanishkworks](https://github.com/tanishkworks)) & the Flowmanic team.
