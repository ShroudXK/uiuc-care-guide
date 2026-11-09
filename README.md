# Illinois Care Guide

**A bilingual (English / 中文) healthcare navigation guide for UIUC international students making a first doctor’s visit in the U.S.**

[![Live site](https://img.shields.io/badge/Live_site-shroudxk.github.io-123e39?style=flat-square)](https://shroudxk.github.io/uiuc-care-guide/)
[![GitHub Pages](https://img.shields.io/badge/Hosted_on-GitHub_Pages-222?style=flat-square)](https://shroudxk.github.io/uiuc-care-guide/)

**Live site:** https://shroudxk.github.io/uiuc-care-guide/

<p align="center">
  <img src="docs/screenshot-en.png" alt="Illinois Care Guide — English desktop view" width="820">
</p>

<p align="center">
  <img src="docs/screenshot-mobile.png" alt="Illinois Care Guide — Chinese mobile view" width="280">
</p>

---

## 简介

面向 UIUC 留学生的中英双语就医导航站。把“该找谁、怎么约、费用和保险怎么分、电话怎么说、就诊前带什么”收成一条清晰路径，并链回官方页面。**本站不评估症状、不做诊断、不保证保险覆盖。紧急情况请拨打 911。**

---

## The problem

International students at UIUC often can *find* health information online, but still struggle to turn it into action:

- Unclear where to start for non-emergency care (campus clinic vs. insurance office vs. outside care)
- Unfamiliar terms (primary care, referral, copay, deductible, in-network)
- Uncertainty about what to say when calling to book
- Difficulty separating the **Campus Health Service Fee** from **Student Health Insurance**

Illinois Care Guide turns that confusion into a short, scannable route: understand campus care → check who pays → book and prepare — with English and Chinese side by side.

---

## What the guide covers

| Section | What you get |
| --- | --- |
| **Emergency & crisis** | 911, local ERs (Carle / OSF Heart of Mary), 988, Rosecrance Crisis Line, Dial-A-Nurse 24/7 — plus a clear note that this site does **not** assess symptoms |
| **Start where you are** | Four entry points: where to go · book an appointment · understand terms · pre-visit checklist |
| **Four-step journey** | Emergency check → know McKinley / Primary Care Provider → separate fee vs. insurance → book & prepare |
| **Fee vs. insurance** | How the Campus Health Service Fee differs from Student Health Insurance; McKinley does not accept health insurance or bill insurers directly (Billing Statement for possible reimbursement); referral notes; insurance office contacts |
| **Booking** | MyMcKinley portal link, phone booking number, sample call phrases, cancellation note from the official appointments page |
| **Terms + checklist** | Searchable bilingual glossary (plain explanations + illustrative examples + a useful question); browser-local pre-visit checklist |
| **Official sources** | Direct links to McKinley, Dial-A-Nurse, Referral Services, Student Health Insurance FAQ / contact / glossary, and emergency pages |

Each main block shows **Source · Reviewed 2026-11-08** with links to the matching official UIUC pages.

---

## Who it’s for

- UIUC international students arranging a **routine / non-emergency** first visit
- Anyone who prefers **English or Simplified Chinese** for the same steps and terms
- Friends or family helping a student navigate campus care and insurance contacts

---

## How to use

1. Open the [live site](https://shroudxk.github.io/uiuc-care-guide/).
2. Switch language with **EN / 中文** (choice is saved in the browser).
3. Start from an emergency check if needed, or pick one of the four entry cards.
4. Follow the journey in order, or jump to booking / terms / checklist.
5. When in doubt, use the **official source** links on each section.

---

## Tech stack & local run

Plain static site — no build step, no backend.

```
index.html   # shell + meta
styles.css   # layout & theme
app.js       # bilingual copy, routing UI, checklist, glossary
```

**Hosted on** [GitHub Pages](https://shroudxk.github.io/uiuc-care-guide/) from this repository’s `main` branch (site files at the repo root).

**Run locally**

```bash
# Option A — open the file
open index.html          # macOS
xdg-open index.html      # Linux

# Option B — local server (recommended)
python3 -m http.server 8080
# then visit http://localhost:8080
```

---

## Sources & accuracy

Content is based on official University of Illinois Urbana-Champaign pages (McKinley Health Center, Student Health Insurance, and related resources). Review date shown on the site: **2026-11-08**.

Useful starting points:

- [McKinley — New students](https://mckinley.illinois.edu/especially/new-students)
- [McKinley — Appointments](https://mckinley.illinois.edu/get-healthcare/appointments)
- [MyMcKinley portal](https://mymckinley.illinois.edu/)
- [Health Service Fee](https://mckinley.illinois.edu/fees/health-service-fee)
- [Student Health Insurance — FAQ basics](https://si.illinois.edu/faqs/faq-basics)
- [Student Health Insurance — Contact](https://si.illinois.edu/about)
- [Insurance glossary](https://si.illinois.edu/glossary)
- [Emergency information](https://mckinley.illinois.edu/emergency)
- [Dial-A-Nurse](https://mckinley.illinois.edu/get-healthcare/dial-nurse)
- [Referral Services](https://mckinley.illinois.edu/get-healthcare/referral-services)

Campus procedures, fees, and phone lines can change. Always confirm on the official page before you act. Dollar amounts in the glossary are **illustrative examples**, not your plan’s numbers.

---

## Disclaimer

This is an **independent student guide**. It is **not affiliated with** the University of Illinois Urbana-Champaign, McKinley Health Center, or Student Health Insurance.

- It does **not** assess symptoms, give diagnoses, or decide whether you should go to an ER, urgent care, or a scheduled visit.
- It does **not** guarantee insurance coverage, costs, or reimbursement outcomes.
- **In a life-threatening emergency, call 911.**

---

## Feedback

Found a broken link, outdated contact, or unclear step? Please [open an issue](https://github.com/ShroudXK/uiuc-care-guide/issues). Pull requests that point to current official UIUC sources are welcome.
