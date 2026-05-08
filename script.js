// ============================================================
// BCA STORE - script.js  (Complete Rewrite - All Fixed)
// ============================================================

// Global Scroll Handlers for UX
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  const btt = document.getElementById('backToTop');
  if (window.scrollY > 50) {
    if (nav) nav.classList.add('scrolled');
  } else {
    if (nav) nav.classList.remove('scrolled');
  }
  
  if (window.scrollY > 500) {
    if (btt) btt.classList.add('show');
  } else {
    if (btt) btt.classList.remove('show');
  }
});

// ============================================================
// 1. FIREBASE CONFIG
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyC_mWJld2NksodLIg0hI_O0wuLWpUL4AoE",
  authDomain: "bca-store.firebaseapp.com",
  databaseURL: "https://bca-store-default-rtdb.firebaseio.com",
  projectId: "bca-store",
  storageBucket: "bca-store.firebasestorage.app",
  messagingSenderId: "1063532602856",
  appId: "1:1063532602856:web:30812a52ccbded1548305d",
  measurementId: "G-SEYBV2CS0W"
};

let db = null;
try {
  if (typeof firebase !== 'undefined') {
    const app = firebase.apps && firebase.apps.length > 0 ? firebase.app() : firebase.initializeApp(firebaseConfig);
    db = firebase.database(app);
  }
} catch (e) { console.warn("Firebase fallback:", e.message); }

// ============================================================
// 2. SUBJECT DATA
// ============================================================
const SUBJECTS = {
  Semester1: [
    { code: "BCA-101", name: "Mathematical Foundation", icon: "📐" },
    { code: "BCA-102", name: "Computer Fundamentals", icon: "💻" },
    { code: "BCA-103", name: "Business Communication & Information System", icon: "📊" },
    { code: "BCA-104", name: "C Programming", icon: "⌨️" },
    { code: "BCA-105", name: "Lab on DOS & Windows", icon: "🖥️" },
    { code: "BCA-106", name: "Lab on C", icon: "🔬" }
  ],
  Semester2: [
    { code: "BCA-201", name: "Discrete Mathematics", icon: "🔢" },
    { code: "BCA-202", name: "Computer Architecture", icon: "🏗️" },
    { code: "BCA-203", name: "Data Structure through C", icon: "🌲" },
    { code: "BCA-204", name: "System Analysis and Design", icon: "📋" },
    { code: "BCA-205", name: "Lab on MS-Office", icon: "📝" },
    { code: "BCA-206", name: "Lab on Data Structure", icon: "🔬" }
  ],
  Semester3: [
    { code: "BCA-301", name: "Management & Business Accounting", icon: "💰" },
    { code: "BCA-302", name: "Database Management System", icon: "🗄️" },
    { code: "BCA-303", name: "Object Oriented Programming using C++", icon: "🎯" },
    { code: "BCA-304", name: "Numerical Methodology", icon: "🔢" },
    { code: "BCA-305", name: "Lab on DBMS", icon: "🔬" },
    { code: "BCA-306", name: "Lab on C++", icon: "🔬" }
  ],
  Semester4: [
    { code: "BCA-401", name: "Java Programming", icon: "☕" },
    { code: "BCA-402", name: "Computer Graphics & Multimedia", icon: "🎨" },
    { code: "BCA-403", name: "Operating System & Linux", icon: "🐧" },
    { code: "BCA-404", name: "Software Engineering", icon: "🛠️" },
    { code: "BCA-405", name: "Lab on Java", icon: "🔬" },
    { code: "BCA-406", name: "Lab on Graphics & Linux", icon: "🔬" }
  ],
  Semester5: [
    { code: "BCA-501", name: "RDBMS", icon: "🗄️" },
    { code: "BCA-502", name: "AI with Python", icon: "🤖" },
    { code: "BCA-503", name: "Web Technology (HTML, CSS, JS)", icon: "🌐" },
    { code: "BCA-504", name: "Network & Cyber Law", icon: "🔒" },
    { code: "BCA-505", name: "Lab on Oracle", icon: "🔬" },
    { code: "BCA-506", name: "Lab on Python & Web", icon: "🔬" }
  ],
  Semester6: [
    { code: "BCA-601", name: "Project", icon: "🚀" },
    { code: "BCA-602", name: "Seminar", icon: "🎤" },
    { code: "BCA-603", name: "Viva", icon: "🎓" }
  ]
};
const SEMESTER_DESCRIPTIONS = {
  Semester1: "<div class='batch-systematic'>• 📚 Premium Notes<br>• 📜 Solved PYQs<br>• 🎥 Video Guides</div>",
  Semester2: "<div class='batch-systematic'>• 🧠 Data Structures<br>• 🏛️ Architecture Docs<br>• 🧪 Lab Manuals</div>",
  Semester3: "<div class='batch-systematic'>• 🎯 C++ Modules<br>• 🗄️ DBMS Workbooks<br>• 📊 Accountancy Notes</div>",
  Semester4: "<div class='batch-systematic'>• ☕ Java Projects<br>• 🐧 Linux Commands<br>• 🛠️ SE Blueprints</div>",
  Semester5: "<div class='batch-systematic'>• 🤖 Python & AI<br>• 🌐 Web Tech Code<br>• 🔒 Security Guides</div>",
  Semester6: "<div class='batch-systematic'>• 🚀 Project Support<br>• 🎤 Seminar Kits<br>• 🎓 Viva Prep Sets</div>"
};

const SAMPLE_QUESTIONS = [
  { q: "What is the time complexity of Binary Search?", a: "O(log n)" },
  { q: "What does OOP stand for?", a: "Object Oriented Programming" },
  { q: "What is normalization in DBMS?", a: "Organizing data to reduce redundancy and improve data integrity" },
  { q: "What is a pointer in C?", a: "A variable that stores the memory address of another variable" },
  { q: "Difference between TCP and UDP?", a: "TCP is connection-oriented and reliable; UDP is connectionless and faster" },
  { q: "What is an algorithm?", a: "A step-by-step procedure for solving a problem" },
  { q: "Define inheritance in C++.", a: "A mechanism where a class derives properties from a parent class" },
  { q: "What is a primary key in SQL?", a: "A column that uniquely identifies each row in a table" },
  { q: "What is recursion?", a: "A function that calls itself until a base condition is met" },
  { q: "Difference between stack and queue?", a: "Stack is LIFO; Queue is FIFO" },
  { q: "What is deadlock in OS?", a: "A state where processes wait for each other and none can proceed" },
  { q: "What is encapsulation?", a: "Bundling data and methods within one unit (class)" },
  { q: "Full form of HTML?", a: "HyperText Markup Language" },
  { q: "What is an IP address?", a: "A unique numerical label assigned to each device on a network" },
  { q: "What is polymorphism?", a: "The ability of an object to take many forms" }
];

const DEFINITIONS = {
  "algorithm": "A step-by-step procedure for solving a problem.",
  "array": "A data structure storing elements of the same type in contiguous memory.",
  "class": "A blueprint for creating objects with state and behavior.",
  "compiler": "Translates source code into machine code.",
  "database": "An organized collection of structured information stored electronically.",
  "encapsulation": "Bundling data and methods together within a class.",
  "function": "A reusable block of code that performs a specific task.",
  "inheritance": "A mechanism where a class acquires properties from a parent class.",
  "loop": "A control structure that repeats a block of code while a condition is true.",
  "normalization": "Organizing a database to reduce redundancy.",
  "object": "An instance of a class containing state and behavior.",
  "pointer": "A variable storing the memory address of another variable.",
  "polymorphism": "The ability of an object to behave differently in different contexts.",
  "recursion": "A function that calls itself to solve a problem.",
  "sql": "Structured Query Language — for managing relational databases.",
  "stack": "A LIFO (Last In First Out) data structure.",
  "queue": "A FIFO (First In First Out) data structure.",
  "thread": "The smallest unit of execution within a process.",
  "variable": "A named storage location in memory.",
  "linux": "An open-source Unix-like operating system kernel.",
  "java": "A high-level, object-oriented, platform-independent programming language.",
  "python": "A high-level interpreted language known for simplicity.",
  "html": "HyperText Markup Language — the standard for creating web pages.",
  "css": "Cascading Style Sheets — a language for styling HTML documents.",
  "javascript": "A scripting language for dynamic web content."
};

// ============================================================
// 3. UTILITIES
// ============================================================
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
function showToast(msg, type = 'success') {
  const c = document.getElementById('toastContainer');
  if (!c) return;
  const t = document.createElement('div');
  t.className = 'toast toast-' + type;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}
function formatDate(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function genId() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 5); }
async function fetchUserIp() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    lsSet('userIp', data.ip);
    return data.ip;
  } catch (e) { return null; }
}
function lsGet(key, fallback = null) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { } }
function highlightText(text, kw) {
  if (!kw || kw.length < 2) return text;
  return text.replace(new RegExp('(' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>');
}
function getYouTubeEmbed(url) {
  if (!url) return null;
  const reg = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const m = url.match(reg);
  return m ? 'https://www.youtube-nocookie.com/embed/' + m[1] + '?autoplay=1&rel=0' : null;
}
function getYouTubeThumb(url) {
  const reg = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const m = url.match(reg);
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : 'https://via.placeholder.com/480x270?text=Video+Preview';
}
function isImage(url) { return url && /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url); }
function isVideo(url) { return url && /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url); }
function typeBadge(type) {
  const labels = { notes: '📝 Notes', pyq: '📄 PYQs', video: '🎥 Video', pyq_solve: '📜 PYQs Solve', program: '⌨️ Program' };
  return `<span class="card-type-badge badge-${type}">${labels[type] || type}</span>`;
}
function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/; SameSite=Lax';
}
function getCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
}
function saveScrollPosition() { lsSet('scroll_' + location.href, window.scrollY); }
function restoreScrollPosition() {
  const p = lsGet('scroll_' + location.href, 0);
  if (p > 0) setTimeout(() => window.scrollTo({ top: p, behavior: 'smooth' }), 400);
}
function getSemesterProgress(semKey) {
  const done = lsGet('completed', {});
  const subs = SUBJECTS[semKey];
  if (!subs || !subs.length) return 0;
  return Math.round(subs.filter(s => done[semKey + '_' + s.code]).length / subs.length * 100);
}
function isMatDone(id) {
  if (!id) return false;
  const key = currentSemKey + '_' + currentCode + '_' + id;
  return lsGet('mat_completed', {})[key] || false;
}

// ============================================================
// 4. DARK MODE
// ============================================================
function initDarkMode() {
  const dark = lsGet('darkMode', false);
  if (dark) document.documentElement.setAttribute('data-theme', 'dark');
  updateDarkToggle(dark);
  document.getElementById('darkToggle')?.addEventListener('click', toggleDarkMode);
}
function toggleDarkMode() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  lsSet('darkMode', !isDark);
  updateDarkToggle(!isDark);
}
function updateDarkToggle(isDark) {
  const b = document.getElementById('darkToggle');
  if (b) b.textContent = isDark ? '☀️' : '🌙';
}

// ============================================================
// 5. NAVBAR
// ============================================================
function initNavbar() {
  const h = document.getElementById('hamburger');
  const nl = document.getElementById('navLinks');

  // Desktop nav click-away behavior (still works on desktop)
  if (h && nl) {
    // Inject mobile drawer if not already injected
    if (!document.getElementById('mobileDrawer')) {
      injectMobileDrawer();
    }

    h.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileDrawer();
    });
  }

  // Block Protection
  checkBlockStatus();

  let lastScrollY = window.scrollY;
  let ticking = false;

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const nav = document.getElementById('navbar');
        if (nav) {
          nav.style.boxShadow = lastScrollY > 10 ? '0 4px 24px rgba(0,0,0,0.15)' : '';
          nav.style.transform = lastScrollY > 10 ? 'translateY(0)' : ''; // Keep it stable
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

function injectMobileDrawer() {
  // Determine active page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const isHome = currentPage === 'index.html' || currentPage === '' || currentPage === '/';
  const isBatch = currentPage === 'my-batches.html';
  const isSemester = currentPage === 'semester.html' || currentPage === 'subject.html';
  const isAdmin = currentPage === 'admin.html';
  const isStaff = currentPage === 'staff.html';

  // Get user name
  const userName = lsGet('userName', '');
  const displayName = userName || 'Student';
  const initial = displayName.charAt(0).toUpperCase();

  // Get enrolled batch count
  const enrolledCount = lsGet('enrolledBatches', []).length;

  const drawerHTML = `
    <div class="mobile-menu-overlay" id="mobileOverlay"></div>
    <div class="mobile-drawer" id="mobileDrawer">
      <div class="drawer-header">
        <div class="drawer-avatar">${initial}</div>
        <div class="drawer-profile-info">
          <div class="drawer-user-name">${displayName}</div>
          <div class="drawer-user-role">BCA • BRABU Student</div>
        </div>
      </div>
      
      <div class="drawer-nav">
        <div class="drawer-section-label">Quick Access</div>
        <div class="drawer-grid-menu">
          <a href="index.html" class="drawer-grid-item ${isHome ? 'active' : ''}">
            <div class="grid-item-icon">🏠</div>
            <div class="grid-item-text">Home</div>
          </a>
          <a href="my-batches.html" class="drawer-grid-item ${isBatch ? 'active' : ''}">
            <div class="grid-item-icon">🎓</div>
            <div class="grid-item-text">My Batch</div>
            ${enrolledCount > 0 ? `<div class="grid-item-badge">${enrolledCount}</div>` : ''}
          </a>
          <a href="exam.html" class="drawer-grid-item ${window.location.pathname.includes('exam.html') ? 'active' : ''}">
            <div class="grid-item-icon">📝</div>
            <div class="grid-item-text">Exam</div>
          </a>
          <a href="community.html" class="drawer-grid-item ${window.location.pathname.includes('community.html') ? 'active' : ''}">
            <div class="grid-item-icon">🧑‍🤝‍🧑</div>
            <div class="grid-item-text">Community</div>
          </a>
          <a href="admin.html" class="drawer-grid-item ${isAdmin ? 'active' : ''}">
            <div class="grid-item-icon">⚙️</div>
            <div class="grid-item-text">Admin</div>
          </a>
          <a href="semester.html?sem=1" class="drawer-grid-item ${isSemester ? 'active' : ''}">
            <div class="grid-item-icon">📖</div>
            <div class="grid-item-text">Subjects</div>
          </a>
          <a href="javascript:void(0)" class="drawer-grid-item bk-drawer-item" onclick="closeMobileDrawer(); setTimeout(openBkPanel, 300);">
            <div class="grid-item-icon">🔖</div>
            <div class="grid-item-text">Bookmarks</div>
            ${(lsGet('bookmarks_v2', []).length > 0) ? `<div class="grid-item-bk-badge">${lsGet('bookmarks_v2', []).length}</div>` : ''}
          </a>
        </div>

        <div class="drawer-section-label">Semesters</div>
        <div class="semester-square-grid">
          ${[1, 2, 3, 4, 5, 6].map(s => `
            <a href="semester.html?sem=${s}" class="sem-square-item ${window.location.search.includes('sem=' + s) ? 'active' : ''}">
              <span class="sem-num">${s}</span>
              <span class="sem-label">SEM</span>
            </a>
          `).join('')}
        </div>

        <div class="drawer-section-label">Resources</div>
        <div class="resource-square-grid">
          <a href="semester.html?sem=1&type=notes" class="res-square-item">
            <span class="res-icon">📝</span>
            <span class="res-text">Notes</span>
          </a>
          <a href="semester.html?sem=1&type=pyq" class="res-square-item">
            <span class="res-icon">📜</span>
            <span class="res-text">PYQs</span>
          </a>
          <a href="semester.html?sem=1&type=video" class="res-square-item">
            <span class="res-icon">📺</span>
            <span class="res-text">Videos</span>
          </a>
          <a href="semester.html?sem=1&type=syllabus" class="res-square-item">
            <span class="res-icon">📋</span>
            <span class="res-text">Syllabus</span>
          </a>
        </div>
      </div>

      <div class="drawer-footer">
        <div class="drawer-dark-toggle" id="drawerDarkToggle" onclick="toggleDarkMode(); updateDrawerDarkSwitch();">
          <div class="drawer-dark-label">
            <span id="drawerDarkIcon">🌙</span>
            <span id="drawerDarkText">Dark Mode</span>
          </div>
          <div class="drawer-dark-switch" id="drawerDarkSwitch"></div>
        </div>
        <div class="drawer-version">BCA Store • V2.0 Professional</div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', drawerHTML);

  // Overlay click to close
  document.getElementById('mobileOverlay').addEventListener('click', () => {
    closeMobileDrawer();
  });

  // Close on link click
  document.querySelectorAll('.drawer-nav-item').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileDrawer();
    });
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileDrawer();
  });
}

function toggleMobileDrawer() {
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileOverlay');
  const hamburger = document.getElementById('hamburger');
  if (!drawer) return;

  const isOpen = drawer.classList.contains('open');
  if (isOpen) {
    closeMobileDrawer();
  } else {
    drawer.classList.add('open');
    overlay.classList.add('show');
    hamburger.classList.add('active');
    document.body.classList.add('drawer-open');
  }
}

function closeMobileDrawer() {
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileOverlay');
  const hamburger = document.getElementById('hamburger');
  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('show');
  if (hamburger) hamburger.classList.remove('active');
  document.body.classList.remove('drawer-open');
}

function updateDrawerDarkSwitch() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const icon = document.getElementById('drawerDarkIcon');
  const text = document.getElementById('drawerDarkText');
  if (icon) icon.textContent = isDark ? '☀️' : '🌙';
  if (text) text.textContent = isDark ? 'Light Mode' : 'Dark Mode';
}

// ============================================================
// 6. SUGGESTION SYSTEM
// ============================================================
function openSuggestionModal() {
  const modal = document.getElementById('suggestionModal');
  if (!modal) return;
  modal.classList.add('active');
  
  // Pre-fill name if available
  const name = lsGet('userName', '');
  const nameInp = document.getElementById('suggName');
  if (nameInp && !nameInp.value) nameInp.value = name;
  
  // Set context (current page/subject)
  const contextInp = document.getElementById('suggContext');
  if (contextInp) {
    let ctx = window.location.pathname.split('/').pop() || 'Home';
    if (typeof currentCode !== 'undefined' && currentCode) ctx += ` › Subject: ${currentCode}`;
    else if (getParam('sem')) ctx += ` › Semester: ${getParam('sem')}`;
    contextInp.value = ctx;
  }
}
function closeSuggestionModal() { 
  document.getElementById('suggestionModal')?.classList.remove('active'); 
  // Reset body if success state was shown
  setTimeout(() => {
    const body = document.getElementById('suggestionBody');
    const footer = document.getElementById('suggestionFooter');
    if (body && footer && body.innerHTML.includes('sugg-success-state')) {
      location.reload(); // Simplest way to reset the complex modal structure
    }
  }, 300);
}
function updateCharCount(el) {
  const cur = document.getElementById('charCurrent');
  if (cur) cur.textContent = el.value.length;
}
function submitSuggestion() {
  const name = document.getElementById('suggName')?.value.trim() || 'Anonymous';
  const category = document.getElementById('suggCategory')?.value || 'General';
  const context = document.getElementById('suggContext')?.value || 'Unknown';
  const msg = document.getElementById('suggMessage')?.value.trim();
  
  if (!msg) { showToast('❌ Please enter a message.', 'error'); return; }
  if (!db) { showToast('❌ Firebase not connected.', 'error'); return; }
  
  const visitorId = getVisitorId();
  const ip = lsGet('userIp', 'Pending...');
  
  const suggData = {
    visitorId,
    name,
    category,
    context,
    lastMessage: msg,
    date: Date.now(),
    read: false,
    ip: ip,
    messages: {
      [genId()]: { text: msg, sender: 'user', date: Date.now() }
    }
  };

  db.ref('suggestions').push(suggData).then(() => {
    // Show visual success state
    const body = document.getElementById('suggestionBody');
    const footer = document.getElementById('suggestionFooter');
    if (body && footer) {
      body.innerHTML = `
          <div class="sugg-success-state">
          <span class="sugg-success-icon">🚀</span>
          <h3>Message Sent!</h3>
          <p>Admin will review your feedback soon. You can track and reply back in the <b>My History</b> tab.</p>
        </div>`;
      footer.innerHTML = `<button class="btn-primary" style="width:100%" onclick="closeSuggestionModal()">Close</button>`;
    } else {
      showToast('✅ Message sent!', 'success');
      closeSuggestionModal();
    }
  }).catch(() => showToast('❌ Failed to send.', 'error'));
}

function sendAdminMessage(id) {
  const msg = prompt('Enter your reply to this user:');
  if (!msg || !db) return;
  
  const newMsgKey = db.ref('suggestions/' + id + '/messages').push().key;
  db.ref('suggestions/' + id + '/messages/' + newMsgKey).set({
    text: msg,
    sender: 'admin',
    date: Date.now()
  }).then(() => {
    db.ref('suggestions/' + id).update({ read: true, lastMessage: msg });
    showToast('💬 Reply sent successfully!', 'success');
  }).catch(() => showToast('❌ Failed to send.', 'error'));
}

function sendUserMessage(id) {
  const msg = prompt('Enter your message for the admin:');
  if (!msg || !db) return;
  
  const newMsgKey = db.ref('suggestions/' + id + '/messages').push().key;
  db.ref('suggestions/' + id + '/messages/' + newMsgKey).set({
    text: msg,
    sender: 'user',
    date: Date.now()
  }).then(() => {
    db.ref('suggestions/' + id).update({ read: false, lastMessage: msg });
    showToast('🚀 Message sent to admin!', 'success');
    renderSuggHistory();
  }).catch(() => showToast('❌ Failed to send.', 'error'));
}

function switchSuggTab(tab) {
  const sendView = document.getElementById('suggSendView');
  const histView = document.getElementById('suggHistoryView');
  const tabSend = document.getElementById('tabSend');
  const tabHist = document.getElementById('tabHistory');
  
  if (tab === 'history') {
    sendView.style.display = 'none';
    histView.style.display = 'block';
    tabSend.classList.remove('active');
    tabHist.classList.add('active');
    renderSuggHistory();
  } else {
    sendView.style.display = 'block';
    histView.style.display = 'none';
    tabSend.classList.add('active');
    tabHist.classList.remove('active');
  }
}

function renderSuggHistory() {
  const cont = document.getElementById('suggestionHistoryBody');
  if (!cont || !db) return;
  cont.innerHTML = '<div style="text-align:center;padding:20px;">⌛ Loading your history...</div>';
  
  const visitorId = getVisitorId();
  db.ref('suggestions').orderByChild('visitorId').equalTo(visitorId).once('value', snap => {
    if (!snap.exists()) {
      cont.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);">You haven\'t sent any suggestions yet!</div>';
      return;
    }
    const history = [];
    snap.forEach(child => { history.unshift({ id: child.key, ...child.val() }); });
    
    cont.innerHTML = history.map(h => {
      const msgs = h.messages ? Object.values(h.messages) : [];
      return `
        <div class="history-item">
          <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--text-muted);margin-bottom:8px;">
            <span>${h.category}</span>
            <span>${formatDate(h.date)}</span>
          </div>
          
          <div class="user-chat-thread" style="margin-bottom:12px;">
            ${msgs.map(m => `
              <div style="margin-bottom:10px; text-align:${m.sender === 'admin' ? 'left' : 'right'}">
                <div style="display:inline-block; padding:8px 12px; border-radius:12px; font-size:0.85rem; 
                  background:${m.sender === 'admin' ? 'var(--primary-light)' : 'var(--primary)'}; 
                  color:${m.sender === 'admin' ? 'var(--primary)' : '#fff'};
                  border:1px solid ${m.sender === 'admin' ? 'var(--primary)' : 'transparent'}">
                  ${m.text}
                </div>
                <div style="font-size:0.65rem; color:var(--text-muted); margin-top:2px;">${formatDate(m.date)}</div>
              </div>
            `).join('')}
          </div>

          <button class="btn-outline btn-sm" style="width:100%; font-size:0.8rem;" onclick="sendUserMessage('${h.id}')">💬 Reply Back to Admin</button>
        </div>
      `;
    }).join('');
  });
}

function adminReply(id) {
  const msg = prompt('Enter your reply to this suggestion:');
  if (!msg || !db) return;
  
  db.ref('suggestions/' + id).update({
    reply: msg,
    replyDate: Date.now(),
    read: true
  }).then(() => {
    showToast('💬 Reply sent successfully!', 'success');
    loadInboxMessages();
  }).catch(() => showToast('❌ Failed to send reply.', 'error'));
}

function checkMyReplies() {
  if (!db) return;
  const visitorId = getVisitorId();
  
  db.ref('suggestions').orderByChild('visitorId').equalTo(visitorId).on('child_changed', snap => {
    const data = snap.val();
    if (data.reply && !lsGet('replied_' + snap.key, false)) {
      showToast(`📢 Admin replied to your suggestion: "${data.reply.substring(0, 30)}..."`, 'success');
      lsSet('replied_' + snap.key, true);
    }
  });
}

// ============================================================
// 7. GLOBAL UI INITIALIZATION
// ============================================================
function initGlobalUI() {
  initDarkMode();
  initNavbar();
  initWelcomeFlow();
  initVisitCounter();
  restoreScrollPosition();
  window.addEventListener('beforeunload', saveScrollPosition);
  checkMyReplies();
  updateBkNavBadge();
}

// ============================================================
// 7.1 HOME PAGE
// ============================================================
function initScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Trigger statistics counters if this is the stats strip
        if (entry.target.classList.contains('stats-strip')) {
          entry.target.querySelectorAll('.stat-number').forEach(el => {
            const target = parseInt(el.getAttribute('data-target')) || 0;
            const hasPlus = el.textContent.includes('+');
            animateCounterValue(el, 0, target, 1000, hasPlus ? '+' : '');
          });
        }

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Target elements to reveal
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger, .reveal-scale');
  revealElements.forEach(el => observer.observe(el));
}

function initHomePage() {
  initGlobalUI();
  renderSemesterCards();
  renderProgressGrid();
  renderNotifications();
  checkRevisionDue();
  initScrollReveal();
  const f = getParam('filter');
  if (f && document.getElementById('globalSearch')) document.getElementById('globalSearch').value = f;
  renderMyBatches();
  
  // Launch Notification
  if (!lsGet('launched_v2', false)) {
    setTimeout(() => {
      showToast('🚀 Welcome to BCA STORE Professional Edition!', 'success');
      lsSet('launched_v2', true);
    }, 2000);
  }

  // Sync visitor activity if name exists
  if (lsGet('userName')) {
    fetchUserIp().then(() => syncVisitorData());
  }
}

// ============================================================
// 7.2 ENROLLMENT SYSTEM
// ============================================================
function enrollInBatch(semKey) {
  const enrolled = lsGet('enrolledBatches', []);
  const isFirstEnrollment = enrolled.length === 0;
  if (!enrolled.includes(semKey)) {
    enrolled.push(semKey);
    lsSet('enrolledBatches', enrolled);
    
    // Increment global enrollment counter in Firebase
    if (db) {
      db.ref('site_stats/totalEnrolled').transaction(current => (current || 0) + 1);
    }

    showToast('🎉 Enrolled successfully in ' + semKey + '!', 'success');
    renderSemesterCards();
    renderMyBatches();
    fetchUserIp().then(() => syncVisitorData());
  }
}

function isEnrolled(semKey) {
  return lsGet('enrolledBatches', []).includes(semKey);
}

function generateBatchCardHTML(k, enrolled) {
  const n = k.replace('Semester', '');
  const desc = SEMESTER_DESCRIPTIONS[k] || "Access all study materials for this semester.";
  const p = getSemesterProgress(k);
  const subCount = (SUBJECTS[k] || []).length;

  return `
    <div class="batch-header">
      <div class="batch-header-overlay"></div>
      <div class="batch-status-badge">${enrolled ? '✅ ENROLLED' : '📢 OPEN'}</div>
      <div class="batch-sem-label">Semester ${n}</div>
    </div>
    <div class="batch-body">
      <div class="batch-desc">${desc}</div>
      <div class="batch-info-strip">
        <span>📚 ${subCount} Subjects</span>
        <span>💎 Premium Notes</span>
      </div>
      <div class="batch-features">
        <span class="feature-tag">🎥 Video Lectures</span>
        <span class="feature-tag">📄 PYQ Sets</span>
        <span class="feature-tag">💻 Lab Manuals</span>
      </div>
      <div class="batch-price-row">
        <span class="batch-price-final">₹0</span>
        <span class="batch-price-old">₹999</span>
        <span class="batch-price-tag">FREE</span>
      </div>
      <div class="batch-footer">
        ${enrolled ? `
          <div class="batch-progress-wrap">
            <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">
              <span>Batch Progress</span><span>${p}%</span>
            </div>
            <div class="progress-bar-track" style="height:6px;">
              <div class="progress-bar-fill" style="width:${p}%"></div>
            </div>
          </div>
          <button class="batch-btn" onclick="location.href='semester.html?sem=${n}'">Let's Study 📖</button>
        ` : `
          <div style="font-size:0.8rem; color:var(--text-muted);">Enroll to start studying</div>
          <button class="batch-btn batch-btn-gold" onclick="enrollInBatch('${k}')">Enroll Now 🚀</button>
        `}
      </div>
    </div>`;
}

function renderMyBatches() {
  const sec = document.getElementById('myBatchesSection');
  const grid = document.getElementById('myBatchesGrid');
  const countEl = document.getElementById('myBatchCount');
  if (!sec || !grid) return;

  const enrolled = lsGet('enrolledBatches', []);
  if (enrolled.length === 0) {
    sec.style.display = 'none';
    return;
  }

  sec.style.display = 'block';
  if (countEl) countEl.textContent = enrolled.length + (enrolled.length === 1 ? ' Batch' : ' Batches');
  
  grid.innerHTML = '';
  enrolled.forEach(k => {
    const semNum = k.replace('Semester', '');
    const c = document.createElement('div');
    c.className = `batch-card batch-card-${semNum}`;
    c.innerHTML = generateBatchCardHTML(k, true);
    grid.appendChild(c);
  });
}

function renderSemesterCards() {
  const g = document.getElementById('semesterGrid'); if (!g) return;
  g.innerHTML = '';
  Object.keys(SUBJECTS).forEach((k, i) => {
    const n = i + 1;
    const enrolled = isEnrolled(k);
    const c = document.createElement('div');
    c.className = `batch-card batch-card-${n}`;
    c.innerHTML = generateBatchCardHTML(k, enrolled);
    g.appendChild(c);
  });
}

function renderProgressGrid() {
  const g = document.getElementById('progressGrid'); if (!g) return;
  g.innerHTML = '';
  Object.keys(SUBJECTS).forEach((k, i) => {
    const p = getSemesterProgress(k);
    const done = lsGet('completed', {});
    const doneCount = SUBJECTS[k].filter(s => done[k + '_' + s.code]).length;
    const d = document.createElement('div');
    d.className = 'glass-card progress-card';
    d.innerHTML = `
      <div class="prog-square-header">
        <span class="prog-sem-num">${i + 1}</span>
        <div class="prog-info">
          <div class="prog-name">Semester ${i + 1}</div>
          <div class="prog-stats">${doneCount}/${SUBJECTS[k].length} Done</div>
        </div>
      </div>
      <div class="progress-bar-track">
        <div class="progress-bar-fill" style="width:${p}%"></div>
      </div>
      <div class="prog-footer">
        <span class="prog-percentage">${p}%</span>
        <button class="btn-sm" onclick="location.href='semester.html?sem=${i + 1}'">Study 🚀</button>
      </div>`;
    g.appendChild(d);
  });
}

function checkRevisionDue() {
  const revs = lsGet('revisions', []);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const due = revs.filter(r => new Date(r.nextDate) <= today);
  const sec = document.getElementById('revisionSection');
  const lst = document.getElementById('revisionList');
  if (due.length > 0 && sec && lst) {
    sec.style.display = 'block';
    lst.innerHTML = due.map(r => `<div class="revision-chip" onclick="location.href='subject.html?sem=${r.sem}&code=${r.code}&tab=${r.tab || 'notes'}'">🔁 ${r.subjectName} — ${r.title}</div>`).join('');
  }
}


function setFilter(type) { lsSet('quickFilter', type); }

function performGlobalSearch() {
  const q = document.getElementById('globalSearch')?.value.trim();
  if (!q) return;
  const results = [];
  Object.keys(SUBJECTS).forEach((k, i) => SUBJECTS[k].forEach(s => {
    if (s.name.toLowerCase().includes(q.toLowerCase()) || s.code.toLowerCase().includes(q.toLowerCase()))
      results.push({ sem: i + 1, semKey: k, subject: s });
  }));
  const sec = document.getElementById('searchResultsSection');
  const con = document.getElementById('searchResults');
  if (!sec || !con) return;
  sec.style.display = 'block';
  con.innerHTML = results.length === 0
    ? '<div class="empty-state"><div class="empty-icon">🔍</div><h3>No results found</h3><p>Try different keywords.</p></div>'
    : results.map(r => `<div class="subject-card glass-card" onclick="location.href='subject.html?sem=${r.sem}&code=${r.subject.code}'" style="cursor:pointer;"><div class="subject-code">${r.subject.code}</div><div class="subject-name">${r.subject.icon} ${highlightText(r.subject.name, q)}</div><div class="sem-sub-count" style="margin-top:6px;">Semester ${r.sem}</div></div>`).join('');
  sec.scrollIntoView({ behavior: 'smooth' });
}

function clearSearch() {
  const s = document.getElementById('searchResultsSection');
  const g = document.getElementById('globalSearch');
  if (s) s.style.display = 'none';
  if (g) g.value = '';
}

// ============================================================
// 8. PAGE: EXAM PATTERN
// ============================================================
function initExamPage() {
  initGlobalUI();
}

// ============================================================
// 9. PAGE: MY BATCHES
// ============================================================
function initMyBatchesPage() {
  initGlobalUI();
  renderMyBatches();
  
  // Check if grid is empty to show message
  setTimeout(() => {
    const grid = document.getElementById('myBatchesGrid');
    const msg = document.getElementById('noBatchesMsg');
    if (grid && grid.children.length === 0) {
      msg.style.display = 'block';
      const countPill = document.getElementById('myBatchCount');
      if (countPill) countPill.style.display = 'none';
    }
  }, 100);
}

// ============================================================
// 10. PAGE: ADMIN
// ============================================================
// Admin initialization is now consolidated at line 2023.

// ============================================================
// 11. PAGE: SEMESTER
// ============================================================
function initSemesterPage() {
  initGlobalUI();
  const semNum = parseInt(getParam('sem')) || 1;
  const semKey = 'Semester' + semNum;
  const el = id => document.getElementById(id);

  if (el('semNumber')) el('semNumber').textContent = semNum;
  if (el('semTitle')) el('semTitle').innerHTML = `Semester <span class="gradient-text">${semNum}</span>`;
  if (el('semDesc')) el('semDesc').textContent = (SUBJECTS[semKey]?.length || 0) + ' subjects — Select one to access study materials';
  if (el('semBreadcrumb')) el('semBreadcrumb').textContent = 'Semester ' + semNum;
  document.title = 'Semester ' + semNum + ' | BCA STORE';

  const tabs = el('semTabs');
  if (tabs) tabs.innerHTML = [1, 2, 3, 4, 5, 6].map(n => `<button class="sem-tab${n === semNum ? ' active' : ''}" onclick="location.href='semester.html?sem=${n}'">Semester ${n}</button>`).join('');

  renderSubjectCards(semKey, semNum);
  updateSemesterProgress(semKey);
  trackView(semNum);
}

function renderSubjectCards(semKey, semNum, filter = '') {
  const g = document.getElementById('subjectsGrid'); if (!g) return;
  const subs = SUBJECTS[semKey] || [];
  const done = lsGet('completed', {});
  const bk = lsGet('bookmarks', {});
  const vis = lsGet('visits', {});
  const filtered = filter ? subs.filter(s => s.name.toLowerCase().includes(filter) || s.code.toLowerCase().includes(filter)) : subs;
  if (!filtered.length) { g.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><h3>No subjects found</h3></div>'; return; }
  g.innerHTML = filtered.map(s => {
    const key = semKey + '_' + s.code;
    const vc = vis[key] || 0;
    const hc = vc > 5 ? 'heat-high' : vc > 2 ? 'heat-medium' : 'heat-low';
    return `<div class="subject-card glass-card" onclick="goToSubject(${semNum},'${s.code}')" style="cursor:pointer;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div class="subject-code">${s.code}</div>
        <span class="heat-badge ${hc}" style="font-size:0.7rem;">${hc.replace('heat-', '')}</span>
      </div>
      <div class="subject-name">${s.icon} ${s.name}</div>
      <div class="subject-meta">
        ${done[key] ? '<span class="completed-badge">✅ Completed</span>' : ''}
        ${bk[key] ? '<span class="bookmarked-badge">🔖 Bookmarked</span>' : ''}
      </div>
    </div>`;
  }).join('');
}

function filterSubjects() {
  const q = document.getElementById('subjectSearch')?.value.toLowerCase().trim();
  const semNum = parseInt(getParam('sem')) || 1;
  renderSubjectCards('Semester' + semNum, semNum, q);
}

function goToSubject(semNum, code) {
  const k = 'Semester' + semNum + '_' + code;
  const v = lsGet('visits', {}); v[k] = (v[k] || 0) + 1; lsSet('visits', v);
  location.href = 'subject.html?sem=' + semNum + '&code=' + code;
}

function updateSemesterProgress(semKey) {
  const p = getSemesterProgress(semKey);
  const b = document.getElementById('semProgressBar');
  const t = document.getElementById('semProgressPct');
  if (b) b.style.width = p + '%';
  if (t) t.textContent = p + '%';
}

// ============================================================
// 9. SUBJECT PAGE - MAIN INIT
// ============================================================
let currentSemNum = 1, currentSemKey = 'Semester1', currentCode = '', currentSubject = null;
let allMaterials = { notes: [], pyq: [], video: [], pyq_solve: [], program: [] };
let currentTab = 'notes';
let ttsUtterance = null;
let videoPlayerInstance = null; // Global Plyr instance

function initSubjectPage() {
  initGlobalUI();
  currentSemNum = parseInt(getParam('sem')) || 1;
  currentCode = getParam('code') || '';
  currentSemKey = 'Semester' + currentSemNum;
  currentSubject = SUBJECTS[currentSemKey]?.find(s => s.code === currentCode);

  if (!currentSubject) {
    const h = document.getElementById('subjectHeader');
    if (h) h.innerHTML = '<div class="container" style="padding-top:100px;"><h1 class="page-title" style="color:#fff;">Subject Not Found</h1><a href="index.html" class="btn-primary" style="display:inline-block;margin-top:16px;">Back to Home</a></div>';
    return;
  }

  document.title = currentSubject.name + ' | BCA STORE';
  const el = id => document.getElementById(id);
  if (el('subjectTitle')) el('subjectTitle').textContent = currentSubject.icon + ' ' + currentSubject.name;
  if (el('subjectCode')) el('subjectCode').textContent = currentCode + ' — Semester ' + currentSemNum;
  if (el('subjectBreadcrumb')) el('subjectBreadcrumb').textContent = currentCode;
  const sl = el('semLink');
  if (sl) { sl.textContent = 'Semester ' + currentSemNum; sl.href = 'semester.html?sem=' + currentSemNum; }

  updateBookmarkBtn();
  updateCompleteBtn();
  loadMaterials();
  initStudyTabs();
  loadAnnotations();
  restoreScrollPosition();
  window.addEventListener('beforeunload', saveScrollPosition);
  const tabParam = getParam('tab');
  if (tabParam) switchTab(tabParam);
  if (el('examModeBar')) el('examModeBar').style.display = 'none';
  trackView(currentSemNum);
}

function loadMaterials() {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) spinner.style.display = 'block';
  allMaterials = { notes: [], pyq: [], video: [], pyq_solve: [], program: [] };

  const done = () => { if (spinner) spinner.style.display = 'none'; mergeLSMaterials(); renderCurrentTab(); };

  if (db) {
    try {
      firebase.database().ref('materials/' + currentSemKey + '/' + currentCode).on('value', snap => {
        allMaterials = { notes: [], pyq: [], video: [], pyq_solve: [], program: [] };
        if (snap.exists()) snap.forEach(child => {
          const item = { id: child.key, ...child.val() };
          if (item.type === 'lab') item.type = 'pyq_solve';
          const type = item.type || 'notes';
          if (!allMaterials[type]) allMaterials[type] = [];
          allMaterials[type].push(item);
        });
        done();
      }, (error) => {
        console.error("Firebase read error:", error);
        loadLSMaterials();
      });
    } catch (e) { loadLSMaterials(); }
  } else { loadLSMaterials(); }
}

function loadLSMaterials() {
  allMaterials = { notes: [], pyq: [], video: [], pyq_solve: [], program: [] };
  mergeLSMaterials();
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) spinner.style.display = 'none';
  renderCurrentTab();
}

function mergeLSMaterials() {
  const key = 'materials_' + currentSemKey + '_' + currentCode;
  const stored = lsGet(key, {});
  Object.values(stored).forEach(item => {
    const type = item.type || 'notes';
    if (!allMaterials[type]) allMaterials[type] = [];
    if (!allMaterials[type].find(m => m.id === item.id)) allMaterials[type].push(item);
  });
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.content-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
  document.querySelectorAll('.tab-content').forEach(div => div.classList.remove('active'));
  const active = document.getElementById('tab-' + tab);
  if (active) active.classList.add('active');
  renderCurrentTab();
}

function renderCurrentTab() {
  const kw = document.getElementById('materialSearch')?.value.trim() || '';
  const items = (allMaterials[currentTab] || []).filter(m =>
    !kw || m.title?.toLowerCase().includes(kw.toLowerCase()) || m.description?.toLowerCase().includes(kw.toLowerCase())
  );
  if (currentTab === 'video') renderVideoMaterials(items, kw);
  else renderMaterialCards(items, currentTab, kw);
}

function renderMaterialCards(items, type, kw = '') {
  const grid = document.getElementById(type + 'Materials');
  const empty = document.getElementById(type + 'Empty');
  if (!grid) return;
  if (!items.length) { grid.innerHTML = ''; if (empty) empty.style.display = 'block'; return; }
  if (empty) empty.style.display = 'none';
  grid.innerHTML = items.map(item => {
    const isImg = isImage(item.link);
    const sl = (item.link || '').replace(/'/g, "\\'");
    const st = (item.title || 'Untitled').replace(/'/g, "\\'");
    return `<div class="material-card glass-card">
      ${typeBadge(item.type || type)}
      <div class="card-title">${highlightText(item.title || 'Untitled', kw)}</div>
      <div class="card-desc">${highlightText(item.description || 'No description.', kw)}</div>
      <div class="card-meta">🕐 ${formatDate(item.timestamp)}</div>
      <div class="card-actions">
        ${isImg
        ? `<button class="btn-primary" onclick="trackInteraction('${item.type || type}'); openImageViewer('${sl}','${st}')">🖼️ View Image</button>`
        : `<a href="${item.link || '#'}" target="_blank" rel="noopener noreferrer" class="btn-primary" onclick="trackInteraction('${item.type || type}')">🔗 Open</a>`
      }
        <button class="btn-outline" onclick="bookmarkMaterial('${item.id || ''}','${st}')">🔖</button>
        <button class="btn-outline ${isMatDone(item.id) ? 'active' : ''}" onclick="markItemComplete('${item.id || ''}','${st}','${item.type || type}')">
          ${isMatDone(item.id) ? '✅ Done' : '✔️ Mark Done'}
        </button>
      </div>
    </div>`;
  }).join('');
  addDefinitionListeners(grid);
}

function renderVideoMaterials(items, kw = '') {
  const grid = document.getElementById('videoMaterials');
  const empty = document.getElementById('videoEmpty');
  if (!grid) return;
  if (!items.length) { grid.innerHTML = ''; if (empty) empty.style.display = 'block'; return; }
  if (empty) empty.style.display = 'none';
  grid.innerHTML = items.map(item => {
    const embed = getYouTubeEmbed(item.link);
    const sl = (item.link || '').replace(/'/g, "\\'");
    const st = (item.title || '').replace(/'/g, "\\'");
    const isDirectVideo = isVideo(item.link);
    
    // Premium Video Card
    return `<div class="video-card">
      <div class="video-thumb-container" onclick="openVideoPlayer('${sl}','${st}')">
        <img src="${getYouTubeThumb(item.link)}" class="video-thumb" alt="${item.title}" onerror="this.src='https://via.placeholder.com/480x270?text=Video+Lecture'" loading="lazy">
        <div class="play-overlay">
          <div class="video-badge-overlay">${isDirectVideo ? 'DIRECT' : 'VIDEO'}</div>
          <span class="play-icon">▶</span>
        </div>
      </div>
      <div class="video-info">
        <div class="video-title">${highlightText(item.title || 'Untitled', kw)}</div>
        <div class="video-desc">${highlightText(item.description || '', kw)}</div>
        <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;">
          <button class="btn-primary btn-sm" onclick="trackInteraction('video'); openVideoPlayer('${sl}','${st}')">📺 Watch Now</button>
          <button class="btn-outline btn-sm" onclick="copyToClipboard('${sl}')">📋 Copy</button>
          <button class="btn-outline btn-sm ${isMatDone(item.id) ? 'active' : ''}" onclick="markItemComplete('${item.id || ''}','${st}','video')">
            ${isMatDone(item.id) ? '✅ Done' : '✔️ Mark Done'}
          </button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function filterMaterials() { renderCurrentTab(); }
function clearMaterialSearch() { const el = document.getElementById('materialSearch'); if (el) el.value = ''; renderCurrentTab(); }

function toggleBookmark() {
  const key = currentSemKey + '_' + currentCode;
  const bk = lsGet('bookmarks', {}); bk[key] = !bk[key]; lsSet('bookmarks', bk);
  // Also store in rich bookmarks
  const v2 = lsGet('bookmarks_v2', []);
  const existing = v2.findIndex(b => b.key === key);
  if (bk[key]) {
    if (existing === -1) {
      v2.push({
        key, type: 'subject', title: currentSubject?.name || currentCode,
        icon: currentSubject?.icon || '📖', code: currentCode,
        sem: currentSemNum, semKey: currentSemKey,
        link: 'subject.html?sem=' + currentSemNum + '&code=' + currentCode,
        timestamp: Date.now()
      });
    }
  } else {
    if (existing > -1) v2.splice(existing, 1);
  }
  lsSet('bookmarks_v2', v2);
  updateBookmarkBtn(); updateBkNavBadge();
  showToast(bk[key] ? '🔖 Bookmarked!' : '🔖 Removed', 'info');
}
function updateBookmarkBtn() {
  const key = currentSemKey + '_' + currentCode;
  const btn = document.getElementById('bookmarkBtn');
  if (btn) btn.textContent = lsGet('bookmarks', {})[key] ? '🔖 Bookmarked' : '🔖 Bookmark';
}
function markSubjectComplete() {
  const key = currentSemKey + '_' + currentCode;
  const done = lsGet('completed', {}); done[key] = !done[key]; lsSet('completed', done);
  if (done[key]) scheduleRevision(currentSemNum, currentCode, currentSubject.name, 'Subject completed', 'notes');
  updateCompleteBtn();
  showToast(done[key] ? '✅ Marked complete! Revisions scheduled.' : '↩️ Marked incomplete', done[key] ? 'success' : 'info');
}
function updateCompleteBtn() {
  const key = currentSemKey + '_' + currentCode;
  const btn = document.getElementById('completeBtn');
  if (btn) btn.textContent = lsGet('completed', {})[key] ? '↩️ Mark Incomplete' : '✅ Mark Complete';
}
function bookmarkMaterial(id, title) {
  const key = 'mat_' + id; const bk = lsGet('bookmarks', {}); bk[key] = !bk[key]; lsSet('bookmarks', bk);
  // Rich bookmark v2
  const v2 = lsGet('bookmarks_v2', []);
  const existing = v2.findIndex(b => b.key === key);
  // Find the material to get its link and type
  let matType = currentTab || 'notes';
  let matLink = '';
  Object.values(allMaterials).forEach(arr => {
    const found = arr.find(m => m.id === id);
    if (found) { matType = found.type || matType; matLink = found.link || ''; }
  });
  if (bk[key]) {
    if (existing === -1) {
      v2.push({
        key, type: matType, title: title || 'Untitled',
        icon: matType === 'notes' ? '📝' : matType === 'pyq' ? '📄' : matType === 'video' ? '🎥' : matType === 'program' ? '⌨️' : matType === 'pyq_solve' ? '📜' : '📎',
        code: currentCode, sem: currentSemNum, semKey: currentSemKey,
        subjectName: currentSubject?.name || currentCode,
        link: matLink, timestamp: Date.now()
      });
    }
  } else {
    if (existing > -1) v2.splice(existing, 1);
  }
  lsSet('bookmarks_v2', v2); updateBkNavBadge();
  showToast(bk[key] ? '🔖 Bookmarked!' : '🔖 Removed', 'info');
}

// ============================================================
// BOOKMARKS PANEL SYSTEM
// ============================================================
let bkPanelTab = 'all';

function injectBookmarksPanel() {
  if (document.getElementById('bkPanel')) return;
  const html = `
    <div class="bk-panel-overlay" id="bkPanelOverlay"></div>
    <div class="bk-panel" id="bkPanel">
      <div class="bk-panel-header">
        <div class="bk-panel-title">
          <div class="bk-icon-wrap">🔖</div>
          <h3>My Bookmarks</h3>
        </div>
        <button class="bk-panel-close" onclick="closeBkPanel()" title="Close">✕</button>
      </div>
      <div class="bk-stats-bar" id="bkStatsBar">
        <div class="bk-stat-chip"><span class="bk-stat-num" id="bkStatTotal">0</span><span class="bk-stat-label">Total</span></div>
        <div class="bk-stat-chip"><span class="bk-stat-num" id="bkStatSubjects">0</span><span class="bk-stat-label">Subjects</span></div>
        <div class="bk-stat-chip"><span class="bk-stat-num" id="bkStatMaterials">0</span><span class="bk-stat-label">Materials</span></div>
      </div>
      <div class="bk-tabs" id="bkTabs">
        <button class="bk-tab active" data-filter="all" onclick="switchBkTab('all')">📌 All</button>
        <button class="bk-tab" data-filter="subject" onclick="switchBkTab('subject')">📖 Subjects</button>
        <button class="bk-tab" data-filter="notes" onclick="switchBkTab('notes')">📝 Notes</button>
        <button class="bk-tab" data-filter="video" onclick="switchBkTab('video')">🎥 Videos</button>
        <button class="bk-tab" data-filter="other" onclick="switchBkTab('other')">📎 Other</button>
      </div>
      <div class="bk-content" id="bkContent"></div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
  document.getElementById('bkPanelOverlay').addEventListener('click', closeBkPanel);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeBkPanel(); });
}

function openBkPanel() {
  injectBookmarksPanel();
  document.getElementById('bkPanel')?.classList.add('active');
  document.getElementById('bkPanelOverlay')?.classList.add('active');
  document.body.classList.add('drawer-open');
  bkPanelTab = 'all';
  renderBkPanel();
}

function closeBkPanel() {
  document.getElementById('bkPanel')?.classList.remove('active');
  document.getElementById('bkPanelOverlay')?.classList.remove('active');
  document.body.classList.remove('drawer-open');
}

function switchBkTab(tab) {
  bkPanelTab = tab;
  document.querySelectorAll('.bk-tab').forEach(t => t.classList.toggle('active', t.dataset.filter === tab));
  renderBkContent();
}

function renderBkPanel() {
  const v2 = lsGet('bookmarks_v2', []);
  const subjects = v2.filter(b => b.type === 'subject');
  const materials = v2.filter(b => b.type !== 'subject');
  const totalEl = document.getElementById('bkStatTotal');
  const subEl = document.getElementById('bkStatSubjects');
  const matEl = document.getElementById('bkStatMaterials');
  if (totalEl) totalEl.textContent = v2.length;
  if (subEl) subEl.textContent = subjects.length;
  if (matEl) matEl.textContent = materials.length;
  // Update tabs active
  document.querySelectorAll('.bk-tab').forEach(t => t.classList.toggle('active', t.dataset.filter === bkPanelTab));
  renderBkContent();
}

function renderBkContent() {
  const container = document.getElementById('bkContent');
  if (!container) return;
  const v2 = lsGet('bookmarks_v2', []);
  let filtered = v2;
  if (bkPanelTab === 'subject') filtered = v2.filter(b => b.type === 'subject');
  else if (bkPanelTab === 'notes') filtered = v2.filter(b => b.type === 'notes');
  else if (bkPanelTab === 'video') filtered = v2.filter(b => b.type === 'video');
  else if (bkPanelTab === 'other') filtered = v2.filter(b => !['subject', 'notes', 'video'].includes(b.type));

  // Sort by timestamp desc
  filtered = filtered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  if (!filtered.length) {
    container.innerHTML = `
      <div class="bk-empty">
        <span class="bk-empty-icon">🔖</span>
        <h4>No Bookmarks Yet</h4>
        <p>Bookmark subjects and materials while studying to find them quickly here!</p>
      </div>
    `;
    return;
  }

  const typeIcons = { subject: '📖', notes: '📝', pyq: '📄', video: '🎥', program: '⌨️', pyq_solve: '📜' };
  const typeLabels = { subject: 'Subject', notes: 'Notes', pyq: 'PYQ', video: 'Video', program: 'Program', pyq_solve: 'PYQ Solve' };

  let html = filtered.map((bk, i) => {
    const timeAgo = getTimeAgo(bk.timestamp);
    const badge = bk.type || 'subject';
    return `<div class="bk-card bk-type-${badge}" style="animation-delay: ${i * 0.05}s" onclick="navigateBookmark('${encodeURIComponent(JSON.stringify({ link: bk.link, type: bk.type }))}')" title="Click to open">
      <div class="bk-card-header">
        <div class="bk-card-info">
          <div class="bk-card-title">${bk.icon || typeIcons[badge] || '📎'} ${bk.title || 'Untitled'}</div>
          <div class="bk-card-sub">
            <span class="bk-card-type-badge bk-badge-${badge}">${typeLabels[badge] || badge}</span>
            ${bk.code ? `<span>• ${bk.code}</span>` : ''}
            ${bk.sem ? `<span>• Sem ${bk.sem}</span>` : ''}
            <span>• ${timeAgo}</span>
          </div>
        </div>
        <div class="bk-card-actions">
          ${bk.link ? `<button class="bk-action-btn bk-open-btn" onclick="event.stopPropagation(); window.open('${bk.link}', '_blank')" title="Open">🔗</button>` : ''}
          <button class="bk-action-btn" onclick="event.stopPropagation(); removeSingleBookmark('${bk.key}')" title="Remove">🗑️</button>
        </div>
      </div>
      ${bk.subjectName && bk.type !== 'subject' ? `<div class="bk-card-sub" style="margin-top:4px; font-size:0.72rem; opacity:0.7;">📚 ${bk.subjectName}</div>` : ''}
    </div>`;
  }).join('');

  html += `<button class="bk-clear-all-btn" onclick="clearAllBookmarks()">🗑️ Clear All Bookmarks</button>`;
  container.innerHTML = html;
}

function getTimeAgo(ts) {
  if (!ts) return '';
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return mins + 'm ago';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  const days = Math.floor(hrs / 24);
  if (days < 30) return days + 'd ago';
  return Math.floor(days / 30) + 'mo ago';
}

function navigateBookmark(encoded) {
  try {
    const data = JSON.parse(decodeURIComponent(encoded));
    if (data.link) {
      if (data.type === 'subject' || data.link.startsWith('subject.html') || data.link.startsWith('semester.html')) {
        window.location.href = data.link;
      } else {
        window.open(data.link, '_blank');
      }
    }
  } catch (e) { console.warn('Navigate bookmark error:', e); }
}

function removeSingleBookmark(key) {
  // Remove from v2
  const v2 = lsGet('bookmarks_v2', []);
  const idx = v2.findIndex(b => b.key === key);
  if (idx > -1) v2.splice(idx, 1);
  lsSet('bookmarks_v2', v2);
  // Remove from old bookmarks too
  const bk = lsGet('bookmarks', {});
  if (bk[key]) { delete bk[key]; lsSet('bookmarks', bk); }
  renderBkPanel(); updateBkNavBadge();
  showToast('🗑️ Bookmark removed', 'info');
}

function clearAllBookmarks() {
  if (!confirm('Remove all bookmarks? This cannot be undone.')) return;
  lsSet('bookmarks_v2', []);
  lsSet('bookmarks', {});
  renderBkPanel(); updateBkNavBadge();
  showToast('🗑️ All bookmarks cleared', 'info');
}

function updateBkNavBadge() {
  const v2 = lsGet('bookmarks_v2', []);
  const count = v2.length;
  document.querySelectorAll('.bk-count-badge').forEach(el => {
    el.textContent = count > 0 ? (count > 99 ? '99+' : count) : '';
    el.setAttribute('data-count', count);
  });
}
function markItemComplete(id, title, type) {
  if (!id) return;
  const key = currentSemKey + '_' + currentCode + '_' + id;
  const done = lsGet('mat_completed', {});
  done[key] = !done[key];
  lsSet('mat_completed', done);

  if (done[key]) {
    scheduleRevision(currentSemNum, currentCode, currentSubject?.name || currentCode, title, type);
    showToast('✅ ' + title + ' complete! Revisions scheduled.', 'success');
  } else {
    showToast('↩️ ' + title + ' marked incomplete', 'info');
  }
  renderCurrentTab();
  
  // Auto-check if all materials are done to suggest marking subject complete
  checkSubjectAutoCompletion();
}

function checkSubjectAutoCompletion() {
  const keyPrefix = currentSemKey + '_' + currentCode + '_';
  const doneMats = lsGet('mat_completed', {});
  const doneCount = Object.keys(doneMats).filter(k => k.startsWith(keyPrefix) && doneMats[k]).length;
  
  // If user has done 3+ materials, encourage marking subject complete
  if (doneCount >= 3) {
    const subKey = currentSemKey + '_' + currentCode;
    const subDone = lsGet('completed', {});
    if (!subDone[subKey]) {
      // Potentially show a subtle hint
    }
  }
}

function scheduleRevision(semNum, code, subjectName, title, tab = 'notes') {
  const revs = lsGet('revisions', []);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  [1, 3, 7].forEach(days => {
    const d = new Date(today); d.setDate(d.getDate() + days);
    revs.push({ id: genId(), sem: semNum, semKey: 'Semester' + semNum, code, subjectName, title, tab, nextDate: d.toISOString(), done: false });
  });
  lsSet('revisions', revs);
}

function ttsPlay() {
  const items = allMaterials[currentTab] || [];
  if (!items.length) { showToast('No content to read.', 'error'); return; }
  if (!('speechSynthesis' in window)) { showToast('TTS not supported.', 'error'); return; }
  window.speechSynthesis.cancel();
  ttsUtterance = new SpeechSynthesisUtterance(items.map(m => (m.title || '') + '. ' + (m.description || '')).join('. '));
  ttsUtterance.lang = 'en-IN'; ttsUtterance.rate = 0.9;
  ttsUtterance.onstart = () => {
    const g = id => document.getElementById(id);
    if (g('ttsPlayBtn')) g('ttsPlayBtn').style.display = 'none';
    if (g('ttsPauseBtn')) g('ttsPauseBtn').style.display = 'inline';
    if (g('ttsStopBtn')) g('ttsStopBtn').style.display = 'inline';
    if (g('ttsStatus')) g('ttsStatus').textContent = '🔊 Reading...';
  };
  ttsUtterance.onend = ttsStop; ttsUtterance.onerror = ttsStop;
  window.speechSynthesis.speak(ttsUtterance);
}
function ttsPause() {
  if (!('speechSynthesis' in window)) return;
  const s = document.getElementById('ttsStatus');
  if (window.speechSynthesis.paused) { window.speechSynthesis.resume(); if (s) s.textContent = '🔊 Reading...'; }
  else { window.speechSynthesis.pause(); if (s) s.textContent = '⏸ Paused'; }
}
function ttsStop() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  const g = id => document.getElementById(id);
  if (g('ttsPlayBtn')) g('ttsPlayBtn').style.display = 'inline';
  if (g('ttsPauseBtn')) g('ttsPauseBtn').style.display = 'none';
  if (g('ttsStopBtn')) g('ttsStopBtn').style.display = 'none';
  if (g('ttsStatus')) g('ttsStatus').textContent = '';
}

function toggleExamMode() {
  document.body.classList.toggle('exam-mode');
  const bar = document.getElementById('examModeBar');
  const on = document.body.classList.contains('exam-mode');
  if (bar) bar.style.display = on ? 'block' : 'none';
  showToast(on ? '🎯 Exam Mode ON' : '🎯 Exam Mode OFF', 'info');
}

let studyTabs = [];
function initStudyTabs() {
  studyTabs = lsGet('studyTabs', []);
  const cur = { code: currentCode, name: currentSubject?.name || currentCode, sem: currentSemNum };
  if (!studyTabs.find(t => t.code === currentCode)) {
    studyTabs.push(cur); if (studyTabs.length > 6) studyTabs.shift(); lsSet('studyTabs', studyTabs);
  }
  renderStudyTabs();
}
function renderStudyTabs() {
  const lst = document.getElementById('openTabsList'); if (!lst) return;
  lst.innerHTML = studyTabs.map(t => `<span class="study-tab-chip${t.code === currentCode ? ' active' : ''}" onclick="location.href='subject.html?sem=${t.sem}&code=${t.code}'">${t.code} <span class="close-tab" onclick="event.stopPropagation();removeStudyTab('${t.code}')">✕</span></span>`).join('');
}
function addStudyTab() { location.href = 'semester.html?sem=' + currentSemNum; }
function removeStudyTab(code) {
  studyTabs = studyTabs.filter(t => t.code !== code); lsSet('studyTabs', studyTabs);
  if (code === currentCode && studyTabs.length > 0) location.href = 'subject.html?sem=' + studyTabs[0].sem + '&code=' + studyTabs[0].code;
  else renderStudyTabs();
}

function loadAnnotations() {
  const key = 'ann_' + currentSemKey + '_' + currentCode;
  const anns = lsGet(key, []);
  const c = document.getElementById('savedAnnotations'); if (!c) return;
  c.innerHTML = anns.length === 0 ? '<p style="font-size:0.82rem;color:var(--text-muted);padding:10px 14px;">No annotations yet.</p>'
    : anns.map(a => `<div class="annotation-item"><div class="ann-text">${a.text}</div><div class="ann-date">${formatDate(a.date)}</div></div>`).join('');
}
function openAnnotation() { const p = document.getElementById('annotationPanel'); if (p) p.style.display = p.style.display === 'block' ? 'none' : 'block'; }
function closeAnnotation() { const p = document.getElementById('annotationPanel'); if (p) p.style.display = 'none'; }
function saveAnnotation() {
  const txt = document.getElementById('annotationText')?.value.trim(); if (!txt) return;
  const key = 'ann_' + currentSemKey + '_' + currentCode;
  const anns = lsGet(key, []); anns.unshift({ id: genId(), text: txt, date: Date.now() }); lsSet(key, anns);
  document.getElementById('annotationText').value = ''; loadAnnotations(); showToast('✏️ Saved!', 'success');
}

let imgZoom = 1;
function openImageViewer(url, title) {
  imgZoom = 1;
  const img = document.getElementById('viewerImg');
  if (img) { img.src = url; img.style.transform = 'scale(1)'; }
  const ttl = document.getElementById('imageViewerTitle'); if (ttl) ttl.textContent = title || 'Image';
  document.getElementById('imageViewerModal')?.classList.add('active');
}
function closeImageViewer() { document.getElementById('imageViewerModal')?.classList.remove('active'); }
function zoomImage(delta) { imgZoom = Math.max(0.2, Math.min(4, imgZoom + delta)); const img = document.getElementById('viewerImg'); if (img) img.style.transform = 'scale(' + imgZoom + ')'; }

// ============================================================
// VIDEO PLAYER (External Redirection)
// ============================================================
function openVideoPlayer(url, title) {
  if (!url) return;
  showToast('🚀 Opening Video Externally...', 'info');
  setTimeout(() => {
    window.open(url, '_blank');
  }, 400);
}
function closeVideoPlayer() { /* Modal removed */ }

function showRandomQuestion() {
  const pyqs = (allMaterials.pyq || []).map(m => ({ q: m.title, a: m.description || 'See linked material.' }));
  const pool = [...SAMPLE_QUESTIONS, ...pyqs];
  if (!pool.length) { showToast('No questions available.', 'error'); return; }
  const q = pool[Math.floor(Math.random() * pool.length)];
  const body = document.getElementById('randomQBody');
  if (body) body.innerHTML = `<div class="challenge-q">${q.q}</div><details style="margin-top:14px;padding:14px;background:rgba(79,70,229,0.07);border-radius:var(--radius-sm);"><summary style="cursor:pointer;font-weight:600;color:var(--primary);">💡 Reveal Answer</summary><p style="margin-top:10px;">${q.a}</p></details>`;
  document.getElementById('randomQModal')?.classList.add('active');
}

function copyToClipboard(text) {
  if (!text) { showToast('Nothing to copy.', 'error'); return; }
  const fb = () => { const ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(ta); ta.focus(); ta.select(); try { document.execCommand('copy'); showToast('📋 Copied!', 'success'); } catch { showToast('Copy failed.', 'error'); } document.body.removeChild(ta); };
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(() => showToast('📋 Copied!', 'success')).catch(fb);
  else fb();
}

function addDefinitionListeners(container) {
  const popup = document.getElementById('definitionPopup'); if (!popup) return;
  container.addEventListener('mouseup', e => {
    const sel = window.getSelection()?.toString().trim().toLowerCase();
    if (sel && sel.length > 2 && sel.length < 20 && DEFINITIONS[sel]) {
      popup.innerHTML = '<strong>' + sel.charAt(0).toUpperCase() + sel.slice(1) + '</strong>' + DEFINITIONS[sel];
      popup.style.left = Math.min(e.pageX, window.innerWidth - 300) + 'px';
      popup.style.top = (e.pageY + 14) + 'px'; popup.style.display = 'block';
    } else popup.style.display = 'none';
  });
  document.addEventListener('mousedown', e => { if (!e.target.closest('#definitionPopup')) popup.style.display = 'none'; });
}

function printNotes() { window.print(); }

// ============================================================
// ============================================================
// 25. EXPORT / IMPORT
// ============================================================
function exportData() {
  const data = { completed: lsGet('completed', {}), bookmarks: lsGet('bookmarks', {}), bookmarks_v2: lsGet('bookmarks_v2', []), revisions: lsGet('revisions', []), suggestions: lsGet('suggestions', []), annotations: {}, visits: lsGet('visits', {}), exportDate: new Date().toISOString() };
  Object.keys(SUBJECTS).forEach(sk => SUBJECTS[sk].forEach(s => { const k = 'ann_' + sk + '_' + s.code; const a = lsGet(k, []); if (a.length > 0) data.annotations[k] = a; }));
  const b = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = 'bca-store-data.json'; a.click(); URL.revokeObjectURL(u);
  showToast('📥 Data exported!', 'success');
}
function importData(event) {
  const f = event.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = e => {
    try {
      const d = JSON.parse(e.target.result);
      if (d.completed) lsSet('completed', d.completed); if (d.bookmarks) lsSet('bookmarks', d.bookmarks);
      if (d.bookmarks_v2) lsSet('bookmarks_v2', d.bookmarks_v2);
      if (d.revisions) lsSet('revisions', d.revisions); if (d.suggestions) lsSet('suggestions', d.suggestions);
      if (d.visits) lsSet('visits', d.visits);
      if (d.annotations) Object.keys(d.annotations).forEach(k => lsSet(k, d.annotations[k]));
      showToast('📤 Imported!', 'success'); setTimeout(() => location.reload(), 1500);
    } catch { showToast('❌ Invalid file.', 'error'); }
  }; r.readAsText(f);
}

// ============================================================
// 26. MINI CHALLENGE (REVAMPED)
// ============================================================
const CHALLENGE_BANK = {
  "GENERAL": [
    // Day 0 (Sunday)
    [
      { q: "What is the brain of the computer?", o: ["CPU", "RAM", "HDD", "GPU"], a: 0 },
      { q: "Which of these is an input device?", o: ["Monitor", "Printer", "Keyboard", "Speaker"], a: 2 },
      { q: "1 Byte is equal to how many bits?", o: ["4 bits", "8 bits", "16 bits", "32 bits"], a: 1 },
      { q: "What does HTTP stand for?", o: ["Hyper Text Transfer Protocol", "High Tech Transfer Process", "Hyper Terminal Transfer Protocol", "None"], a: 0 },
      { q: "Which language is used for web styling?", o: ["HTML", "Java", "PHP", "CSS"], a: 3 }
    ],
    // Day 1 (Monday)
    [
      { q: "Who is the father of C language?", o: ["James Gosling", "Dennis Ritchie", "Bjarne Stroustrup", "Guido van Rossum"], a: 1 },
      { q: "Which of these is volatile memory?", o: ["ROM", "HDD", "RAM", "SSD"], a: 2 },
      { q: "What is the full form of RAM?", o: ["Read Access Memory", "Random Access Memory", "Ready Auto Memory", "None"], a: 1 },
      { q: "Which is the smallest unit of data?", o: ["Bit", "Byte", "KB", "Nibble"], a: 0 },
      { q: "What is Linux?", o: ["Hardware", "Operating System", "Compiler", "Editor"], a: 1 }
    ],
    // Day 2 (Tuesday)
    [
      { q: "What does HTML stand for?", o: ["Hyper Tool Markup Language", "Hyper Text Markup Language", "High Text Machine Language", "None"], a: 1 },
      { q: "Which symbol is used for comments in C?", o: ["//", "#", "--", "%%"], a: 0 },
      { q: "What is a compiler?", o: ["Translates code to machine language", "Executes code line by line", "Fixes bugs", "None"], a: 0 },
      { q: "Which of these is an OOP concept?", o: ["Function", "Recursion", "Inheritance", "Looping"], a: 2 },
      { q: "What is the extension of a Java file?", o: [".jv", ".java", ".js", ".class"], a: 1 }
    ],
    // Day 3 (Wednesday)
    [
      { q: "What is the full form of SQL?", o: ["Simple Query Language", "Structured Query Language", "System Query Language", "None"], a: 1 },
      { q: "Which logic gate is known as universal gate?", o: ["AND", "OR", "NAND", "NOT"], a: 2 },
      { q: "What is a database?", o: ["Collection of hardware", "Organized collection of data", "A type of code", "None"], a: 1 },
      { q: "Which tag is used for links in HTML?", o: ["<link>", "<a>", "<href>", "<url>"], a: 1 },
      { q: "What is the base of Binary number system?", o: ["10", "8", "2", "16"], a: 2 }
    ],
    // Day 4 (Thursday)
    [
      { q: "What is the extension of C++ files?", o: [".c", ".cp", ".cpp", ".cxx"], a: 2 },
      { q: "Which of these is a social network?", o: ["Google", "Facebook", "Amazon", "Intel"], a: 1 },
      { q: "What is IP address used for?", o: ["To identify device on network", "To store data", "To speed up PC", "None"], a: 0 },
      { q: "Full form of WWW?", o: ["World Wide Web", "World Word Web", "Web World Wide", "None"], a: 0 },
      { q: "Which is a permanent storage?", o: ["RAM", "ROM", "Cache", "Register"], a: 1 }
    ],
    // Day 5 (Friday)
    [
      { q: "What is the result of 10 % 3 in C?", o: ["3", "1", "0", "10"], a: 1 },
      { q: "Which of these is a search engine?", o: ["Chrome", "Google", "Safari", "Windows"], a: 1 },
      { q: "What does PDF stand for?", o: ["Portable Document Format", "Print Document File", "Public Data Format", "None"], a: 0 },
      { q: "What is the brain of OS?", o: ["Shell", "Kernel", "UI", "API"], a: 1 },
      { q: "Which CSS property changes text color?", o: ["font-color", "text-style", "color", "background-color"], a: 2 }
    ],
    // Day 6 (Saturday)
    [
      { q: "What is a 4-bit data called?", o: ["Byte", "Nibble", "Chunk", "Word"], a: 1 },
      { q: "Who created Java?", o: ["James Gosling", "Dennis Ritchie", "Bill Gates", "Steve Jobs"], a: 0 },
      { q: "Which of these is an primary memory?", o: ["Pen drive", "Hard disk", "RAM", "CD-ROM"], a: 2 },
      { q: "Full form of URL?", o: ["Uniform Resource Locator", "Universal Radio Link", "Unique Resource Line", "None"], a: 0 },
      { q: "What is 2 in binary?", o: ["01", "10", "11", "00"], a: 1 }
    ]
  ],
  "BCA-104": [ // C Programming
    { q: "Which is used to take input in C?", o: ["printf", "scanf", "gets", "input"], a: 1 },
    { q: "Size of 'int' in 32-bit system?", o: ["1 byte", "2 bytes", "4 bytes", "8 bytes"], a: 2 },
    { q: "C language is a ______ language.", o: ["Low-level", "High-level", "Middle-level", "Machine-level"], a: 2 },
    { q: "Which keyword is used to exit a loop?", o: ["stop", "exit", "break", "return"], a: 2 },
    { q: "Header file for printf?", o: ["stdio.h", "conio.h", "math.h", "string.h"], a: 0 }
  ],
  "BCA-302": [ // DBMS
    { q: "What is the full form of DBMS?", o: ["Data Base Management System", "Data Bank Management System", "Database Master System", "None"], a: 0 },
    { q: "Which level of abstraction is closest to user?", o: ["Physical", "Logical", "View", "Internal"], a: 2 },
    { q: "What is a Row called in a table?", o: ["Attribute", "Tuple", "Field", "Entity"], a: 1 },
    { q: "SQL is a ______ language.", o: ["Procedural", "Non-procedural", "Low-level", "None"], a: 1 },
    { q: "Which key uniquely identifies a record?", o: ["Foreign Key", "Primary Key", "Candidate Key", "Super Key"], a: 1 }
  ]
};

let challengeQuestions = [], challengeIndex = 0, challengeScore = 0;

function openChallenge() {
  const body = document.getElementById('challengeBody');
  const footer = document.getElementById('challengeFooter');
  if (!body || !footer) return;

  challengeScore = 0; challengeIndex = 0;
  document.getElementById('challengeModal')?.classList.add('active');

  body.innerHTML = `
    <div style="text-align:center;">
      <h3 style="margin-bottom:16px;">Step 1: Select Semester</h3>
      <div class="challenge-sem-grid">
        ${[1, 2, 3, 4, 5, 6].map(n => `<button class="challenge-sem-btn" onclick="selectChallengeSemester(${n})">Semester ${n}</button>`).join('')}
      </div>
      <p style="margin-top:20px; font-size:0.85rem; color:var(--text-muted);">Try a daily challenge based on your semester topics!</p>
    </div>
  `;
  footer.innerHTML = `<button class="btn-outline" onclick="closeChallenge()">Exit</button>`;
}

function selectChallengeSemester(semNum) {
  const body = document.getElementById('challengeBody');
  if (!body) return;
  const semKey = 'Semester' + semNum;
  const subs = SUBJECTS[semKey] || [];

  body.innerHTML = `
    <div style="text-align:center;">
      <h3 style="margin-bottom:16px;">Step 2: Select Subject</h3>
      <div class="challenge-sub-grid">
        <button class="challenge-sub-btn general" onclick="startChallenge('GENERAL')">🌟 General BCA Topics</button>
        ${subs.map(s => `<button class="challenge-sub-btn" onclick="startChallenge('${s.code}')">${s.icon} ${s.name}</button>`).join('')}
      </div>
      <button class="btn-sm" style="margin-top:16px;" onclick="openChallenge()">⬅ Back</button>
    </div>
  `;
}

function startChallenge(subCode) {
  const dayIndex = new Date().getDay(); // 0-6
  let pool = [];

  if (subCode === 'GENERAL') {
    pool = CHALLENGE_BANK.GENERAL[dayIndex];
  } else {
    pool = CHALLENGE_BANK[subCode] || CHALLENGE_BANK.GENERAL[dayIndex];
  }

  challengeQuestions = pool;
  challengeIndex = 0;
  challengeScore = 0;
  renderChallengeQuestion();
}

function closeChallenge() { document.getElementById('challengeModal')?.classList.remove('active'); }

function renderChallengeQuestion() {
  const body = document.getElementById('challengeBody');
  const footer = document.getElementById('challengeFooter');
  if (!body || !footer) return;
  if (challengeIndex >= challengeQuestions.length) { renderChallengeScore(); return; }

  const q = challengeQuestions[challengeIndex];
  body.innerHTML = `
    <div class="challenge-progress-container">
      <div class="challenge-step">Question ${challengeIndex + 1} of ${challengeQuestions.length}</div>
      <div class="challenge-score-badge">Score: ${challengeScore}</div>
    </div>
    <div class="challenge-q">${q.q}</div>
    <div class="challenge-options">
      ${q.o.map((opt, i) => `
        <button class="challenge-opt-btn" onclick="handleChallengeAnswer(${i})">
          <span class="opt-prefix">${String.fromCharCode(65 + i)}</span>
          <span class="opt-text">${opt}</span>
        </button>
      `).join('')}
    </div>
  `;
  footer.innerHTML = `<button class="btn-outline" onclick="closeChallenge()">Quit</button>`;
}

function handleChallengeAnswer(selectedIdx) {
  const q = challengeQuestions[challengeIndex];
  const btns = document.querySelectorAll('.challenge-opt-btn');
  
  // Disable all buttons
  btns.forEach(b => b.style.pointerEvents = 'none');

  if (selectedIdx === q.a) {
    challengeScore++;
    btns[selectedIdx].classList.add('correct');
    showToast('✨ Correct!', 'success');
  } else {
    btns[selectedIdx].classList.add('wrong');
    btns[q.a].classList.add('correct');
    showToast('❌ In-correct!', 'error');
  }

  setTimeout(() => {
    challengeIndex++;
    renderChallengeQuestion();
  }, 1000);
}

function renderChallengeScore() {
  const body = document.getElementById('challengeBody');
  const footer = document.getElementById('challengeFooter');
  if (!body || !footer) return;
  const pct = Math.round(challengeScore / challengeQuestions.length * 100);
  const badge = pct === 100 ? '👑 Unstoppable!' : pct >= 80 ? '🏆 Expert!' : pct >= 60 ? '🥈 Good Job!' : pct >= 40 ? '🥉 Keep Trying!' : '📚 More Practice!';
  
  body.innerHTML = `
    <div class="challenge-result">
      <div class="result-icon">${pct >= 60 ? '🎉' : '📖'}</div>
      <div class="score-num">${challengeScore}/${challengeQuestions.length}</div>
      <p style="color:var(--text-muted);margin-top:8px;">${pct}% correct</p>
      <div class="challenge-badge">${badge}</div>
    </div>
  `;
  footer.innerHTML = `
    <button class="btn-outline" onclick="closeChallenge()">Close</button>
    <button class="btn-primary" onclick="openChallenge()">🔄 Restart</button>
  `;

  // Save score (existing logic)
  const scores = lsGet('challengeScores', []);
  scores.unshift({ score: challengeScore, total: challengeQuestions.length, date: Date.now() });
  lsSet('challengeScores', scores.slice(0, 20));
}

// ============================================================
// 27. ADMIN
// ============================================================
function adminLogin() {
  const emailOrUser = document.getElementById('adminEmail')?.value.trim().toLowerCase();
  const pass = document.getElementById('adminPassword')?.value;
  const loginBtn = document.getElementById('loginBtn');
  const btnLoader = document.getElementById('btnLoader');
  const err = document.getElementById('loginError');

  if (!emailOrUser || !pass) {
    if (err) { err.style.display = 'flex'; document.getElementById('errorText').textContent = 'Please fill in all fields.'; }
    return;
  }

  // Show loading state
  if (loginBtn) loginBtn.style.opacity = '0.7';
  if (btnLoader) btnLoader.style.display = 'block';
  const btnText = document.getElementById('btn-text');
  if (btnText) btnText.style.opacity = '0';
  if (err) err.style.display = 'none';

  // Simulate authentication delay for premium feel
  setTimeout(() => {
    // Admin Credentials
    const ve = atob('MTA3MTd2aXNoYWxAZ21haWwuY29t');
    const vp = atob('VmlzaGFsQEAyMDA0');
    
    // Staff Credentials 1
    const su1 = 'vishal@@bca2'.toLowerCase();
    const sp1 = 'BCA@LND';
    
    // Staff Credentials 2
    const su2 = 'cr@lnd'.toLowerCase();
    const sp2 = 'Admin@#10717';

    // Reset loading state
    if (loginBtn) loginBtn.style.opacity = '1';
    if (btnLoader) btnLoader.style.display = 'none';
    const btnText = document.getElementById('btn-text');
    if (btnText) btnText.style.opacity = '1';

    if (emailOrUser === ve.toLowerCase() && pass === vp) {
      lsSet('adminAuth', { token: genId(), exp: Date.now() + 3600000, role: 'admin' });
      document.getElementById('adminLoginGate').style.display = 'none';
      document.body.classList.remove('login-active');
      const extras = document.getElementById('adminExtras');
      if (extras) extras.style.display = 'block';
      const ap = document.getElementById('adminPanel');
      if (ap) {
        ap.style.display = 'flex'; // adm-shell uses flex
        ap.classList.add('adm-shell');
      }
      applyRoleBasedAccess('admin');
      loadInboxBadge(); loadManageMaterials(); loadAnalytics();
      showAdminWelcome('Admin');
    } else if ((emailOrUser === su1 && pass === sp1) || (emailOrUser === su2 && pass === sp2)) {
      lsSet('adminAuth', { token: genId(), exp: Date.now() + 3600000, role: 'staff' });
      document.getElementById('adminLoginGate').style.display = 'none';
      document.body.classList.remove('login-active');
      const extras = document.getElementById('adminExtras');
      if (extras) extras.style.display = 'block';
      const ap = document.getElementById('adminPanel');
      if (ap) {
        ap.style.display = 'flex';
        ap.classList.add('adm-shell');
      }
      applyRoleBasedAccess('staff');
      showAdminWelcome('Staff');
    } else {
      if (err) {
        err.style.display = 'flex';
        document.getElementById('errorText').textContent = 'Invalid credentials. Please try again.';
      }
      const p = document.getElementById('adminPassword'); if (p) p.value = '';
    }
  }, 800);
}

function applyRoleBasedAccess(role) {
  const adminTabs = ['manage', 'inbox', 'analytics', 'visitors'];
  adminTabs.forEach(tab => {
    const btn = document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1));
    if (btn) btn.style.display = role === 'admin' ? 'inline-block' : 'none';
  });
  
  // If staff, make sure they are on a tab they can see
  if (role === 'staff') {
    switchAdminTab('add');
  }
}


function showAdminWelcome(userRole = 'Chief') {
  // Create premium welcome overlay
  const overlay = document.createElement('div');
  overlay.className = 'admin-welcome-overlay';
  overlay.innerHTML = `
    <div class="admin-welcome-card glass-card">
      <div class="admin-welcome-icon">👑</div>
      <h2 class="admin-welcome-title">System Access Granted</h2>
      <p class="admin-welcome-subtitle">Welcome back, ${userRole}! Everything is ready for you.</p>
      <div class="admin-welcome-stats">
        <div class="stat-item">
          <span class="stat-val" id="welcomeUnreadCount">...</span>
          <span class="stat-label">Unread Inbox</span>
        </div>
        <div class="stat-item">
          <span class="stat-val" id="welcomeTotalVisits">...</span>
          <span class="stat-label">Total Visits</span>
        </div>
      </div>
      <button class="btn-primary" style="width:100%;" onclick="this.parentElement.parentElement.remove()">Proceed to Dashboard 🚀</button>
    </div>
    <div id="adminConfetti"></div>
  `;
  document.body.appendChild(overlay);

  // Sync visits in the card
  if (db) {
    db.ref('site_stats/totalVisits').once('value', snap => {
      const el = document.getElementById('welcomeTotalVisits');
      if (el) el.textContent = (snap.val() || 0).toLocaleString();
    });
  }

  // Launch confetti
  launchAdminConfetti();

  // Fetch real-time unread count for welcome screen
  if (db) {
    db.ref('suggestions').once('value', snap => {
      let unread = 0;
      snap.forEach(c => { if (!c.val().read) unread++; });
      const el = document.getElementById('welcomeUnreadCount');
      if (el) el.textContent = unread;
    });
  }

  // Auto-remove after 5 seconds if not clicked
  setTimeout(() => { if (overlay.parentElement) overlay.remove(); }, 5000);
}

function launchAdminConfetti() {
  const c = document.getElementById('adminConfetti'); if (!c) return;
  const cols = ['#4F46E5', '#9333EA', '#22C55E', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4'];
  for (let i = 0; i < 100; i++) {
    const p = document.createElement('div'); p.className = 'confetti-piece';
    p.style.cssText = `
      left:${Math.random() * 100}%;
      top:${Math.random() * -20}%;
      background:${cols[Math.floor(Math.random() * cols.length)]};
      width:${6 + Math.random() * 12}px;
      height:${6 + Math.random() * 12}px;
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      animation: adminConfettiFall ${2 + Math.random() * 3}s linear forwards;
      animation-delay: ${Math.random() * 2}s;
    `;
    c.appendChild(p);
  }
}
function adminLogout() {
  lsSet('adminAuth', null);
  document.getElementById('adminLoginGate').style.display = 'flex';
  document.body.classList.add('login-active');
  const extras = document.getElementById('adminExtras');
  if (extras) extras.style.setProperty('display', 'none', 'important');
  document.getElementById('adminPanel').style.display = 'none';
  const e = document.getElementById('adminEmail'); if (e) e.value = '';
  const p = document.getElementById('adminPassword'); if (p) p.value = '';
}
function togglePassView() { 
  const inp = document.getElementById('adminPassword'); 
  if (inp) inp.type = inp.type === 'password' ? 'text' : 'password'; 
  const eyeOpen = document.getElementById('eye-open');
  const eyeClosed = document.getElementById('eye-closed');
  if (eyeOpen && eyeClosed) {
    eyeOpen.classList.toggle('hidden');
    eyeClosed.classList.toggle('hidden');
  }
}

function initAdminPage() {
  initDarkMode(); initNavbar(); initVisitCounter();
  const auth = lsGet('adminAuth');
  if (auth && auth.exp > Date.now()) {
    document.getElementById('adminLoginGate').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    applyRoleBasedAccess(auth.role || 'admin');
    loadInboxBadge(); loadManageMaterials(); loadAnalytics();

    // Dynamic Greeting
    const greetingLabel = document.getElementById('adminGreetingLabel');
    const now = new Date();
    const hour = now.getHours();
    let greetingText = "GOOD DAY";
    if (hour < 12) greetingText = "GOOD MORNING";
    else if (hour < 17) greetingText = "GOOD AFTERNOON";
    else greetingText = "GOOD EVENING";
    if (greetingLabel) greetingLabel.textContent = greetingText;
  }
  ['adminEmail', 'adminPassword'].forEach(id => document.getElementById(id)?.addEventListener('keydown', e => { if (e.key === 'Enter') adminLogin(); }));
}

function switchAdminTab(tab) {
  // Hide all sections and deactivate sidebar items
  ['dashboard', 'add', 'manage', 'inbox', 'analytics', 'visitors', 'notifications', 'community'].forEach(t => {
    const el = document.getElementById('admin-tab-' + t);
    if (el) { el.style.display = 'none'; el.classList.remove('active'); }
    const btn = document.getElementById('tab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (btn) btn.classList.remove('active');
  });
  // Show selected
  const active = document.getElementById('admin-tab-' + tab);
  if (active) { active.style.display = 'block'; active.classList.add('active'); }
  const activeBtn = document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1));
  if (activeBtn) activeBtn.classList.add('active');

  // Load tab data
  if (tab === 'inbox') loadInboxMessages();
  if (tab === 'manage') loadManageMaterials();
  if (tab === 'analytics') loadAnalytics();
  if (tab === 'visitors') loadVisitorsList();
  if (tab === 'notifications') loadAdminNotifications();
  if (tab === 'community' && typeof loadAdminCommunityTab === 'function') loadAdminCommunityTab();
  if (tab === 'dashboard') loadDashboardStats();

  // Close mobile sidebar
  closeAdmSidebar();
}

// Sidebar toggle functions
function toggleAdmSidebar() {
  const sb = document.getElementById('admSidebar');
  if (sb) sb.classList.toggle('collapsed');
}
function openAdmSidebar() {
  const sb = document.getElementById('admSidebar');
  if (sb) sb.classList.add('open');
}
function closeAdmSidebar() {
  const sb = document.getElementById('admSidebar');
  if (sb) sb.classList.remove('open');
}

// Dashboard stats loader
function loadDashboardStats() {
  if (!db) return;
  db.ref('materials').once('value', snap => {
    let count = 0;
    if (snap.exists()) snap.forEach(sem => { sem.forEach(sub => { sub.forEach(() => count++); }); });
    const el = document.getElementById('dashTotalMaterials');
    if (el) el.textContent = count;
  });
  db.ref('site_stats/totalVisits').once('value', snap => {
    const el = document.getElementById('dashTotalVisitors');
    if (el) el.textContent = (snap.val() || 0).toLocaleString();
  });
  db.ref('suggestions').once('value', snap => {
    const el = document.getElementById('dashTotalInbox');
    if (el) el.textContent = snap.numChildren() || 0;
  });
  db.ref('site_stats/totalEnrolled').once('value', snap => {
    const el = document.getElementById('dashTotalEnrolled');
    if (el) el.textContent = (snap.val() || 0).toLocaleString();
  });
}

// Admin clock
function updateAdmClock() {
  const el = document.getElementById('admClock');
  if (el) el.textContent = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateAdmClock, 30000);

// Ctrl+K shortcut
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const input = document.getElementById('admGlobalSearch');
    if (input) input.focus();
  }
});
// STAFF PANEL LOGIC
// ============================================================
function staffLogin() {
  const user = document.getElementById('staffUsername')?.value.trim();
  const pass = document.getElementById('staffPassword')?.value;
  
  // Credentials as requested
  if (user === 'VISHAL@@BCA2' && pass === 'BCA@LND') {
    lsSet('staffAuth', { token: genId(), exp: Date.now() + 3600000 });
    document.getElementById('staffLoginGate').style.display = 'none';
    document.getElementById('staffPanel').style.display = 'block';
    loadStaffNotifications();
    showToast('✅ Welcome, Staff Member!', 'success');
  } else {
    const err = document.getElementById('staffLoginError'); if (err) err.style.display = 'block';
    const p = document.getElementById('staffPassword'); if (p) p.value = '';
  }
}

function staffLogout() {
  lsSet('staffAuth', null);
  location.reload();
}

function toggleStaffPassView() { 
  const inp = document.getElementById('staffPassword'); 
  if (inp) inp.type = inp.type === 'password' ? 'text' : 'password'; 
}

function initStaffPage() {
  initDarkMode(); initNavbar();
  const auth = lsGet('staffAuth');
  if (auth && auth.exp > Date.now()) {
    document.getElementById('staffLoginGate').style.display = 'none';
    document.getElementById('staffPanel').style.display = 'block';
    loadStaffNotifications();
  }
  ['staffUsername', 'staffPassword'].forEach(id => document.getElementById(id)?.addEventListener('keydown', e => { if (e.key === 'Enter') staffLogin(); }));
}

function switchStaffTab(tab) {
  ['add', 'notifications'].forEach(t => {
    const el = document.getElementById('staff-tab-' + t); if (el) el.style.display = t === tab ? 'block' : 'none';
    const btn = document.getElementById('tab' + t.charAt(0).toUpperCase() + t.slice(1)); if (btn) btn.classList.toggle('active', t === tab);
  });
  if (tab === 'notifications') loadStaffNotifications();
}

function loadStaffNotifications() {
  const list  = document.getElementById('staffNotifList');
  if (!list || !db) return;
  list.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
  db.ref('notifications').orderByChild('createdAt').limitToLast(10).on('value', snap => {
    if (!snap.exists()) {
      list.innerHTML = '<div class="empty-state"><h3>No Notifications</h3></div>';
      return;
    }
    let items = [];
    snap.forEach(child => items.push({ id: child.key, ...child.val() }));
    items.sort((a, b) => b.createdAt - a.createdAt);
    list.innerHTML = items.map(n => {
      const t = NOTIF_TYPES[n.type] || NOTIF_TYPES.info;
      return `<div class="admin-notif-item glass-card" style="border-left:4px solid ${t.color};">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
          <div style="flex:1;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
              <span class="notif-type-badge">${t.icon} ${t.label}</span>
              ${n.pinned ? '<span class="notif-pin-badge">📌 Pinned</span>' : ''}
              <span style="font-size:0.75rem;color:var(--text-muted);margin-left:auto;">${formatDate(n.createdAt)}</span>
            </div>
            <div style="font-weight:800;font-size:1rem;margin-bottom:4px;">${n.title}</div>
            <div style="font-size:0.88rem;color:var(--text-muted);">${n.message}</div>
          </div>
        </div>
      </div>`;
    }).join('');
  });
}

// ============================================================
// NOTIFICATION SYSTEM
// ============================================================
const NOTIF_TYPES = {
  info:   { label: 'Info',   color: '#3b82f6', icon: '🔵' },
  update: { label: 'Update', color: '#10b981', icon: '🟢' },
  exam:   { label: 'Exam',   color: '#f59e0b', icon: '🟡' },
  alert:  { label: 'Alert',  color: '#ef4444', icon: '🔴' }
};

function renderNotifications() {
  const section = document.getElementById('notificationsSection');
  const grid    = document.getElementById('notifCardsGrid');
  const ticker  = document.getElementById('notifTickerBar');
  const tickerContent = document.getElementById('notifTickerContent');
  const countPill = document.getElementById('notifCountPill');
  if (!section || !grid) return;

  if (!db) { section.style.display = 'none'; return; }

  firebase.database().ref('notifications').orderByChild('createdAt').on('value', snap => {
    if (!snap.exists()) { section.style.display = 'none'; return; }

    let list = [];
    snap.forEach(child => list.push({ id: child.key, ...child.val() }));
    list.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.createdAt - a.createdAt;
    });

    section.style.display = 'block';
    if (countPill) { countPill.textContent = list.length + (list.length === 1 ? ' Notice' : ' Notices'); countPill.style.display = 'inline-block'; }

    // Ticker for pinned items
    const pinned = list.filter(n => n.pinned);
    if (ticker && tickerContent) {
      if (pinned.length > 0) {
        ticker.style.display = 'flex';
        tickerContent.innerHTML = pinned.map(n => `<span class="notif-ticker-item">📌 ${n.title}: ${n.message}</span>`).join('<span class="notif-ticker-sep">•••</span>');
      } else {
        ticker.style.display = 'none';
      }
    }

    // Render cards
    grid.innerHTML = list.map(n => {
      const t = NOTIF_TYPES[n.type] || NOTIF_TYPES.info;
      return `<div class="notif-card notif-card-${n.type || 'info'}" style="--notif-color:${t.color};">
        <div class="notif-card-left"></div>
        <div class="notif-card-body">
          <div class="notif-card-top">
            <span class="notif-type-badge">${t.icon} ${t.label}</span>
            ${n.pinned ? '<span class="notif-pin-badge">📌 Pinned</span>' : ''}
            <span class="notif-date">${formatDate(n.createdAt)}</span>
          </div>
          <div class="notif-card-title">${n.title}</div>
          <div class="notif-card-msg">${n.message}</div>
        </div>
      </div>`;
    }).join('');
  });
}

function addNotification() {
  const title   = document.getElementById('notifTitle')?.value.trim();
  const message = document.getElementById('notifMessage')?.value.trim();
  const type    = document.getElementById('notifType')?.value || 'info';
  const pinned  = document.getElementById('notifPinned')?.checked || false;
  if (!title || !message) { showToast('❌ Title and message are required.', 'error'); return; }
  if (!db) { showToast('❌ Firebase not connected.', 'error'); return; }
  db.ref('notifications').push({ title, message, type, pinned, createdAt: Date.now() })
    .then(() => {
      showToast('📢 Notification posted!', 'success');
      document.getElementById('notifTitle').value = '';
      document.getElementById('notifMessage').value = '';
      document.getElementById('notifPinned').checked = false;
      if (document.getElementById('adminNotifList')) loadAdminNotifications();
      if (document.getElementById('staffNotifList')) loadStaffNotifications();
    })
    .catch(() => showToast('❌ Failed to post.', 'error'));
}

function deleteNotification(id) {
  if (!db) return;
  db.ref('notifications/' + id).remove()
    .then(() => { showToast('🗑️ Deleted!', 'success'); loadAdminNotifications(); })
    .catch(() => showToast('❌ Delete failed.', 'error'));
}

function clearAllNotifications() {
  if (!confirm('Delete ALL notifications? This cannot be undone.')) return;
  if (!db) return;
  db.ref('notifications').remove()
    .then(() => { showToast('🗑️ All notifications cleared!', 'success'); loadAdminNotifications(); })
    .catch(() => showToast('❌ Failed to clear.', 'error'));
}

function loadAdminNotifications() {
  const list  = document.getElementById('adminNotifList');
  const empty = document.getElementById('adminNotifEmpty');
  if (!list || !db) return;
  list.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
  db.ref('notifications').orderByChild('createdAt').on('value', snap => {
    if (!snap.exists()) {
      list.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';
    let items = [];
    snap.forEach(child => items.push({ id: child.key, ...child.val() }));
    items.sort((a, b) => b.createdAt - a.createdAt);
    list.innerHTML = items.map(n => {
      const t = NOTIF_TYPES[n.type] || NOTIF_TYPES.info;
      return `<div class="admin-notif-item glass-card" style="border-left:4px solid ${t.color};">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
          <div style="flex:1;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
              <span class="notif-type-badge">${t.icon} ${t.label}</span>
              ${n.pinned ? '<span class="notif-pin-badge">📌 Pinned</span>' : ''}
              <span style="font-size:0.75rem;color:var(--text-muted);margin-left:auto;">${formatDate(n.createdAt)}</span>
            </div>
            <div style="font-weight:800;font-size:1rem;margin-bottom:4px;">${n.title}</div>
            <div style="font-size:0.88rem;color:var(--text-muted);">${n.message}</div>
          </div>
          <button class="btn-danger" onclick="deleteNotification('${n.id}')" style="flex-shrink:0;">🗑️</button>
        </div>
      </div>`;
    }).join('');
  });
}

function updateSubjectDropdown(semId, subId) {
  const sk = document.getElementById(semId)?.value;
  const sel = document.getElementById(subId); if (!sel) return;
  sel.innerHTML = '<option value="">— Select Subject —</option>';
  (SUBJECTS[sk] || []).forEach(s => { const o = document.createElement('option'); o.value = s.code; o.textContent = s.code + ': ' + s.name; sel.appendChild(o); });
}

function addMaterial() {
  const semKey = document.getElementById('addSemester')?.value;
  const code = document.getElementById('addSubject')?.value;
  const type = document.getElementById('addType')?.value;
  const title = document.getElementById('addTitle')?.value.trim();
  const description = document.getElementById('addDescription')?.value.trim() || '';
  const link = document.getElementById('addLink')?.value.trim();
  if (!semKey || !code || !type || !title || !link) { showToast('❌ Fill all required fields.', 'error'); return; }
  const data = {
    type, title, description,
    link: link.trim(),
    createdAt: Date.now()
  };
  if (db) {
    const pushRef = firebase.database().ref('materials/' + semKey + '/' + code).push(data);
    showToast('✅ Added to Firebase!', 'success'); 
    clearAddForm(); 
    if (typeof loadManageMaterials === 'function') loadManageMaterials(); 
    if (typeof loadAnalytics === 'function') loadAnalytics();
    
    pushRef.catch((error) => {
      console.error("Firebase push error:", error);
      showToast('❌ Firebase Error: ' + error.message, 'error');
    });
  } else saveToLS(semKey, code, mat);
}
function saveToLS(semKey, code, mat) {
  const key = 'materials_' + semKey + '_' + code; const ex = lsGet(key, {}); const id = genId(); ex[id] = { ...mat, id }; lsSet(key, ex);
  showToast('✅ Saved locally!', 'success'); clearAddForm(); loadManageMaterials(); loadAnalytics();
}
function clearAddForm() { ['addSemester', 'addSubject', 'addType', 'addTitle', 'addDescription', 'addLink'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; }); }

let manageListenerRef = null;

function loadManageMaterials() {
  const fSem = document.getElementById('filterSem')?.value || '';
  const fType = document.getElementById('filterType')?.value || '';
  const fQ = (document.getElementById('manageSearch')?.value || '').toLowerCase();
  const cont = document.getElementById('manageMaterialsList');
  const emptyEl = document.getElementById('manageEmpty');
  if (!cont) return;
  
  if (manageListenerRef && db) {
    manageListenerRef.off('value');
    manageListenerRef = null;
  }
  
  cont.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
  const semKeys = fSem ? [fSem] : Object.keys(SUBJECTS);
  let items = [];
  semKeys.forEach(sk => SUBJECTS[sk]?.forEach(sub => {
    const k = 'materials_' + sk + '_' + sub.code;
    Object.values(lsGet(k, {})).forEach(item => {
      if ((!fType || item.type === fType) && (!fQ || item.title?.toLowerCase().includes(fQ)))
        items.push({ ...item, semKey: sk, code: sub.code, subjectName: sub.name });
    });
  }));
  if (db) {
    manageListenerRef = firebase.database().ref('materials');
    manageListenerRef.on('value', snap => {
      let fbItems = [...items];
      if (snap.exists()) {
        snap.forEach(skSnap => skSnap.forEach(subSnap => {
          const sk = skSnap.key, code = subSnap.key;
          const sub = SUBJECTS[sk]?.find(s => s.code === code);
          subSnap.forEach(child => {
            const item = { id: child.key, ...child.val(), semKey: sk, code, subjectName: sub?.name || code };
            if ((!fSem || sk === fSem) && (!fType || item.type === fType) && (!fQ || item.title?.toLowerCase().includes(fQ)))
              if (!fbItems.find(i => i.id === item.id)) fbItems.push(item);
          });
        }));
      }
      fbItems.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      renderManageList(fbItems, cont, emptyEl);
    }, (error) => {
      console.error("Firebase manage read error:", error);
      items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      renderManageList(items, cont, emptyEl);
    });
  } else {
    items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    renderManageList(items, cont, emptyEl);
  }
}

function renderManageList(items, cont, emptyEl) {
  if (!items.length) { cont.innerHTML = ''; if (emptyEl) emptyEl.style.display = 'block'; return; }
  if (emptyEl) emptyEl.style.display = 'none';
  cont.innerHTML = items.map(item => `<div class="manage-row">
    <div class="manage-row-info">
      <div class="manage-row-title">${item.title || 'Untitled'} ${typeBadge(item.type || 'notes')}</div>
      <div class="manage-row-meta">${item.semKey} › ${item.code} | 🕐 ${formatDate(item.timestamp)}</div>
      <div class="manage-row-meta"><a href="${item.link || '#'}" target="_blank" style="color:var(--primary);">🔗 ${(item.link || '').substring(0, 60)}</a></div>
    </div>
    <div class="manage-row-actions">
      <button class="btn-outline" data-item="${encodeURIComponent(JSON.stringify(item))}" onclick="openEditModal(JSON.parse(decodeURIComponent(this.getAttribute('data-item'))))">✏️ Edit</button>
      <button class="btn-danger" onclick="deleteMaterial('${item.semKey}','${item.code}','${item.id}')">🗑️</button>
    </div>
  </div>`).join('');
}

function openEditModal(item) {
  ['editId', 'editSemKey', 'editSubKey', 'editTitle', 'editDescription', 'editLink', 'editType'].forEach(id => {
    const el = document.getElementById(id); if (!el) return;
    if (id === 'editId') el.value = item.id || '';
    else if (id === 'editSemKey') el.value = item.semKey || '';
    else if (id === 'editSubKey') el.value = item.code || '';
    else if (id === 'editTitle') el.value = item.title || '';
    else if (id === 'editDescription') el.value = item.description || '';
    else if (id === 'editLink') el.value = item.link || '';
    else if (id === 'editType') el.value = item.type || 'notes';
  });
  document.getElementById('editModal')?.classList.add('active');
}
function closeEditModal() { document.getElementById('editModal')?.classList.remove('active'); }
function saveEditMaterial() {
  const id = document.getElementById('editId').value;
  const semKey = document.getElementById('editSemKey').value;
  const code = document.getElementById('editSubKey').value;
  const updates = { title: document.getElementById('editTitle').value.trim(), description: document.getElementById('editDescription').value.trim(), link: document.getElementById('editLink').value.trim(), type: document.getElementById('editType').value, timestamp: Date.now() };
  if (!updates.title || !updates.link) { showToast('❌ Title and Link required.', 'error'); return; }
  if (db) {
    firebase.database().ref('materials/' + semKey + '/' + code + '/' + id).update(updates).catch(() => updateLS(semKey, code, id, updates));
    showToast('✅ Updated!', 'success'); 
    closeEditModal(); 
    loadManageMaterials();
  } else updateLS(semKey, code, id, updates);
}
function updateLS(semKey, code, id, updates) {
  const key = 'materials_' + semKey + '_' + code; const ex = lsGet(key, {}); if (ex[id]) ex[id] = { ...ex[id], ...updates }; lsSet(key, ex);
  showToast('✅ Updated locally!', 'success'); closeEditModal(); loadManageMaterials();
}
function deleteMaterial(semKey, code, id) {
  if (!confirm('Delete this material?')) return;
  if (db) {
    firebase.database().ref('materials/' + semKey + '/' + code + '/' + id).remove().catch(() => deleteLS(semKey, code, id));
    showToast('🗑️ Deleted!', 'success'); 
    loadManageMaterials(); 
    loadAnalytics();
  } else deleteLS(semKey, code, id);
}
function deleteLS(semKey, code, id) {
  const key = 'materials_' + semKey + '_' + code; const ex = lsGet(key, {}); delete ex[id]; lsSet(key, ex);
  showToast('🗑️ Deleted locally!', 'success'); loadManageMaterials(); loadAnalytics();
}

function loadInboxBadge() {
  if (!db) return;
  db.ref('suggestions').off('value');
  db.ref('suggestions').on('value', snap => {
    let count = 0;
    snap.forEach(child => { if (!child.val().read) count++; });
    const b = document.getElementById('inboxBadge'); 
    if (b) { b.textContent = count; b.style.display = count > 0 ? 'inline' : 'none'; }
  });
}

function loadInboxMessages() {
  if (!db) return;
  const cont = document.getElementById('suggestionList'); 
  const emptyEl = document.getElementById('inboxEmpty'); 
  if (!cont) return;

  // Use .off() to prevent multiple listeners
  db.ref('suggestions').off('value');
  db.ref('visitors').off('value'); // Also listen to visitors for real-time presence

  db.ref('visitors').on('value', vSnap => {
    const visitors = vSnap.val() || {};
    
    db.ref('suggestions').on('value', snap => {
      if (!snap.exists()) { 
        cont.innerHTML = ''; 
        if (emptyEl) emptyEl.style.display = 'block'; 
        return; 
      }
      if (emptyEl) emptyEl.style.display = 'none';

      const suggs = [];
      snap.forEach(child => { suggs.unshift({ id: child.key, ...child.val() }); });

      cont.innerHTML = suggs.map(s => {
        const catClass = `badge-cat-${(s.category || 'general').toLowerCase().replace(' ', '-')}`;
        const msgs = s.messages ? Object.values(s.messages) : [];
        
        // Presence Check
        const visitor = visitors[s.visitorId] || {};
        const lastActive = visitor.lastActive || 0;
        const isOnline = Date.now() - lastActive < 60000;
        const statusHtml = isOnline 
          ? `<span class="status-indicator status-online"><span class="status-dot"></span> Online</span>`
          : `<span class="status-indicator status-offline">Last seen: ${formatDate(lastActive)}</span>`;

        return `
          <div class="suggestion-card ${s.read ? 'read' : 'unread'}">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap;">
              <span class="sugg-category-badge ${catClass}">${s.category || 'General'}</span>
              <div class="sugg-date">🕐 ${formatDate(s.date)}</div>
            </div>
            <div class="sugg-name">
              👤 ${s.name || 'Anonymous'}${!s.read ? ' <span class="new-badge">NEW</span>' : ''}
              ${statusHtml}
            </div>
            
            <div class="chat-thread" style="margin:12px 0; background:rgba(0,0,0,0.02); padding:10px; border-radius:8px;">
              ${msgs.map(m => `
                <div style="margin-bottom:8px; text-align:${m.sender === 'admin' ? 'right' : 'left'}">
                  <div style="display:inline-block; padding:8px 12px; border-radius:12px; font-size:0.9rem; 
                    background:${m.sender === 'admin' ? 'var(--primary)' : '#fff'}; 
                    color:${m.sender === 'admin' ? '#fff' : 'inherit'};
                    border:1px solid var(--border)">
                    ${m.text}
                  </div>
                  <div style="font-size:0.7rem; color:var(--text-muted); margin-top:2px;">${formatDate(m.date)}</div>
                </div>
              `).join('')}
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
              <div class="sugg-context" style="margin-top:0;">📍 Context: ${s.context || 'Unknown'}</div>
              <div class="sugg-ip" style="font-size:0.75rem; color:var(--text-muted);">🌐 IP: <code>${s.ip || 'Unknown'}</code></div>
            </div>
            <div class="sugg-actions">
              <button class="btn-primary btn-sm" onclick="sendAdminMessage('${s.id}')">💬 Reply</button>
              <button class="btn-outline btn-sm" onclick="toggleSuggRead('${s.id}', ${s.read})">${s.read ? '📬 Unread' : '✅ Read'}</button>
              <button class="btn-danger btn-sm" onclick="deleteSuggestion('${s.id}')">🗑️</button>
            </div>
          </div>`;
      }).join('');
    });
  });
}

function toggleSuggRead(id, current) {
  if (!db) return;
  db.ref('suggestions/' + id).update({ read: !current });
}

function deleteSuggestion(id) {
  if (!confirm('Delete this suggestion?')) return;
  if (!db) return;
  db.ref('suggestions/' + id).remove().then(() => showToast('🗑️ Deleted from cloud.', 'success'));
}

function markAllRead() {
  if (!db) return;
  db.ref('suggestions').once('value', snap => {
    const updates = {};
    snap.forEach(child => { updates[child.key + '/read'] = true; });
    db.ref('suggestions').update(updates).then(() => showToast('✅ All marked read', 'success'));
  });
}

function clearAllSuggestions() {
  if (!confirm('CAUTION: Delete ALL suggestions from cloud?')) return;
  if (!db) return;
  db.ref('suggestions').remove().then(() => showToast('🗑️ Inbox cleared', 'success'));
}

function loadAnalytics() {
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  if (!db) return;

  // 1. Core Material Stats (Local)
  let tot = 0, notes = 0, vids = 0, pyqs = 0;
  Object.keys(SUBJECTS).forEach(sk => SUBJECTS[sk].forEach(s => {
    const items = Object.values(lsGet('materials_' + sk + '_' + s.code, {}));
    tot += items.length; 
    notes += items.filter(i => i.type === 'notes').length; 
    vids += items.filter(i => i.type === 'video').length; 
    pyqs += items.filter(i => i.type === 'pyq').length;
  }));
  set('totalMaterials', tot); set('totalNotes', notes); set('totalVideos', vids); set('totalPYQs', pyqs);
  set('totalSuggestions', lsGet('suggestions', []).length);
  set('totalCompleted', Object.values(lsGet('completed', {})).filter(Boolean).length);

  // 2. Real-time stats from Firebase
  // Unique Visitors
  db.ref('visitors').on('value', snap => {
    set('totalUniqueVisitors', snap.numChildren());
  });

  // Total Enrolled (Real-time)
  db.ref('site_stats/totalEnrolled').on('value', snap => {
    set('totalEnrolled', snap.val() || 0);
  });

  // Views & Interactions
  db.ref('stats').on('value', snap => {
    const data = snap.val() || {};
    const views = data.views || {};
    const interactions = data.interactions || {};

    // Calculate Total Interactions
    const totalInteractions = Object.values(interactions).reduce((a, b) => a + b, 0);
    set('totalInteractions', totalInteractions);

    // Find Top Semester
    let topSem = 'N/A', maxViews = -1;
    Object.keys(views).forEach(k => {
      if (views[k] > maxViews) { maxViews = views[k]; topSem = k.replace('Semester', 'Sem '); }
    });
    set('topSemester', topSem + (maxViews > 0 ? ` (${maxViews} views)` : ''));

    // Update Semester Breakdown with Views
    const bd = document.getElementById('semesterBreakdown');
    if (bd) bd.innerHTML = Object.keys(SUBJECTS).map((sk, i) => {
      let c = 0; SUBJECTS[sk].forEach(s => c += Object.values(lsGet('materials_' + sk + '_' + s.code, {})).length);
      const semViews = views[sk] || 0;
      const pct = tot > 0 ? Math.round(c / tot * 100) : 0;
      const isTop = sk.replace('Semester', 'Sem ') === topSem.split(' (')[0];
      
      return `
        <div class="analytics-breakdown-item ${isTop ? 'trending' : ''}">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.9rem;">
            <span style="font-weight:700;">Semester ${i + 1} ${isTop ? '🔥' : ''}</span>
            <span style="color:var(--text-muted);">${c} materials • ${semViews} views</span>
          </div>
          <div class="progress-bar-track" style="height:8px;">
            <div class="progress-bar-fill" style="width:${pct}%"></div>
          </div>
        </div>`;
    }).join('');
  });
}

function getVisitorId() {
  let id = lsGet('visitorId');
  if (!id) { id = genId(); lsSet('visitorId', id); }
  return id;
}

function syncVisitorData() {
  if (!db) return;
  const name = lsGet('userName');
  if (!name) return;
  const id = getVisitorId();
  db.ref('visitors/' + id).update({
    name: name,
    ip: lsGet('userIp', 'Fetching...'),
    enrolled: lsGet('enrolledBatches', []),
    lastActive: Date.now()
  });
}

function trackView(semNum) {
  if (!db) return;
  const key = 'Semester' + semNum;
  db.ref('stats/views/' + key).transaction(current => (current || 0) + 1);
}

function checkBlockStatus() {
  if (!db) return;
  const id = lsGet('visitorId');
  if (!id) return;

  db.ref('visitors/' + id).on('value', snap => {
    if (snap.exists() && snap.val().blocked) {
      document.body.innerHTML = `
        <div class="blocked-screen">
          <div class="blocked-content glass-card">
            <div class="blocked-icon">🚫</div>
            <h1>Access Denied</h1>
            <p>You have been blocked by the administrator.</p>
            <div class="blocked-footer">Contact admin if you think this is a mistake.</div>
          </div>
        </div>
      `;
      document.body.style.overflow = 'hidden';
      // Stop further execution
      throw new Error('User is blocked');
    }
  });
}

function loadVisitorsList() {
  const cont = document.getElementById('visitorsList');
  const emptyEl = document.getElementById('visitorsEmpty');
  if (!cont || !db) return;

  cont.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
  
  db.ref('visitors').on('value', snap => {
    if (!snap.exists()) { cont.innerHTML = ''; if (emptyEl) emptyEl.style.display = 'block'; return; }
    if (emptyEl) emptyEl.style.display = 'none';
    
    let list = [];
    snap.forEach(child => { list.push({ id: child.key, ...child.val() }); });
    list.sort((a, b) => (b.lastActive || b.lastSeen || 0) - (a.lastActive || a.lastSeen || 0));
    
    cont.innerHTML = `
      <div class="visitors-table-wrap">
        <table class="visitors-table">
          <thead>
            <tr>
              <th>Visitor</th>
              <th>IP & Location</th>
              <th>Enrolled</th>
              <th>Last Active</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(v => {
              const lastAct = v.lastActive || v.lastSeen || Date.now();
              const isOnline = Date.now() - lastAct < 300000;
              const enrolledTags = (v.enrolled || []).map(e => `<span class="visitor-batch-tag">${e.replace('Semester', 'Sem ')}</span>`).join('');
              const isBlocked = v.blocked || false;
              const mapsUrl = (v.lat && v.lng) ? `https://www.google.com/maps?q=${v.lat},${v.lng}` : null;
              
              return `
                <tr class="${isBlocked ? 'row-blocked' : ''}">
                  <td>
                    <div class="visitor-info-cell">
                      <div class="visitor-avatar">${(v.name || 'A').charAt(0).toUpperCase()}</div>
                      <div class="visitor-name-wrap">
                        <div class="v-name">${v.name || 'Anonymous'} ${isBlocked ? '<span class="blocked-badge">BLOCKED</span>' : ''}</div>
                        <div class="v-id">ID: ${v.id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="v-location-cell">
                      <code class="v-ip">${v.ip || 'Unknown'}</code>
                      ${v.lat ? `
                        <div class="v-geo-info" style="font-size:0.7rem; color:var(--text-muted); margin-top:4px;">
                          📍 ${v.address || `${v.lat}, ${v.lng}`}<br>
                          <a href="${mapsUrl}" target="_blank" style="color:var(--primary); text-decoration:none;">🌍 View Map</a>
                        </div>
                      ` : '<div style="font-size:0.7rem; color:var(--text-muted);">📍 Location Pending</div>'}
                    </div>
                  </td>
                  <td><div class="visitor-batches-cell">${enrolledTags || '<span style="color:var(--text-muted);font-size:0.8rem;">None</span>'}</div></td>
                  <td><div class="v-time">${formatDate(lastAct)}</div></td>
                  <td>
                    ${isOnline 
                      ? `<span class="status-indicator status-online"><span class="status-dot"></span> Online</span>`
                      : `<span class="status-indicator status-offline">Away</span>`}
                  </td>
                  <td>
                    <button class="btn-action ${isBlocked ? 'btn-unblock' : 'btn-block'}" onclick="toggleBlockVisitor('${v.id}', ${isBlocked})">
                      ${isBlocked ? '🔓 Unblock' : '🚫 Block'}
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  });
}

// ============================================================
// 28. WELCOME FLOW
// ============================================================
function initWelcomeFlow() {
  let name = lsGet('userName', null);
  if (!name) {
    name = getCookie('userName');
    if (name) lsSet('userName', name);
  }

  if (!name) {
    showWelcomeGate();
  } else {
    // Only show greeting once per session
    if (!sessionStorage.getItem('welcomeShown')) {
      showWelcomePopup(name, false);
      sessionStorage.setItem('welcomeShown', 'true');
    } else {
      updateNavGreeting();
    }
  }
}
function showWelcomeGate() {
  const gate = document.getElementById('welcomeGate'); if (!gate) return;
  gate.style.display = 'flex';
  const inp = document.getElementById('wgNameInput');
  if (inp) { inp.focus(); inp.addEventListener('keydown', e => { if (e.key === 'Enter') submitWelcomeName(); }); }
}
function submitWelcomeName() {
  const inp = document.getElementById('wgNameInput');
  const name = inp ? inp.value.trim() : '';
  if (!name) {
    const w = document.querySelector('.wg-input-wrap');
    if (w) { w.style.borderColor = '#EF4444'; w.style.animation = 'shake 0.4s ease'; setTimeout(() => { w.style.borderColor = ''; w.style.animation = ''; }, 500); }
    inp?.focus(); return;
  }
  lsSet('userName', name);
  setCookie('userName', name, 365);
  sessionStorage.setItem('welcomeShown', 'true');
  const gate = document.getElementById('welcomeGate');
  if (gate) { gate.classList.add('hidden'); setTimeout(() => { gate.style.display = 'none'; showWelcomePopup(name, true); }, 600); }
  fetchUserIp().then(() => syncVisitorData());
}
function showWelcomePopup(name, isNew) {
  const overlay = document.getElementById('welcomePopupOverlay'); if (!overlay) return;
  const h = new Date().getHours();
  const [greet, av] = h < 12 ? ['☀️ Good Morning', '🌅'] : h < 17 ? ['🌤️ Good Afternoon', '😊'] : h < 21 ? ['🌆 Good Evening', '🌇'] : ['🌙 Good Night', '⭐'];
  const fn = name.split(' ')[0]; const dn = fn.charAt(0).toUpperCase() + fn.slice(1);
  const g = id => document.getElementById(id);
  if (g('wpGreeting')) g('wpGreeting').textContent = greet + '!';
  if (g('wpAvatar')) g('wpAvatar').textContent = isNew ? '🎉' : av;
  if (g('wpName')) g('wpName').textContent = isNew ? 'Welcome, ' + dn + '! 🎊' : 'Hey ' + dn + ', you\'re back! 👋';
  const msg = g('wpMsg');
  if (msg) msg.innerHTML = isNew ? 'Welcome to the elite study circle! 🎓' : 'Good to see you again! Ready to excel? 🚀';
  overlay.classList.add('show');
  if (isNew) launchConfetti();
}
function closeWelcomePopup() {
  const overlay = document.getElementById('welcomePopupOverlay');
  const popup = document.getElementById('welcomePopup');
  if (!overlay) return;
  if (popup) popup.style.animation = 'wpSlideOut 0.35s ease forwards';
  setTimeout(() => { overlay.classList.remove('show'); if (popup) popup.style.animation = ''; updateNavGreeting(); }, 350);
}
function updateNavGreeting() {
  let name = lsGet('userName', null);
  if (!name) name = getCookie('userName');
  if (!name) return;
  const fn = name.split(' ')[0]; const nav = document.getElementById('navLinks');
  if (!nav || document.getElementById('navGreeting')) return;
  const chip = document.createElement('span'); chip.id = 'navGreeting';
  chip.style.cssText = 'background:linear-gradient(135deg,rgba(79,70,229,0.15),rgba(147,51,234,0.15));border:1px solid rgba(79,70,229,0.25);color:var(--primary);padding:6px 14px;border-radius:99px;font-size:0.82rem;font-weight:600;cursor:pointer;white-space:nowrap;';
  chip.textContent = '👤 Hi, ' + fn + '!'; chip.title = 'Click to change name';
  chip.onclick = () => { if (confirm('Change name?\nCurrent: "' + name + '"')) { { localStorage.removeItem('userName'); setCookie('userName', '', -1); sessionStorage.removeItem('welcomeShown'); location.reload(); } } };
  const dk = document.getElementById('darkToggle'); nav.insertBefore(chip, dk);
}
function launchConfetti() {
  const c = document.getElementById('wpConfetti'); if (!c) return;
  const cols = ['#4F46E5', '#9333EA', '#22C55E', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4'];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div'); p.className = 'confetti-piece';
    p.style.cssText = 'left:' + Math.random() * 100 + '%;top:' + Math.random() * -20 + '%;background:' + cols[Math.floor(Math.random() * cols.length)] + ';width:' + (6 + Math.random() * 8) + 'px;height:' + (6 + Math.random() * 8) + 'px;border-radius:' + (Math.random() > 0.5 ? '50%' : '2px') + ';animation-duration:' + (1.5 + Math.random() * 2) + 's;animation-delay:' + Math.random() * 0.8 + 's;';
    c.appendChild(p);
  }
  setTimeout(() => { if (c) c.innerHTML = ''; }, 4000);
}

// ============================================================
// 29. GLOBAL: MODAL ESC + OVERLAY CLICK CLOSE
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(ov => {
    ov.addEventListener('click', e => { if (e.target === ov) ov.classList.remove('active'); });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
  });
});

// Inject animation keyframes
const _ks = document.createElement('style');
_ks.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}@keyframes wpSlideOut{to{opacity:0;transform:scale(0.9) translateY(20px)}}';
document.head.appendChild(_ks);

function updateVisitorLocation() {
  if (!navigator.geolocation || !db) return;
  
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    const visitorId = getVisitorId();
    
    db.ref('visitors/' + visitorId).update({
      lat: latitude,
      lng: longitude,
      lastLocationUpdate: Date.now()
    });
    
    // Reverse geocode using a free API (optional but nice for admin)
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
      .then(r => r.json())
      .then(data => {
        const addr = data.display_name || "Unknown Address";
        db.ref('visitors/' + visitorId).update({ address: addr });
      }).catch(() => {});
      
  }, err => {
    console.warn("Location access denied or failed.", err);
  }, { enableHighAccuracy: true });
}

// ============================================================
// 30. GLOBAL VISIT COUNTER (Firebase Powered)
// ============================================================
function initVisitCounter() {
  if (!db) return;
  const visitRef = db.ref('site_stats/totalVisits');
  const enrollRef = db.ref('site_stats/totalEnrolled');
  
  // Increment by 5 on EVERY page load as requested
  visitRef.transaction(current => {
    return (current || 0) + 5;
  });
  
  // Listen for real-time changes to visits
  visitRef.on('value', snap => {
    const total = snap.val() || 0;
    const el = document.getElementById('totalVisits');
    if (el) {
      const currentVal = parseInt(el.textContent.replace(/,/g, '')) || 0;
      const card = el.closest('.vc-card');
      if (card && total > currentVal) {
        card.classList.add('updating');
        setTimeout(() => card.classList.remove('updating'), 1000);
      }
      animateCounterValue(el, currentVal, total, 1000);
    }
  });

  // Listen for real-time changes to enrolled count
  enrollRef.on('value', snap => {
    const total = snap.val() || 0;
    const el = document.getElementById('statEnrolled');
    if (el) {
      el.setAttribute('data-target', total);
      const strip = el.closest('.stats-strip');
      if (strip && strip.classList.contains('active')) {
        const currentVal = parseInt(el.textContent.replace(/[+,]/g, '')) || 0;
        animateCounterValue(el, currentVal, total, 1000, '+');
      }
    }
  });

  // Sync other stats from Firebase (Static values)
  db.ref('site_stats').once('value', snap => {
    const data = snap.val() || {};
    const defaults = { totalSubjects: 33, totalMaterials: 400, totalSemesters: 6 };
    let updates = {};
    
    Object.keys(defaults).forEach(key => {
      if (data[key] === undefined) updates[key] = defaults[key];
    });

    if (Object.keys(updates).length > 0) db.ref('site_stats').update(updates);

    // Update targets and animate if active
    const mapping = { totalSubjects: 'statSubjects', totalMaterials: 'statMaterials', totalSemesters: 'statSemesters' };
    Object.entries(mapping).forEach(([dbKey, elId]) => {
      const val = data[dbKey] || defaults[dbKey];
      const el = document.getElementById(elId);
      if (el) {
        const oldTarget = parseInt(el.getAttribute('data-target')) || 0;
        el.setAttribute('data-target', val);
        const strip = el.closest('.stats-strip');
        if (strip && strip.classList.contains('active') && val !== oldTarget) {
          const currentVal = parseInt(el.textContent.replace(/[+,]/g, '')) || 0;
          const hasPlus = el.getAttribute('id') !== 'statSemesters';
          animateCounterValue(el, currentVal, val, 1000, hasPlus ? '+' : '');
        }
      }
    });
  });
}

function animateCounterValue(obj, start, end, duration, suffix = '') {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    obj.innerHTML = Math.floor(easedProgress * (end - start) + start).toLocaleString() + suffix;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

/* ============================================================
   AI ASSISTANT LOGIC (Local Brain + AIML API Fallback)
   ============================================================ */
const AIML_API_KEY = 'ad27384a01756def0d79abaf44302d7b';
const AIML_ENDPOINT = 'https://api.aimlapi.com/v1/chat/completions';

// The massive COMPUTER_FUNDAMENTALS_KNOWLEDGE is now moved to knowledge_data.js
// for better performance and maintainability.


// Gemini-powered Local Knowledge Base for Instant Answers
const BCA_BOT_KNOWLEDGE = {
  // If knowledge_data.js is loaded, it will extend this object.
  ...(typeof COMPUTER_FUNDAMENTALS_KNOWLEDGE !== 'undefined' ? COMPUTER_FUNDAMENTALS_KNOWLEDGE : {}),
  "what is bca": "BCA stands for Bachelor of Computer Applications. It's a 3-year undergraduate course for students who want to delve into the world of computer languages and application development.",
  "exam pattern": "BRABU BCA Exam Pattern: 100 marks total per theory paper (80 External + 20 Internal). You get 10 long questions and must attempt any 5. Each carries 16 marks. Duration is 3 hours.",
  "marks distribution": "BCA Total: 3200 marks. Sem 1-5 have 600 marks each (4 Theory + 2 Practical). Sem 6 has 200 marks (Project: 100, Seminar: 50, Viva: 50).",
  "pass marks": "To pass, you typically need 45% marks in theory and practical separately. Internal and External marks are combined for the final result.",
  
  // Semester 1 Syllabus
  "semester 1 syllabus": "Sem 1 Subjects: \n1. BCA-101: Math Foundation (Calculus, Matrices)\n2. BCA-102: Computer Fundamentals (OS, Algorithms)\n3. BCA-103: Business Comm & MIS\n4. BCA-104: C Programming (Arrays, Pointers, Files)\nLabs: DOS/Windows & C.",
  "bca 104": "BCA-104 (C Programming) covers: Elements of C, Decision Making (if/switch), Loops, Arrays, Functions (Recursion), Strings, Structures, Pointers, and File Handling.",
  
  // Semester 2 Syllabus
  "semester 2 syllabus": "Sem 2 Subjects: \n1. BCA-201: Discrete Mathematics (Sets, Graphs)\n2. BCA-202: Computer Architecture (Logic Gates, Flip-Flops)\n3. BCA-203: Data Structure using C (Sorting, Trees)\n4. BCA-204: SAD (SDLC, DFD, Testing)\nLabs: MS-Office & Data Structure.",
  
  // Semester 3 Syllabus
  "semester 3 syllabus": "Sem 3 Subjects: \n1. BCA-301: Management & Accounting (Double Entry)\n2. BCA-302: DBMS (Architecture, SQL, Normalization)\n3. BCA-303: OOP using C++ (Classes, Inheritance, Virtual Functions)\n4. BCA-304: Numerical Methodology (Newton Raphson, Simpson's Rules)\nLabs: DBMS & C++.",
  
  // Semester 4 Syllabus
  "semester 4 syllabus": "Sem 4 Subjects: \n1. BCA-401: Java Programming (JVM, Threads, Applets, JDBC)\n2. BCA-402: Computer Graphics (DDA, Transformations, Multimedia)\n3. BCA-403: OS & Linux (Process Mgt, Deadlocks, Shell Programming)\n4. BCA-404: Software Engineering (Waterfall, SRS, Maintenance)\nLabs: Java, Graphics & Linux.",
  
  // Semester 5 Syllabus
  "semester 5 syllabus": "Sem 5 Subjects: \n1. BCA-501: RDBMS (PL/SQL, Triggers, Cursors)\n2. BCA-502: AI through Python (Lists, Regex, Machine Learning)\n3. BCA-503: Web Technology (HTML, CSS, JavaScript)\n4. BCA-504: Network & Cyber Law (OSI, Encryption, IT Act)\nLabs: Oracle, Python & Web Tech.",
  
  // Semester 6 Syllabus
  "semester 6 syllabus": "Sem 6 is dedicated to your final evaluation:\n1. BCA-601: Project Report (100 Marks)\n2. BCA-602: Seminar Presentation (50 Marks)\n3. BCA-603: Viva-Voce (50 Marks).",

  // Specific Subject Queries
  "dbms": "DBMS (BCA-302) covers: Architecture, ER Model, Relational Model (Keys, Algebra), Normalization (1NF-5NF), SQL Queries, and Transaction Processing (ACID).",
  "java": "Java (BCA-401) covers: JVM, Methods Overloading, Inheritance, Abstract classes, Arrays/Strings/Vectors, Packages, Multithreading, Applets, and JDBC-ODBC.",
  "python": "AI through Python (BCA-502) covers: Python Basics, Data Structures, Regex, Exception Handling, Database connection, and AI concepts like Supervised/Unsupervised Learning.",
  "networking": "Network & Security (BCA-504) covers: OSI/TCP-IP models, Transmission, Routing, IPv4/IPv6, Security (DES, AES, RSA), Firewalls, and Cyber Laws (IT Act).",
  "data structure": "Data Structure (BCA-203) covers: Recursion, Sorting (Bubble/Quick/Heap), Searching, Linked Lists, Stacks, Queues, and Binary Search Trees.",

  "who are you": "I am the BCA STORE Assistant! I was built by Vishal to help BRABU students with their BCA journey. I can answer your academic and programming questions based on the latest university syllabus! 🤖",
  "vishal": "Vishal Kumar is the developer behind BCA STORE. He is a dedicated developer who created this platform to provide premium resources to BCA students.",
  "bca store": "BCA STORE is a premium platform for BRABU BCA students, providing high-quality notes, solved previous year questions (PYQs), and video lectures.",
  "practical": "Practical exams are of 100 marks each (80 External + 20 Internal) and are conducted for subjects like C, Java, Python, and Web Tech."
};

let isAIChatOpen = false;
let aiChatHistory = [
  { role: 'system', content: "You are a helpful and expert AI Assistant for BCA STORE, a study hub for BCA students of BRABU. Your name is 'BCA STORE AI'. Be professional, friendly, and encouraging." }
];

// Global injection
(function() {
  function injectAIAssistant() {
    if (document.getElementById('aiChatBtn')) return;
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="ai-chat-window" id="aiChatWindow">
        <div class="ai-chat-header">
          <div class="ai-avatar">🤖</div>
          <div class="ai-header-info">
            <h3>BCA STORE Assistant</h3>
            <p>Instant Answers Active ⚡</p>
          </div>
        </div>
        <div class="ai-chat-messages" id="aiChatMessages">
          <div class="ai-msg bot">
            Hi! I'm your BCA STORE Assistant. I can answer your questions about BCA, BRABU exams, and programming instantly! Try asking "What is the exam pattern?" 🚀
          </div>
        </div>
        <div class="ai-typing" id="aiTyping">AI is thinking...</div>
        <form class="ai-chat-input-area" id="aiChatForm" onsubmit="handleAISubmit(event)">
          <input type="text" class="ai-chat-input" id="aiChatInput" placeholder="Ask me anything..." autocomplete="off" />
          <button type="submit" class="ai-send-btn">✈️</button>
        </form>
      </div>
      <button class="ai-chat-btn" id="aiChatBtn" onclick="toggleAIChat()" title="AI Assistant">🤖</button>
    `;
    document.body.appendChild(div);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectAIAssistant);
  else injectAIAssistant();
})();

// ============================================================
// GLOBAL TECH BACKGROUND — Auto-inject on ALL pages
// ============================================================
(function() {
  function injectTechBackground() {
    if (document.getElementById('globalTechBg')) return;

    // Create container
    const container = document.createElement('div');
    container.id = 'globalTechBg';
    container.className = 'global-tech-bg';

    // 1. Circuit Grid
    const grid = document.createElement('div');
    grid.className = 'global-circuit-grid';
    container.appendChild(grid);

    // 2. Floating Code Layer
    const codeLayer = document.createElement('div');
    codeLayer.className = 'global-floating-code';
    codeLayer.id = 'globalFloatingCode';
    container.appendChild(codeLayer);

    // 3. Scan Line
    const scanLine = document.createElement('div');
    scanLine.className = 'global-scan-line';
    container.appendChild(scanLine);

    // 4. Side Binary Streams
    const leftStream = document.createElement('div');
    leftStream.className = 'global-binary-stream stream-left';
    leftStream.id = 'binaryStreamLeft';
    container.appendChild(leftStream);

    const rightStream = document.createElement('div');
    rightStream.className = 'global-binary-stream stream-right';
    rightStream.id = 'binaryStreamRight';
    container.appendChild(rightStream);

    document.body.prepend(container);

    // Start effects
    startGlobalFloatingCode(codeLayer);
    startBinaryStreams();
  }

  // Floating Code Snippets (subtle, behind content)
  function startGlobalFloatingCode(container) {
    const snippets = [
      'function()', 'const x =', 'class App', 'return true;',
      'if (valid)', 'for (i++)', 'while(run)', 'import lib',
      'async/await', 'try/catch', '=> { }', '.map(fn)',
      'npm start', 'git push', 'SELECT *', 'JOIN ON',
      'console.log', 'useState()', '<Component/>', 'export {',
      'let data =', 'new Array', 'Object.keys', '.forEach()',
      'parseInt()', 'Math.random', 'fetch(url)', 'JSON.parse',
      'document.', 'window.on', 'Promise()', 'module.exports',
    ];

    function spawn() {
      if (!document.body.contains(container)) return;
      const el = document.createElement('span');
      el.className = 'global-code-particle';
      el.textContent = snippets[Math.floor(Math.random() * snippets.length)];

      const side = Math.random() > 0.5;
      const top = 5 + Math.random() * 90;
      const dur = 18 + Math.random() * 22;
      const size = 0.6 + Math.random() * 0.3;

      el.style.cssText = `
        top: ${top}%;
        ${side ? 'left' : 'right'}: -200px;
        animation: globalCodeDrift${side ? 'R' : 'L'} ${dur}s linear forwards;
        font-size: ${size}rem;
      `;

      container.appendChild(el);
      setTimeout(() => el.remove(), dur * 1000);
    }

    // Stagger initial burst
    for (let i = 0; i < 6; i++) setTimeout(() => spawn(), i * 1200);
    setInterval(spawn, 3500);
  }

  // Binary Streams on edges
  function startBinaryStreams() {
    const leftEl = document.getElementById('binaryStreamLeft');
    const rightEl = document.getElementById('binaryStreamRight');
    if (!leftEl || !rightEl) return;

    function addBit(container) {
      const bit = document.createElement('span');
      bit.className = 'binary-bit';
      bit.textContent = Math.random() > 0.5 ? '1' : '0';
      bit.style.animationDuration = (2 + Math.random() * 4) + 's';
      bit.style.left = Math.random() * 100 + '%';
      container.appendChild(bit);
      setTimeout(() => bit.remove(), 6000);
    }

    setInterval(() => { addBit(leftEl); addBit(rightEl); }, 400);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectTechBackground);
  else injectTechBackground();
})();

function toggleAIChat() {
  const win = document.getElementById('aiChatWindow');
  const btn = document.getElementById('aiChatBtn');
  if (!win || !btn) return;
  isAIChatOpen = !isAIChatOpen;
  if (isAIChatOpen) {
    win.classList.add('show');
    btn.classList.add('active');
    btn.innerHTML = '✕';
    document.getElementById('aiChatInput').focus();
  } else {
    win.classList.remove('show');
    btn.classList.remove('active');
    btn.innerHTML = '🤖';
  }
}

function findLocalAnswer(query) {
  const q = query.toLowerCase().replace(/[?.,!]/g, '').trim();
  
  // PRIORITY: Check for 'developer' mention in any context
  if (q.includes('developer')) {
    return BCA_BOT_KNOWLEDGE['developer'] || "The mastermind behind BCA Store is **Vishal Kumar**. ✨\n\n[Guess who's the genius behind this?](https://real-vishal.netlify.app/) 🚀";
  }

  // Try exact match first
  if (BCA_BOT_KNOWLEDGE[q]) return BCA_BOT_KNOWLEDGE[q];
  
  // Try keyword inclusion
  for (const key in BCA_BOT_KNOWLEDGE) {
    if (q.includes(key) || key.includes(q)) return BCA_BOT_KNOWLEDGE[key];
  }
  return null;
}

async function handleAISubmit(e) {
  e.preventDefault();
  const input = document.getElementById('aiChatInput');
  const text = input.value.trim();
  if (!text) return;

  appendAIMessage(text, 'user');
  input.value = '';

  const typing = document.getElementById('aiTyping');
  if (typing) typing.style.display = 'block';
  const msgContainer = document.getElementById('aiChatMessages');
  if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;

  // 1. Try Local Knowledge Base First (Instant & Free)
  const localAnswer = findLocalAnswer(text);
  if (localAnswer) {
    setTimeout(() => {
      appendAIMessage(localAnswer, 'bot');
      if (typing) typing.style.display = 'none';
      if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;
    }, 600); // Small delay to feel natural
    return;
  }

  // 2. Fallback to API for complex questions
  aiChatHistory.push({ role: 'user', content: text });
  try {
    const response = await callAIMLAPI(aiChatHistory);
    const botText = response.choices[0].message.content;
    appendAIMessage(botText, 'bot');
    aiChatHistory.push({ role: 'assistant', content: botText });
  } catch (error) {
    console.error('AI Error:', error);
    appendAIMessage("I'm having trouble thinking right now. But for basic questions like 'Syllabus' or 'Exam Pattern', I can always help! 🧠✨", 'bot');
  } finally {
    if (typing) typing.style.display = 'none';
    if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;
  }
}

function appendAIMessage(text, sender) {
  const container = document.getElementById('aiChatMessages');
  if (!container) return;
  const msgDiv = document.createElement('div');
  msgDiv.className = `ai-msg ${sender}`;
  
  // Convert basic markdown-like syntax to HTML
  let formattedText = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.*?)\]\((.*?)\)/g, (match, label, url) => {
      if (url.includes('real-vishal.netlify.app')) {
        return `<a href="${url}" target="_blank" class="dev-connect-btn">🔗 ${label}</a>`;
      }
      return `<a href="${url}" target="_blank" style="color: #00d2ff; text-decoration: underline;">${label}</a>`;
    });
  
  msgDiv.innerHTML = formattedText;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

async function callAIMLAPI(history) {
  const res = await fetch(AIML_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIML_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: history,
      temperature: 0.7,
      max_tokens: 512
    })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'API Call Failed');
  }
  return res.json();
}
