# The Journey of Fernando Banal

Interactive story-driven portfolio for Fernando Jr. H. Banal. The site is a lightweight static HTML/CSS/JavaScript project with a local Node server for previewing video and PDF assets.

## Local Development

```bash
npm run dev
```

Open `http://localhost:4173`.

## Quality Check

```bash
npm run check
```

This validates the JavaScript files with Node's syntax checker.

## Project Structure

```text
.
├── assets/
│   ├── Banal_CV.pdf
│   └── rfid-robot-demo.mp4
├── index.html
├── script.js
├── styles.css
├── server.js
├── package.json
├── vercel.json
└── README.md
```

## GitHub Workflow

Use `main` as the production branch.

```bash
git status
git add .
git commit -m "Initial interactive portfolio"
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Recommended branch flow after the first push:

```bash
git checkout -b feature/<short-change-name>
# make edits
npm run check
git add .
git commit -m "Describe the change"
git push -u origin feature/<short-change-name>
```

Open a pull request into `main`. Vercel will create a preview deployment for the pull request, and production will update when the PR is merged.

## Vercel Auto-Deploy Setup

1. Create a GitHub repository and push this project.
2. In Vercel, choose **Add New Project** and import the GitHub repository.
3. Use these settings:
   - Framework Preset: **Other**
   - Build Command: leave empty
   - Output Directory: `.`
   - Install Command: leave empty
4. Set the production branch to `main`.
5. Keep automatic deployments enabled.

The site deploys as static files. `server.js` is only for local preview and is excluded from Vercel deployments by `.vercelignore`.
