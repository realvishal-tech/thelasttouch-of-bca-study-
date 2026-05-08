// ============================================================
// COMMUNITY TAB — community.js
// All community logic: Registration, Doubts, Chat, Announcements
// ============================================================

// ---- Community User State ----
let commUser = null;
let commDoubtsCache = [];
let commTypingTimeout = null;
let commChatListener = null;

// ---- Helpers ----
function commId() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 6); }
function commVisitorId() {
  let id = localStorage.getItem('comm_visitorId');
  if (!id) { id = 'cu_' + commId(); localStorage.setItem('comm_visitorId', id); }
  return id;
}
function commTimeAgo(ts) {
  if (!ts) return '';
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
  return new Date(ts).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}
function commTimeStamp(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

// ============================================================
// INIT
// ============================================================
function initCommunityPage() {
  initDarkMode();
  initNavbar();
  initVisitCounter();

  // Check if user is registered
  const saved = localStorage.getItem('comm_user');
  if (saved) {
    try { commUser = JSON.parse(saved); } catch (e) { commUser = null; }
  }

  if (commUser && commUser.name && commUser.semester && commUser.rollNo) {
    showCommunityMain();
  } else {
    document.getElementById('commRegGate').style.display = 'flex';
    document.getElementById('commPage').style.display = 'none';
    // Pre-fill name if we have it from the welcome gate
    const wn = localStorage.getItem('userName');
    if (wn) {
      try {
        const n = JSON.parse(wn);
        if (n) document.getElementById('commRegName').value = n;
      } catch (e) {
        document.getElementById('commRegName').value = wn;
      }
    }
  }
}

// ============================================================
// REGISTRATION
// ============================================================
function commRegister() {
  const name = document.getElementById('commRegName')?.value.trim();
  const sem = document.getElementById('commRegSem')?.value;
  const roll = document.getElementById('commRegRoll')?.value.trim();

  if (!name) { showToast('❌ Please enter your name.', 'error'); return; }
  if (!sem) { showToast('❌ Please select your semester.', 'error'); return; }
  if (!roll) { showToast('❌ Please enter your roll number.', 'error'); return; }

  const uid = commVisitorId();
  commUser = { name, semester: sem, rollNo: roll, uid };
  localStorage.setItem('comm_user', JSON.stringify(commUser));

  // Save to Firebase
  if (db) {
    db.ref('community_users/' + uid).set({
      name, semester: sem, rollNo: roll, joinedAt: Date.now(), banned: false
    });
  }

  showToast('🎉 Welcome to the Community, ' + name + '!', 'success');
  document.getElementById('commRegGate').style.display = 'none';
  showCommunityMain();
}

function showCommunityMain() {
  document.getElementById('commPage').style.display = 'block';
  document.getElementById('commRegGate').style.display = 'none';
  loadDoubts();
  loadAnnouncements();
  setupOnlinePresence();
}

// ============================================================
// ONLINE PRESENCE
// ============================================================
function setupOnlinePresence() {
  if (!db || !commUser) return;
  const uid = commVisitorId();
  const onlineRef = db.ref('community_online/' + uid);
  onlineRef.set({ name: commUser.name, semester: commUser.semester, lastSeen: Date.now() });
  onlineRef.onDisconnect().remove();

  // Update every 30s
  setInterval(() => {
    onlineRef.update({ lastSeen: Date.now() });
  }, 30000);

  // Listen for online count
  db.ref('community_online').on('value', snap => {
    const count = snap.numChildren() || 0;
    const el1 = document.getElementById('commOnlineCount');
    const el2 = document.getElementById('commChatOnline');
    if (el1) el1.textContent = count;
    if (el2) el2.textContent = count;
  });
}

// ============================================================
// TAB SWITCHING
// ============================================================
function commSwitchTab(tab) {
  ['doubts', 'chat', 'announcements'].forEach(t => {
    const el = document.getElementById('comm-tab-' + t);
    if (el) el.classList.toggle('active', t === tab);
  });
  document.querySelectorAll('.comm-tab').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.toLowerCase().includes(tab.substring(0, 4)));
  });

  if (tab === 'chat') initChat();
  if (tab === 'announcements') loadAnnouncements();
}

// ============================================================
// DOUBTS SYSTEM
// ============================================================
function loadDoubts() {
  if (!db) return;
  const list = document.getElementById('commDoubtsList');
  const empty = document.getElementById('commDoubtsEmpty');

  db.ref('community_doubts').orderByChild('timestamp').on('value', snap => {
    commDoubtsCache = [];
    if (!snap.exists()) {
      if (list) list.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }
    snap.forEach(child => commDoubtsCache.push({ id: child.key, ...child.val() }));
    commDoubtsCache.reverse(); // newest first
    if (empty) empty.style.display = 'none';
    renderDoubts(commDoubtsCache);
  });
}

function renderDoubts(doubts) {
  const list = document.getElementById('commDoubtsList');
  const empty = document.getElementById('commDoubtsEmpty');
  if (!list) return;

  if (!doubts.length) {
    list.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';

  const uid = commVisitorId();
  // Sort: pinned first
  doubts.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return (b.timestamp || 0) - (a.timestamp || 0);
  });

  list.innerHTML = doubts.map((d, i) => {
    const init = (d.userName || '?')[0].toUpperCase();
    const likes = d.likes ? Object.keys(d.likes).length : 0;
    const liked = d.likes && d.likes[uid];
    const replies = d.replies ? Object.values(d.replies) : [];
    replies.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    const replyCount = replies.length;

    return `<div class="comm-doubt-card ${d.pinned ? 'pinned' : ''} ${d.solved ? 'solved' : ''}" style="animation-delay:${i * 0.05}s">
      <div class="comm-doubt-top">
        <div class="comm-doubt-user">
          <div class="comm-doubt-avatar">${init}</div>
          <div class="comm-doubt-meta">
            <div class="name">${escHtml(d.userName || 'Anonymous')}</div>
            <div class="info">Sem ${d.userSemester || '?'} • ${commTimeAgo(d.timestamp)}</div>
          </div>
        </div>
        <div class="comm-doubt-badges">
          ${d.subject ? `<span class="comm-badge">${escHtml(d.subject)}</span>` : ''}
          ${d.semester ? `<span class="comm-badge">Sem ${d.semester}</span>` : ''}
          ${d.solved ? '<span class="comm-badge solved">✅ Solved</span>' : ''}
          ${d.pinned ? '<span class="comm-badge pinned">📌 Pinned</span>' : ''}
        </div>
      </div>
      <div class="comm-doubt-title">${escHtml(d.title || '')}</div>
      ${d.description ? `<div class="comm-doubt-desc">${escHtml(d.description)}</div>` : ''}
      <div class="comm-doubt-actions">
        <button class="comm-action-btn ${liked ? 'liked' : ''}" onclick="commLikeDoubt('${d.id}')">
          ${liked ? '❤️' : '🤍'} ${likes}
        </button>
        <button class="comm-action-btn" onclick="commToggleReplies('${d.id}')">
          💬 ${replyCount} ${replyCount === 1 ? 'Reply' : 'Replies'}
        </button>
        ${d.userId === uid && !d.solved ? `<button class="comm-action-btn" onclick="commMarkSolved('${d.id}')">✅ Mark Solved</button>` : ''}
      </div>
      <div class="comm-replies" id="replies-${d.id}" style="display:none;">
        ${replies.map(r => `
          <div class="comm-reply">
            <div class="comm-reply-avatar">${(r.userName || '?')[0].toUpperCase()}</div>
            <div class="comm-reply-body">
              <div class="comm-reply-header">
                <span class="rname">${escHtml(r.userName || 'Anonymous')}</span>
                <span class="rtime">${commTimeAgo(r.timestamp)}</span>
              </div>
              <div class="comm-reply-text">${escHtml(r.text || '')}</div>
            </div>
          </div>
        `).join('')}
        <div class="comm-reply-input-wrap">
          <input type="text" id="reply-input-${d.id}" placeholder="Write a reply..." maxlength="300"
                 onkeydown="if(event.key==='Enter')commPostReply('${d.id}')" />
          <button onclick="commPostReply('${d.id}')">Reply</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function commFilterDoubts() {
  const q = (document.getElementById('commDoubtSearch')?.value || '').toLowerCase();
  const sem = document.getElementById('commDoubtFilterSem')?.value || '';
  let filtered = commDoubtsCache;
  if (q) filtered = filtered.filter(d =>
    (d.title || '').toLowerCase().includes(q) ||
    (d.description || '').toLowerCase().includes(q) ||
    (d.subject || '').toLowerCase().includes(q)
  );
  if (sem) filtered = filtered.filter(d => d.semester === sem);
  renderDoubts(filtered);
}

function commOpenDoubtModal() { document.getElementById('commDoubtModal').style.display = 'flex'; }
function commCloseDoubtModal() { document.getElementById('commDoubtModal').style.display = 'none'; }

function commPostDoubt() {
  if (!commUser || !db) return;
  const title = document.getElementById('commDoubtTitle')?.value.trim();
  const desc = document.getElementById('commDoubtDesc')?.value.trim();
  const subject = document.getElementById('commDoubtSubject')?.value.trim();
  const sem = document.getElementById('commDoubtSem')?.value;

  if (!title) { showToast('❌ Please enter a doubt title.', 'error'); return; }

  const id = commId();
  db.ref('community_doubts/' + id).set({
    userId: commVisitorId(),
    userName: commUser.name,
    userSemester: commUser.semester,
    title, description: desc || '',
    subject: subject || '', semester: sem || '',
    timestamp: Date.now(),
    solved: false, pinned: false, likes: {}, replies: {}
  }).then(() => {
    showToast('✅ Doubt posted successfully!', 'success');
    commCloseDoubtModal();
    document.getElementById('commDoubtTitle').value = '';
    document.getElementById('commDoubtDesc').value = '';
    document.getElementById('commDoubtSubject').value = '';
    document.getElementById('commDoubtSem').value = '';
  }).catch(() => showToast('❌ Failed to post doubt.', 'error'));
}

function commLikeDoubt(id) {
  if (!db) return;
  const uid = commVisitorId();
  const ref = db.ref('community_doubts/' + id + '/likes/' + uid);
  ref.once('value', snap => {
    if (snap.exists()) ref.remove();
    else ref.set(true);
  });
}

function commMarkSolved(id) {
  if (!db) return;
  db.ref('community_doubts/' + id).update({ solved: true });
  showToast('✅ Marked as solved!', 'success');
}

function commToggleReplies(id) {
  const el = document.getElementById('replies-' + id);
  if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function commPostReply(doubtId) {
  if (!commUser || !db) return;
  const input = document.getElementById('reply-input-' + doubtId);
  const text = input?.value.trim();
  if (!text) return;

  const replyId = commId();
  db.ref('community_doubts/' + doubtId + '/replies/' + replyId).set({
    userId: commVisitorId(),
    userName: commUser.name,
    text, timestamp: Date.now()
  }).then(() => { input.value = ''; })
    .catch(() => showToast('❌ Failed to post reply.', 'error'));
}

// ============================================================
// CHAT SYSTEM
// ============================================================
function initChat() {
  if (commChatListener || !db) return;
  const msgContainer = document.getElementById('commChatMessages');
  if (!msgContainer) return;
  msgContainer.innerHTML = '';

  // Load last 100 messages
  const ref = db.ref('community_chat').orderByChild('timestamp').limitToLast(100);
  commChatListener = ref.on('child_added', snap => {
    const msg = snap.val();
    if (!msg) return;
    appendChatMsg(msg);
  });

  // Typing indicator listener
  db.ref('community_typing').on('value', snap => {
    const typingEl = document.getElementById('commChatTyping');
    const textEl = document.getElementById('commTypingText');
    if (!typingEl || !snap.exists()) { if (typingEl) typingEl.style.display = 'none'; return; }

    const uid = commVisitorId();
    const typers = [];
    const now = Date.now();
    snap.forEach(child => {
      const d = child.val();
      if (child.key !== uid && d.timestamp && (now - d.timestamp) < 5000) {
        typers.push(d.name || 'Someone');
      }
    });

    if (typers.length > 0) {
      typingEl.style.display = 'flex';
      textEl.textContent = typers.length === 1
        ? typers[0] + ' is typing...'
        : typers.length + ' people are typing...';
    } else {
      typingEl.style.display = 'none';
    }
  });
}

function appendChatMsg(msg) {
  const container = document.getElementById('commChatMessages');
  if (!container) return;
  const uid = commVisitorId();
  const isSelf = msg.userId === uid;
  const init = (msg.userName || '?')[0].toUpperCase();

  const div = document.createElement('div');
  div.className = 'comm-chat-msg' + (isSelf ? ' self' : '');
  div.innerHTML = `
    <div class="comm-chat-msg-avatar">${init}</div>
    <div class="comm-chat-msg-body">
      <div class="comm-chat-msg-name">${escHtml(msg.userName || 'Anonymous')} • Sem ${msg.userSemester || '?'}</div>
      <div class="comm-chat-msg-text">${escHtml(msg.message || '')}</div>
      <div class="comm-chat-msg-time">${commTimeStamp(msg.timestamp)}</div>
    </div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function commSendChat() {
  if (!commUser || !db) return;
  const input = document.getElementById('commChatInput');
  const text = input?.value.trim();
  if (!text) return;

  db.ref('community_chat').push({
    userId: commVisitorId(),
    userName: commUser.name,
    userSemester: commUser.semester,
    message: text,
    timestamp: Date.now()
  }).then(() => {
    input.value = '';
    // Remove typing indicator
    db.ref('community_typing/' + commVisitorId()).remove();
  });
}

function commTypingSignal() {
  if (!db || !commUser) return;
  const uid = commVisitorId();
  db.ref('community_typing/' + uid).set({ name: commUser.name, timestamp: Date.now() });

  clearTimeout(commTypingTimeout);
  commTypingTimeout = setTimeout(() => {
    db.ref('community_typing/' + uid).remove();
  }, 4000);
}

// ============================================================
// ANNOUNCEMENTS
// ============================================================
function loadAnnouncements() {
  if (!db) return;
  const list = document.getElementById('commAnnounceList');
  const empty = document.getElementById('commAnnounceEmpty');

  db.ref('community_announcements').orderByChild('createdAt').on('value', snap => {
    if (!snap.exists()) {
      if (list) list.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';
    let items = [];
    snap.forEach(child => items.push({ id: child.key, ...child.val() }));
    items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    const readIds = JSON.parse(localStorage.getItem('comm_read_announces') || '[]');

    if (list) list.innerHTML = items.map((a, i) => {
      const isRead = readIds.includes(a.id);
      const type = a.type || 'info';
      return `<div class="comm-announce-card type-${type}" style="animation-delay:${i * 0.05}s">
        <div class="comm-announce-top">
          <span class="comm-announce-type ${type}">${type === 'info' ? '🔵 Info' : type === 'update' ? '🟢 Update' : type === 'exam' ? '🟡 Exam' : '🔴 Alert'}</span>
          <span class="comm-announce-date">${commTimeAgo(a.createdAt)}</span>
        </div>
        <div class="comm-announce-title">${escHtml(a.title || '')}</div>
        <div class="comm-announce-msg">${escHtml(a.message || '')}</div>
        ${!isRead ? `<div class="comm-announce-read" onclick="commMarkRead('${a.id}', this)">Mark as read ✓</div>` : '<div style="font-size:0.72rem;color:var(--success);margin-top:8px;font-weight:600;">✅ Read</div>'}
      </div>`;
    }).join('');
  });
}

function commMarkRead(id, el) {
  const readIds = JSON.parse(localStorage.getItem('comm_read_announces') || '[]');
  if (!readIds.includes(id)) readIds.push(id);
  localStorage.setItem('comm_read_announces', JSON.stringify(readIds));
  if (el) { el.innerHTML = '✅ Read'; el.style.cursor = 'default'; el.onclick = null; }
}

// ============================================================
// ADMIN: Community Management Functions
// (Called from admin.html via script.js switchAdminTab)
// ============================================================
function loadAdminCommunityTab() {
  if (!db) return;
  loadAdminCommStats();
  loadAdminCommUsers();
  loadAdminCommDoubts();
  loadAdminCommChat();
}

function loadAdminCommStats() {
  if (!db) return;
  db.ref('community_users').once('value', snap => {
    const el = document.getElementById('commAdminUserCount');
    if (el) el.textContent = snap.numChildren() || 0;
  });
  db.ref('community_doubts').once('value', snap => {
    const el = document.getElementById('commAdminDoubtCount');
    if (el) el.textContent = snap.numChildren() || 0;
  });
  db.ref('community_chat').once('value', snap => {
    const el = document.getElementById('commAdminChatCount');
    if (el) el.textContent = snap.numChildren() || 0;
  });
  db.ref('community_online').once('value', snap => {
    const el = document.getElementById('commAdminOnlineCount');
    if (el) el.textContent = snap.numChildren() || 0;
  });
}

function loadAdminCommUsers() {
  if (!db) return;
  const container = document.getElementById('commAdminUsersTable');
  if (!container) return;
  db.ref('community_users').once('value', snap => {
    if (!snap.exists()) { container.innerHTML = '<p style="color:var(--text-muted);padding:16px;">No users yet.</p>'; return; }
    let users = [];
    snap.forEach(child => users.push({ id: child.key, ...child.val() }));
    users.sort((a, b) => (b.joinedAt || 0) - (a.joinedAt || 0));
    container.innerHTML = `<table class="comm-admin-table">
      <thead><tr><th>Name</th><th>Sem</th><th>Roll No</th><th>Joined</th><th>Actions</th></tr></thead>
      <tbody>${users.map(u => `<tr>
        <td>${escHtml(u.name || '')}</td><td>${u.semester || '—'}</td>
        <td>${escHtml(u.rollNo || '—')}</td><td>${commTimeAgo(u.joinedAt)}</td>
        <td><button class="comm-admin-del" onclick="commAdminBanUser('${u.id}', ${!!u.banned})">${u.banned ? '🔓 Unban' : '🚫 Ban'}</button></td>
      </tr>`).join('')}</tbody>
    </table>`;
  });
}

function loadAdminCommDoubts() {
  if (!db) return;
  const container = document.getElementById('commAdminDoubtsList');
  if (!container) return;
  db.ref('community_doubts').orderByChild('timestamp').once('value', snap => {
    if (!snap.exists()) { container.innerHTML = '<p style="color:var(--text-muted);padding:16px;">No doubts yet.</p>'; return; }
    let items = [];
    snap.forEach(child => items.push({ id: child.key, ...child.val() }));
    items.reverse();
    container.innerHTML = items.slice(0, 30).map(d => `
      <div class="comm-doubt-card" style="margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
          <div style="flex:1;">
            <div style="font-weight:700;margin-bottom:4px;">${escHtml(d.title || '')}</div>
            <div style="font-size:0.78rem;color:var(--text-muted);">by ${escHtml(d.userName || '?')} • Sem ${d.semester || '?'} • ${commTimeAgo(d.timestamp)}</div>
          </div>
          <div style="display:flex;gap:4px;">
            <button class="comm-admin-pin" onclick="commAdminPinDoubt('${d.id}', ${!!d.pinned})">${d.pinned ? '📌 Unpin' : '📌 Pin'}</button>
            <button class="comm-admin-del" onclick="commAdminDeleteDoubt('${d.id}')">🗑️ Del</button>
          </div>
        </div>
      </div>
    `).join('');
  });
}

function loadAdminCommChat() {
  if (!db) return;
  const container = document.getElementById('commAdminChatList');
  if (!container) return;
  db.ref('community_chat').orderByChild('timestamp').limitToLast(20).once('value', snap => {
    if (!snap.exists()) { container.innerHTML = '<p style="color:var(--text-muted);padding:16px;">No messages yet.</p>'; return; }
    let items = [];
    snap.forEach(child => items.push({ id: child.key, ...child.val() }));
    items.reverse();
    container.innerHTML = items.map(m => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);font-size:0.85rem;">
        <div><strong>${escHtml(m.userName || '?')}</strong>: ${escHtml(m.message || '')}</div>
        <button class="comm-admin-del" onclick="commAdminDeleteChat('${m.id}')">🗑️</button>
      </div>
    `).join('');
  });
}

function commAdminPostAnnouncement() {
  if (!db) return;
  const title = document.getElementById('commAdminAnnTitle')?.value.trim();
  const message = document.getElementById('commAdminAnnMsg')?.value.trim();
  const type = document.getElementById('commAdminAnnType')?.value || 'info';
  if (!title || !message) { showToast('❌ Fill in title and message.', 'error'); return; }

  db.ref('community_announcements').push({
    title, message, type, createdAt: Date.now(), postedBy: 'Admin'
  }).then(() => {
    showToast('📢 Announcement posted!', 'success');
    document.getElementById('commAdminAnnTitle').value = '';
    document.getElementById('commAdminAnnMsg').value = '';
  }).catch(() => showToast('❌ Failed to post.', 'error'));
}

function commAdminDeleteDoubt(id) {
  if (!confirm('Delete this doubt?')) return;
  db.ref('community_doubts/' + id).remove().then(() => showToast('🗑️ Deleted.', 'success'));
  loadAdminCommDoubts();
}

function commAdminPinDoubt(id, isPinned) {
  db.ref('community_doubts/' + id).update({ pinned: !isPinned }).then(() => {
    showToast(isPinned ? '📌 Unpinned.' : '📌 Pinned!', 'success');
    loadAdminCommDoubts();
  });
}

function commAdminDeleteChat(id) {
  if (!confirm('Delete this message?')) return;
  db.ref('community_chat/' + id).remove().then(() => { showToast('🗑️ Deleted.', 'success'); loadAdminCommChat(); });
}

function commAdminBanUser(id, isBanned) {
  db.ref('community_users/' + id).update({ banned: !isBanned }).then(() => {
    showToast(isBanned ? '🔓 User unbanned.' : '🚫 User banned.', 'success');
    loadAdminCommUsers();
  });
}
