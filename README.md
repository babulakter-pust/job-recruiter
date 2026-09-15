# Job Application Tracker

A personal job-application tracker built with React + Vite. Track every
application from "Applied" through interview rounds to Offer / Rejected,
with a full status timeline per application.

## Features

- Add / edit / delete applications (company, position, applied date, link,
  location, salary, notes)
- Status pipeline: Applied → Online Assessment → Interview Scheduled →
  Round 1–5 → Offer / Rejected / On Hold / Withdrawn
- Full timeline history per application (every status change is logged with
  date + optional note)
- Track upcoming/next interview date per application, with day countdown
- Search, filter by status, sort (recently updated, applied date, upcoming
  interview, company name)
- Dashboard stats (total applied, in progress, interviewing, offers, rejected)
- Export all data to a JSON file, and import it back (backup / restore /
  move to another device)

## How data is stored

This is a **static, frontend-only** app (no backend/database), so it can be
hosted for free on GitHub Pages. Data is saved in your browser's
`localStorage`, which means:

- It persists across page reloads and browser restarts, on that one device.
- It does **not** sync between devices/browsers on its own.
- Clearing browser site data will erase it.

Use the **Export JSON** button regularly to back up your data
(`job-applications-YYYY-MM-DD.json`), and **Import JSON** to restore it or
move it to another browser/device. The exported file is plain JSON, so you
can also version it yourself (e.g. commit it into a private repo) if you
want history outside the browser.

## Getting started (local development)

```bash
npm install
npm run dev
```

This opens the app automatically in your browser at `http://localhost:5173`.

## Deploying to GitHub Pages (free hosting + CI/CD)

This repo already includes a GitHub Actions workflow
(`.github/workflows/deploy.yml`) that builds and deploys the app to GitHub
Pages automatically on every push to `main`.

### One-time setup

1. **Create a GitHub repository** (public or private, Pages works for both
   on GitHub Pro/Team/Enterprise; public repos get Pages free on any plan).

2. **Base path is already set** in `vite.config.js` to `job-tracker`,
   matching this project's repo name
   (`https://github.com/babulakter07/job-tracker`). If you ever rename the
   repo, update `REPO_NAME` in `vite.config.js` to match, or the deployed
   site will fail to load its JS/CSS.

3. **Push this project to GitHub:**

   ```bash
   git init
   git add .
   git commit -m "Initial commit: job application tracker"
   git branch -M main
   git remote add origin https://github.com/babulakter07/job-tracker.git
   git push -u origin main
   ```

4. **Enable GitHub Pages via Actions:** In your GitHub repo, go to
   **Settings → Pages → Build and deployment → Source**, and select
   **"GitHub Actions"**.

5. Push (or re-run the workflow from the **Actions** tab). Once it finishes,
   your app will be live at:

   ```
   https://babulakter07.github.io/job-tracker/
   ```

After this one-time setup, every future `git push` to `main` automatically
rebuilds and redeploys the site — that's the CI/CD pipeline.

## Project structure

```
src/
  App.jsx                  Main app state, filtering/sorting logic
  App.css / index.css      Styling
  lib/
    constants.js            Status list, colors, storage key
    storage.js               localStorage read/write + JSON export/import
  components/
    StatsBar.jsx             Dashboard stat cards
    Toolbar.jsx               Search / filter / sort / export / import / add
    ApplicationCard.jsx       One application card + timeline accordion
    AddEditModal.jsx          Add/edit application form
    UpdateStatusModal.jsx     Log a new status update (advances the pipeline)
    ConfirmDialog.jsx         Delete confirmation
.github/workflows/deploy.yml GitHub Actions CI/CD → GitHub Pages
```

## Available scripts

- `npm run dev` — start dev server (opens browser automatically)
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build locally
- `npm run lint` — lint with oxlint
