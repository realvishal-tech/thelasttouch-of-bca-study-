# BCA STORE — README

## 🚀 How to Open

### Option 1: Open Directly (Simplest)
Double-click `index.html` to open in your browser.
All pages work locally **except Firebase** (which needs a live server).

### Option 2: Use VS Code Live Server
1. Install VS Code extension: **Live Server**
2. Right-click `index.html` → **Open with Live Server**
3. Firebase will work correctly in this mode

### Option 3: Python (if installed)
```
cd BCA-Study-Hub
python -m http.server 8080
```
Then open: http://localhost:8080

---

## 🔥 Firebase Setup (REQUIRED for real data)

1. Go to https://console.firebase.google.com
2. Create a new project called **bca-store**
3. Click **Realtime Database** → Create Database → Start in TEST MODE
4. Go to Project Settings → General → Your apps → Add Web App
5. Copy the `firebaseConfig` object
6. Open `script.js` and replace the `firebaseConfig` object at line 10 with your config
7. In Firebase Console → Realtime Database → Rules, set:
   ```json
   {
     "rules": {
       "materials": {
         ".read": true,
         ".write": false
       }
     }
   }
   ```

---

## 🔐 Admin Login

- **Password:** Vishal@@2004

Access admin panel at: `admin.html`

---

## 📁 File Structure

```
BCA-Study-Hub/
├── index.html       ← Homepage
├── semester.html    ← Semester subjects page
├── subject.html     ← Subject materials page
├── admin.html       ← Admin panel
├── style.css        ← All styles
└── script.js        ← All JavaScript logic
```

---

## ✨ Features

- 📝 Notes, PYQs, Videos, Lab — per subject, per semester
- 🔥 Firebase Realtime Database (real-time updates)
- 🌙 Dark Mode toggle (saved in localStorage)
- 📊 Progress Tracker per semester
- 🔖 Bookmark subjects and materials
- 🔁 Spaced Repetition revision scheduler
- 🎤 Text-to-Speech (read notes aloud)
- 🎯 Exam Mode (distraction-free)
- 📑 Multi-Tab study mode
- 🎲 Random Question Generator
- 🎮 Daily Mini Challenge (5 questions, scored)
- 💬 Suggestion/Feedback system with admin inbox
- 📥 Export/Import all data as JSON
- ✏️ Personal Annotations per subject
- 🖼️ Image Viewer with zoom
- 📋 Copy button on all materials
- 🖨️ Print-friendly mode
- 🔍 Keyword highlight search
- 💡 Quick Definitions popup (click any technical term)
- 📊 Admin Analytics dashboard
- ✏️ Edit/Delete materials from admin panel
- 📥 Admin Inbox for user suggestions

---

## 🎨 Made with ❤️ for BRABU BCA Students
