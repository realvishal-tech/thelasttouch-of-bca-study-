(function () {
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

  const ADMIN_ACCESS_CODE = 'BCA-ATTEND-2026';
  const TEACHERS = [
    'Raunak Sir',
    'Aman Sir',
    'Rita Ma\'am',
    'Pankaj Sir',
    'Neha Ma\'am',
    'Sanjay Sir',
    'Dr. Sharma'
  ];

  const SEMESTERS = [
    '1st Semester',
    '2nd Semester',
    '3rd Semester',
    '4th Semester',
    '5th Semester',
    '6th Semester'
  ];

  const SUBJECTS = {
    '1st Semester': [
      'Mathematical Foundation',
      'Computer Fundamentals',
      'Business Communication & Information System',
      'C Programming',
      'Lab on DOS & Windows',
      'Lab on C'
    ],
    '2nd Semester': [
      'Discrete Mathematics',
      'Computer Architecture',
      'Data Structure through C',
      'System Analysis and Design',
      'Lab on MS Office',
      'Lab on Data Structure'
    ],
    '3rd Semester': [
      'Management & Business Accounting',
      'Database Management System',
      'Object Oriented Programming using C++',
      'Numerical Methodology',
      'Lab on DBMS',
      'Lab on C++'
    ],
    '4th Semester': [
      'Operating System',
      'Java Programming',
      'Computer Networks',
      'Web Technology',
      'Lab on Java',
      'Lab on Web Technology'
    ],
    '5th Semester': [
      'Software Engineering',
      'Python Programming',
      'E-Commerce',
      'Computer Graphics',
      'Project Work',
      'Lab on Python'
    ],
    '6th Semester': [
      'Project Management',
      'Digital Marketing',
      'Advanced Database',
      'Mobile App Development',
      'Mini Project',
      'Industrial Training'
    ]
  };

  const state = {
    app: null,
    db: null,
    links: [],
    records: [],
    selectedLink: null,
    unlocked: false,
    tokenTimer: null,
    recordTimer: null
  };

  function getAppOrigin() {
    return window.location.origin;
  }

  function getAttendanceUrl(token) {
    return `${getAppOrigin()}/attendance/?token=${encodeURIComponent(token)}`;
  }

  function initFirebase() {
    if (!window.firebase) {
      throw new Error('Firebase SDK missing');
    }

    if (!state.app) {
      state.app = firebase.apps && firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
      state.db = firebase.firestore();
    }

    return state.db;
  }

  function nowMs() {
    return Date.now();
  }

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function formatDate(ms) {
    return new Date(ms).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function formatTime(ms) {
    return new Date(ms).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function formatDateTime(ms) {
    return `${formatDate(ms)} ${formatTime(ms)}`;
  }

  function remainingText(expiryMs) {
    const diff = Math.max(0, expiryMs - nowMs());
    const totalSeconds = Math.ceil(diff / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${pad(minutes)}:${pad(seconds)}`;
  }

  function generateToken(length = 10) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    const values = new Uint32Array(length);
    crypto.getRandomValues(values);
    let token = '';
    for (let index = 0; index < length; index += 1) {
      token += chars[values[index] % chars.length];
    }
    return token;
  }

  function cleanId(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
  }

  function csvEscape(value) {
    const text = String(value ?? '');
    if (/[",\n]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function exportCsv(rows, filename) {
    const columns = [
      'tokenId',
      'teacherName',
      'subject',
      'semester',
      'studentName',
      'rollNumber',
      'submittedDate',
      'submittedTime',
      'submittedAtMs'
    ];
    const lines = [columns.join(',')];
    rows.forEach((row) => {
      lines.push(columns.map((column) => csvEscape(row[column])).join(','));
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function getShareMessage(linkData, url) {
    return [
      'Attendance Link',
      '',
      `Teacher: ${linkData.teacherName}`,
      `Subject: ${linkData.subject}`,
      `Semester: ${linkData.semester}`,
      '',
      'Submit your attendance before expiry.',
      '',
      url
    ].join('\n');
  }

  async function getLink(token) {
    const db = initFirebase();
    const snapshot = await db.collection('attendanceLinks').doc(token).get();
    if (!snapshot.exists) {
      return null;
    }

    const data = snapshot.data();
    if (data.expiresAtMs && data.expiresAtMs <= nowMs() && data.active !== false) {
      await snapshot.ref.update({ active: false, status: 'expired' });
      data.active = false;
      data.status = 'expired';
    }

    return { id: snapshot.id, ...data };
  }

  async function createLink(payload) {
    const db = initFirebase();
    const token = generateToken(10);
    const createdAtMs = nowMs();
    const expiryMinutes = Number(payload.expiryMinutes);
    const expiryAtMs = createdAtMs + expiryMinutes * 60 * 1000;
    const linkData = {
      token,
      teacherName: payload.teacherName,
      subject: payload.subject,
      semester: payload.semester,
      expiryMinutes,
      createdAtMs,
      createdAtText: formatDateTime(createdAtMs),
      expiryAtMs,
      expiryAtText: formatDateTime(expiryAtMs),
      active: true,
      status: 'active'
    };

    await db.collection('attendanceLinks').doc(token).set(linkData);
    return linkData;
  }

  async function submitAttendance(token, formData) {
    const db = initFirebase();
    const link = await getLink(token);
    if (!link || !link.active || link.expiresAtMs <= nowMs()) {
      return { ok: false, reason: 'expired' };
    }

    const rollNumber = String(formData.rollNumber || '').trim();
    const recordId = `${token}_${cleanId(rollNumber)}`;
    const recordRef = db.collection('attendanceRecords').doc(recordId);
    const linkRef = db.collection('attendanceLinks').doc(token);

    return db.runTransaction(async (transaction) => {
      const recordSnapshot = await transaction.get(recordRef);
      if (recordSnapshot.exists) {
        return { ok: false, reason: 'duplicate' };
      }

      const freshLinkSnapshot = await transaction.get(linkRef);
      if (!freshLinkSnapshot.exists) {
        return { ok: false, reason: 'invalid' };
      }

      const freshLink = freshLinkSnapshot.data();
      if (!freshLink.active || freshLink.expiresAtMs <= nowMs()) {
        transaction.update(linkRef, { active: false, status: 'expired' });
        return { ok: false, reason: 'expired' };
      }

      const submittedAtMs = nowMs();
      transaction.set(recordRef, {
        tokenId: token,
        studentName: String(formData.studentName || '').trim(),
        rollNumber,
        semester: String(formData.semester || '').trim(),
        subject: freshLink.subject,
        teacherName: String(formData.teacherName || freshLink.teacherName || '').trim(),
        submittedAtMs,
        submittedDate: formatDate(submittedAtMs),
        submittedTime: formatTime(submittedAtMs)
      });

      return { ok: true };
    });
  }

  async function fetchLinks() {
    const db = initFirebase();
    const snapshot = await db.collection('attendanceLinks').orderBy('createdAtMs', 'desc').get();
    const items = [];
    snapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
    return items;
  }

  async function fetchRecords() {
    const db = initFirebase();
    const snapshot = await db.collection('attendanceRecords').orderBy('submittedAtMs', 'desc').get();
    const items = [];
    snapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
    return items;
  }

  async function deleteRecord(recordId) {
    const db = initFirebase();
    await db.collection('attendanceRecords').doc(recordId).delete();
  }

  async function deleteLink(token) {
    const db = initFirebase();
    await db.collection('attendanceLinks').doc(token).delete();
  }

  async function refreshExpiredLinks() {
    const db = initFirebase();
    const snapshot = await db.collection('attendanceLinks').where('active', '==', true).get();
    const batch = db.batch();
    let changed = false;
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.expiresAtMs && data.expiresAtMs <= nowMs()) {
        batch.update(doc.ref, { active: false, status: 'expired' });
        changed = true;
      }
    });
    if (changed) {
      await batch.commit();
    }
  }

  function setText(id, text) {
    const node = document.getElementById(id);
    if (node) {
      node.textContent = text;
    }
  }

  function setHtml(id, html) {
    const node = document.getElementById(id);
    if (node) {
      node.innerHTML = html;
    }
  }

  function showStudentError(message) {
    setText('statusMessage', message);
    const container = document.getElementById('attendanceShell');
    if (container) {
      container.classList.add('hidden');
    }
    const errorBox = document.getElementById('attendanceError');
    if (errorBox) {
      errorBox.classList.remove('hidden');
    }
  }

  function getTokenFromUrl() {
    return new URLSearchParams(window.location.search).get('token') || '';
  }

  async function initStudentPage() {
    try {
      const token = getTokenFromUrl();
      if (!token) {
        window.location.replace('/404.html');
        return;
      }

      const link = await getLink(token);
      if (!link || !link.active || link.expiresAtMs <= nowMs()) {
        window.location.replace('/404.html');
        return;
      }

      const tokenLabel = document.getElementById('tokenLabel');
      const teacherEl = document.getElementById('teacherName');
      const subjectEl = document.getElementById('subjectName');
      const semesterEl = document.getElementById('semesterValue');
      const expiryEl = document.getElementById('expiryValue');
      const countdownEl = document.getElementById('countdownValue');
      const formSemester = document.getElementById('studentSemester');
      const hiddenToken = document.getElementById('attendanceToken');
      const teacherInput = document.getElementById('teacherNameInput');
      const hiddenSubject = document.getElementById('subjectField');

      if (tokenLabel) tokenLabel.textContent = token;
      if (teacherEl) teacherEl.textContent = link.teacherName;
      if (subjectEl) subjectEl.textContent = link.subject;
      if (semesterEl) semesterEl.textContent = link.semester;
      if (expiryEl) expiryEl.textContent = formatDateTime(link.expiresAtMs);
      if (countdownEl) countdownEl.textContent = remainingText(link.expiresAtMs);
      if (formSemester) formSemester.value = link.semester;
      if (hiddenToken) hiddenToken.value = token;
      if (teacherInput) teacherInput.value = link.teacherName;
      if (hiddenSubject) hiddenSubject.value = link.subject;

      setText('statusMessage', 'Link is active and ready for attendance submission.');

      if (state.tokenTimer) {
        clearInterval(state.tokenTimer);
      }

      state.tokenTimer = setInterval(async () => {
        const updatedLink = await getLink(token);
        if (!updatedLink || !updatedLink.active || updatedLink.expiresAtMs <= nowMs()) {
          clearInterval(state.tokenTimer);
          window.location.replace('/404.html');
          return;
        }
        if (countdownEl) countdownEl.textContent = remainingText(updatedLink.expiresAtMs);
      }, 1000);

      const form = document.getElementById('attendanceForm');
      const submitButton = document.getElementById('submitButton');
      if (form) {
        form.addEventListener('submit', async (event) => {
          event.preventDefault();
          const studentName = document.getElementById('studentName').value.trim();
          const rollNumber = document.getElementById('rollNumber').value.trim();
          const semester = document.getElementById('studentSemester').value.trim();
          const teacherName = document.getElementById('teacherNameInput').value.trim();

          if (!studentName || !rollNumber || !semester || !teacherName) {
            setText('statusMessage', 'Please fill all required fields.');
            return;
          }

          if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
          }

          try {
            const result = await submitAttendance(token, { studentName, rollNumber, semester, teacherName });
            if (!result.ok && result.reason === 'duplicate') {
              setText('statusMessage', 'Attendance Already Submitted');
              return;
            }
            if (!result.ok) {
              window.location.replace('/404.html');
              return;
            }
            setText('statusMessage', 'Attendance Submitted Successfully');
            form.reset();
            if (formSemester) formSemester.value = link.semester;
            if (teacherInput) teacherInput.value = link.teacherName;
          } catch (error) {
            setText('statusMessage', 'Unable to submit attendance right now.');
          } finally {
            if (submitButton) {
              submitButton.disabled = false;
              submitButton.textContent = 'Submit Attendance';
            }
          }
        });
      }
    } catch (error) {
      window.location.replace('/404.html');
    }
  }

  function fillSubjectOptions(semester) {
    const subjectSelect = document.getElementById('subjectInput');
    if (!subjectSelect) return;

    const subjects = SUBJECTS[semester] || [];
    subjectSelect.innerHTML = subjects.map((subject) => `<option value="${subject}">${subject}</option>`).join('');
  }

  function renderTeacherOptions() {
    const teacherSelect = document.getElementById('teacherInput');
    if (!teacherSelect) return;
    teacherSelect.innerHTML = TEACHERS.map((teacher) => `<option value="${teacher}">${teacher}</option>`).join('');
  }

  function renderSemesterOptions() {
    const semesterSelect = document.getElementById('semesterInput');
    const recordSemesterSelect = document.getElementById('recordSemesterFilter');
    [semesterSelect, recordSemesterSelect].forEach((node) => {
      if (!node) return;
      node.innerHTML = SEMESTERS.map((semester) => `<option value="${semester}">${semester}</option>`).join('');
    });
  }

  function renderLinksTable() {
    const body = document.getElementById('linksTableBody');
    if (!body) return;

    if (!state.links.length) {
      body.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-slate-500">No attendance links created yet.</td></tr>';
      return;
    }

    body.innerHTML = state.links.map((link) => {
      const active = link.active && link.expiresAtMs > nowMs();
      const remaining = active ? remainingText(link.expiresAtMs) : 'Expired';
      const badge = active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500';
      return `
        <tr class="border-t border-slate-100">
          <td class="px-4 py-3 font-mono text-sm text-slate-700">${escapeHtml(link.token)}</td>
          <td class="px-4 py-3 text-slate-700">${escapeHtml(link.teacherName)}</td>
          <td class="px-4 py-3 text-slate-600">${escapeHtml(link.subject)}</td>
          <td class="px-4 py-3 text-slate-600">${escapeHtml(link.semester)}</td>
          <td class="px-4 py-3"><span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${badge}">${active ? 'Active' : 'Expired'}</span></td>
          <td class="px-4 py-3 text-slate-600">${escapeHtml(remaining)}</td>
          <td class="px-4 py-3 text-right space-x-2">
            <button class="text-blue-700 font-medium" data-copy-link="${link.token}">Copy</button>
            <button class="text-rose-600 font-medium" data-disable-link="${link.token}">Delete</button>
          </td>
        </tr>`;
    }).join('');

    body.querySelectorAll('[data-copy-link]').forEach((button) => {
      button.addEventListener('click', async () => {
        const token = button.getAttribute('data-copy-link');
        const link = state.links.find((entry) => entry.token === token);
        if (!link) return;
        await navigator.clipboard.writeText(getAttendanceUrl(link.token));
        setText('adminNotice', 'Attendance link copied to clipboard.');
      });
    });

    body.querySelectorAll('[data-disable-link]').forEach((button) => {
      button.addEventListener('click', async () => {
        const token = button.getAttribute('data-disable-link');
        await deleteLink(token);
        await loadAdminData();
      });
    });
  }

  function renderRecordsTable() {
    const body = document.getElementById('recordsTableBody');
    if (!body) return;

    if (!state.records.length) {
      body.innerHTML = '<tr><td colspan="8" class="px-4 py-8 text-center text-slate-500">No attendance records yet.</td></tr>';
      return;
    }

    body.innerHTML = state.records.map((record) => `
      <tr class="border-t border-slate-100">
        <td class="px-4 py-3 font-mono text-sm text-slate-700">${escapeHtml(record.tokenId)}</td>
        <td class="px-4 py-3 text-slate-700">${escapeHtml(record.studentName)}</td>
        <td class="px-4 py-3 text-slate-600">${escapeHtml(record.rollNumber)}</td>
        <td class="px-4 py-3 text-slate-600">${escapeHtml(record.semester)}</td>
        <td class="px-4 py-3 text-slate-600">${escapeHtml(record.subject)}</td>
        <td class="px-4 py-3 text-slate-600">${escapeHtml(record.teacherName)}</td>
        <td class="px-4 py-3 text-slate-600">${escapeHtml(`${record.submittedDate} ${record.submittedTime}`)}</td>
        <td class="px-4 py-3 text-right">
          <button class="text-rose-600 font-medium" data-delete-record="${record.id}">Delete</button>
        </td>
      </tr>
    `).join('');

    body.querySelectorAll('[data-delete-record]').forEach((button) => {
      button.addEventListener('click', async () => {
        const recordId = button.getAttribute('data-delete-record');
        await deleteRecord(recordId);
        await loadAdminData();
      });
    });
  }

  function renderActiveLinkSummary() {
    const summary = document.getElementById('activeLinkSummary');
    if (!summary) return;
    const activeLinks = state.links.filter((link) => link.active && link.expiresAtMs > nowMs()).length;
    summary.textContent = `${activeLinks} active links`;
  }

  async function loadAdminData() {
    state.links = await fetchLinks();
    state.records = await fetchRecords();
    renderLinksTable();
    renderRecordsTable();
    renderActiveLinkSummary();
    const statsLinks = document.getElementById('totalLinksCount');
    const statsRecords = document.getElementById('totalRecordsCount');
    if (statsLinks) statsLinks.textContent = String(state.links.length);
    if (statsRecords) statsRecords.textContent = String(state.records.length);
  }

  async function initAdminPage() {
    try {
      initFirebase();
      await refreshExpiredLinks();
    } catch (error) {
      setText('adminNotice', 'Firebase is not ready. Check your configuration.');
      return;
    }

    renderTeacherOptions();
    renderSemesterOptions();
    fillSubjectOptions(document.getElementById('semesterInput')?.value || '1st Semester');

    const semesterSelect = document.getElementById('semesterInput');
    if (semesterSelect) {
      semesterSelect.addEventListener('change', () => fillSubjectOptions(semesterSelect.value));
    }

    const unlockPanel = document.getElementById('unlockPanel');
    const dashboard = document.getElementById('dashboard');
    const accessInput = document.getElementById('accessCodeInput');
    const unlockButton = document.getElementById('unlockButton');

    function unlockDashboard() {
      const code = String(accessInput?.value || '').trim();
      if (code !== ADMIN_ACCESS_CODE) {
        setText('accessMessage', 'Invalid access code.');
        return;
      }
      sessionStorage.setItem('attendanceAdminUnlocked', 'yes');
      state.unlocked = true;
      if (unlockPanel) unlockPanel.classList.add('hidden');
      if (dashboard) dashboard.classList.remove('hidden');
      loadAdminData();
      setText('adminNotice', 'Admin dashboard ready.');
    }

    if (sessionStorage.getItem('attendanceAdminUnlocked') === 'yes') {
      state.unlocked = true;
      if (unlockPanel) unlockPanel.classList.add('hidden');
      if (dashboard) dashboard.classList.remove('hidden');
      await loadAdminData();
    }

    if (unlockButton) unlockButton.addEventListener('click', unlockDashboard);
    if (accessInput) {
      accessInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') unlockDashboard();
      });
    }

    const generateForm = document.getElementById('generateForm');
    if (generateForm) {
      generateForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const teacherName = document.getElementById('teacherInput').value.trim();
        const semester = document.getElementById('semesterInput').value.trim();
        const subject = document.getElementById('subjectInput').value.trim();
        const expiryMinutes = document.getElementById('expiryInput').value.trim();

        const linkData = await createLink({ teacherName, semester, subject, expiryMinutes });
        const url = getAttendanceUrl(linkData.token);
        state.selectedLink = { ...linkData, url };

        setText('generatedToken', linkData.token);
        setText('generatedUrl', url);
        setText('generatedMeta', `${teacherName} • ${subject} • ${semester}`);
        setText('expiryMeta', `Expires at ${formatDateTime(linkData.expiryAtMs)}`);

        const whatsappButton = document.getElementById('whatsappShareButton');
        const copyButton = document.getElementById('copyLinkButton');
        if (whatsappButton) {
          whatsappButton.onclick = () => {
            const message = getShareMessage(linkData, url);
            window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
          };
        }
        if (copyButton) {
          copyButton.onclick = async () => {
            await navigator.clipboard.writeText(url);
            setText('adminNotice', 'Link copied for sharing.');
          };
        }

        generateForm.reset();
        fillSubjectOptions('1st Semester');
        await loadAdminData();
      });
    }

    const exportButton = document.getElementById('exportButton');
    if (exportButton) {
      exportButton.addEventListener('click', () => {
        exportCsv(state.records, `attendance_${new Date().toISOString().slice(0, 10)}.csv`);
      });
    }

    const refreshButton = document.getElementById('refreshButton');
    if (refreshButton) {
      refreshButton.addEventListener('click', async () => {
        await refreshExpiredLinks();
        await loadAdminData();
        setText('adminNotice', 'Dashboard refreshed.');
      });
    }

    const deleteAllButton = document.getElementById('deleteAllRecordsButton');
    if (deleteAllButton) {
      deleteAllButton.addEventListener('click', async () => {
        const db = initFirebase();
        const batch = db.batch();
        state.records.forEach((record) => {
          batch.delete(db.collection('attendanceRecords').doc(record.id));
        });
        await batch.commit();
        await loadAdminData();
      });
    }
  }

  window.AttendanceSystem = {
    initStudentPage,
    initAdminPage,
    getAttendanceUrl,
    getShareMessage,
    generateToken,
    formatDate,
    formatTime,
    formatDateTime,
    remainingText
  };
})();
