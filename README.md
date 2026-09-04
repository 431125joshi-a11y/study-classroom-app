# 🎓 EduStudy Hub - Google Classroom-Inspired Collaborative Study App

EduStudy Hub is a modern, fast, and student-friendly web application designed for interactive learning, resource sharing, and peer collaboration across **Science**, **Mathematics**, and **Social Studies (SST)** (plus custom subjects).

---

## 🌟 Key Features

### 1. 🏫 Google Classroom-Style Subject Spaces
- **🔬 Science Space (Physics, Chemistry, Biology)**: Emerald-themed hub with chapter breakdowns, chemical reaction formula sheets, and animated experiment videos.
- **📐 Mathematics Space (Algebra, Geometry, Trigonometry, Calculus)**: Violet-themed hub with formulas, practice assignments, and video tutorials.
- **🌍 Social Studies Space (History, Geography, Civics, Economics)**: Amber-themed hub with timelines, maps of India, and concept explainers.
- **➕ Custom Subject Creator**: Add custom classrooms (e.g. Computer Science, English) with custom gradient banner palettes and topic structures.
- **Google Classroom Tabs**: Dedicated **Stream**, **Classwork**, and **Practice Tools** for every subject.

### 2. 📂 Multi-Format Resource & Upload Hub
Upload and organize any study material with instant drag-and-drop:
- 🔗 **Web, YouTube & WhatsApp Links**: Direct support for YouTube videos (with inline player), WhatsApp group study links, Google Drive/Docs links.
- 📄 **PDFs & Master Formula Sheets**: In-app PDF and notes reader with zoom, download, and formatted Markdown viewer.
- 📊 **Presentations & Slide Decks**: PPTX, Google Slides, and Canva links with summary cards.
- 🎥 **Video Lessons**: Direct MP4/WebM video file uploads with custom speed controls (0.75x, 1x, 1.25x, 1.5x, 2x) & YouTube embeds.
- 🖼️ **Photos & Files from Photos/Files App**: High-resolution image lightbox viewer with zoom & pan, plus support for documents and zip files.
- 💾 **Persistent High-Capacity Storage**: Uses **IndexedDB** so you can upload large PDF files, videos, and images without storage limits.

### 3. 💬 Study Lounge & Doubt Solver Chatbox
- **Channel Switching**: Jump between `#general-lounge`, `#science-doubts`, `#maths-doubts`, and `#sst-doubts`.
- **⚡ Real-Time Cross-Tab Sync**: Uses `BroadcastChannel` API to instantly synchronize messages and reactions between browser windows in real time!
- **🤖 24/7 Built-in AI StudyBot**: Tag `@StudyBot` in any channel or ask a doubt to receive instant explanations, formulas, definitions, and study tips.
- **📎 Direct Material Sharing**: Attach any uploaded classroom note directly into chat conversations.
- **Custom User Profile**: Choose your display name, student avatar gradient, and study status.

### 4. 🚀 Student Productivity Suite
- ⏱️ **Pomodoro Focus Timer**: 25m Focus / 5m Break with gentle synthesized chime notifications and session streak counter.
- 🗂️ **Interactive Smart Flashcards**: 3D-style flip revision cards with mastery scoring and custom flashcard creator.
- ✅ **Homework & Assignment Tracker**: Priority checklists with due dates and confetti celebration animations upon completing tasks!
- 💾 **Data Backup & Restore**: One-click JSON export/import to backup and transfer your classroom data across devices.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Framer Motion
- **Animations & Effects**: Canvas Confetti, Web Audio API Sound Synthesizer
- **Storage**: IndexedDB (binary blobs) + LocalStorage (metadata & preferences)
- **Real-Time Layer**: HTML5 `BroadcastChannel` API

---

## 🚀 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start local development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

---

## 🌐 Deploying to GitHub & Setting up a Custom Domain

### Step 1: Automatic Deployment to GitHub Pages
This project includes an automated GitHub Actions workflow (`.github/workflows/deploy.yml`).

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of EduStudy Hub"
   gh repo create study-classroom-app --public --source=. --push
   ```
2. Go to your GitHub repository -> **Settings** -> **Pages**.
3. Under **Build and deployment** -> **Source**, select **GitHub Actions**.
4. Every push to `main` will automatically build and publish your app to `https://<your-username>.github.io/study-classroom-app/`.

### Step 2: Custom Domain Configuration (Optional)
If you own a custom domain (e.g., `study.yourdomain.com` or `edustudyhub.com`):
1. In your GitHub repository, go to **Settings** -> **Pages** -> **Custom domain**.
2. Enter your domain name and click **Save**.
3. In your DNS provider (e.g. Cloudflare, GoDaddy, Namecheap), add a `CNAME` record:
   - **Type**: `CNAME`
   - **Name/Host**: `study` (or `@`)
   - **Value/Target**: `<your-username>.github.io`
4. Check **Enforce HTTPS** in GitHub Pages settings.
