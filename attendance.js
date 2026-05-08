/**
 * BCA STORE - Attendance Management System
 * Core Logic for Admin Panel
 */

// Subjects Mapping as per prompt
const ATTENDANCE_SUBJECTS = {
    Semester1: [
        "Mathematical Foundation (BCA-101)",
        "Computer Fundamentals (BCA-102)",
        "Business Communication & Information System (BCA-103)",
        "C Programming (BCA-104)",
        "Lab on DOS & Windows (BCA-105)",
        "Lab on C (BCA-106)"
    ],
    Semester2: [
        "Discrete Mathematics (BCA-201)",
        "Computer Architecture (BCA-202)",
        "Data Structure through C (BCA-203)",
        "System Analysis and Design (BCA-204)",
        "Lab on MS-Office (BCA-205)",
        "Lab on Data Structure through C (BCA-206)"
    ],
    Semester3: [
        "Fundamentals of Management & Business Accounting (BCA-301)",
        "Database Management System (BCA-302)",
        "Object Oriented Programming using C++ (BCA-303)",
        "Numerical Methodology (BCA-304)",
        "Lab on DBMS (SQL/MS-ACCESS) (BCA-305)",
        "Lab on C++ (BCA-306)"
    ],
    Semester4: [
        "Java Programming (BCA-401)",
        "Computer Graphics & Multimedia (BCA-402)",
        "Operating System & Linux (BCA-403)",
        "Software Engineering, Principles (BCA-404)",
        "Lab on Java Programming (BCA-405)",
        "Lab on Computer Graphics & Linux (BCA-406)"
    ],
    Semester5: [
        "Relational Database Management System (BCA-501)",
        "Artificial Intelligence through Python Programming (BCA-502)",
        "Web Technology (HTML, Java Script, CSS) (BCA-503)",
        "Computer Network, Security and Cyber Law (BCA-504)",
        "Lab on Oracle (BCA-505)",
        "Lab on Python Programming & Web Technology (BCA-506)"
    ],
    Semester6: [
        "Project Report (BCA-601)",
        "Seminar Presentation (BCA-602)",
        "Viva-Voce (BCA-603)"
    ]
};

let fs = null;
let currentSession = null;
let sessionTimer = null;

// Initialize Firestore
function initAttendanceFirestore() {
    try {
        if (typeof firebase !== 'undefined') {
            fs = firebase.firestore();
            console.log("✅ Firestore Initialized for Attendance");
            loadAttendanceRecords();
        } else {
            console.error("❌ Firebase SDK not found");
        }
    } catch (e) {
        console.error("❌ Firestore Init Error:", e);
    }
}

// Update Subject Dropdown based on Semester
function updateAttendanceSubjectDropdown() {
    const sem = document.getElementById('attSemester').value;
    const subSelect = document.getElementById('attSubject');
    subSelect.innerHTML = '<option value="">— Select Subject —</option>';
    
    if (sem && ATTENDANCE_SUBJECTS[sem]) {
        ATTENDANCE_SUBJECTS[sem].forEach(sub => {
            const opt = document.createElement('option');
            opt.value = sub;
            opt.textContent = sub;
            subSelect.appendChild(opt);
        });
    }
}

// Start Attendance Session
async function startAttendanceSession() {
    const teacher = document.getElementById('attTeacherName').value.trim();
    const sem = document.getElementById('attSemester').value;
    const sub = document.getElementById('attSubject').value;
    const btnLoader = document.getElementById('attBtnLoader');

    if (!teacher || !sem || !sub) {
        showToast("❌ Please fill all required fields.", "error");
        return;
    }

    if (!fs) {
        showToast("❌ Firebase not connected. Please check your internet or configuration.", "error");
        console.error("Firestore (fs) is null. Check if Firebase is properly initialized.");
        return;
    }

    if (btnLoader) btnLoader.style.display = 'block';

    const sessionId = "att_" + Date.now().toString(36);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 5 * 60000); // 5 minutes later

    const sessionData = {
        sessionId,
        teacherName: teacher,
        semester: sem,
        subject: sub,
        date: now.toLocaleDateString('en-IN'),
        startTime: now.getTime(),
        expiresAt: expiresAt.getTime(),
        active: true
    };

    try {
        await fs.collection('attendance_sessions').doc(sessionId).set(sessionData);
        currentSession = sessionData;
        showActiveSessionUI(sessionData);
        showToast("✅ Attendance session started!", "success");
    } catch (e) {
        console.error("Error starting session:", e);
        showToast("❌ Failed to start session.", "error");
    } finally {
        if (btnLoader) btnLoader.style.display = 'none';
    }
}

// Show Active Session UI
function showActiveSessionUI(session) {
    const card = document.getElementById('activeSessionCard');
    const details = document.getElementById('activeSessionDetails');
    const linkInput = document.getElementById('attendanceLinkInput');
    const qrContainer = document.getElementById('qrcode');

    if (!card) return;

    card.style.display = 'block';
    details.innerHTML = `<strong>${session.subject}</strong> | Sem: ${session.semester.replace('Semester','')} | Prof. ${session.teacherName}`;
    
    // Robust URL generation for Netlify and local environments
    const fullUrl = new URL('attendance-session.html', window.location.href).href + '?id=' + session.sessionId;
    
    linkInput.value = fullUrl;

    // Generate QR Code
    qrContainer.innerHTML = "";
    new QRCode(qrContainer, {
        text: fullUrl,
        width: 128,
        height: 128,
        colorDark: "#0f172a",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    // Start Timer
    startSessionTimer(session.expiresAt);
    
    // Auto-scroll to active session
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Session Timer Logic
function startSessionTimer(expiryTs) {
    if (sessionTimer) clearInterval(sessionTimer);
    
    const display = document.getElementById('sessionCountdown');
    
    sessionTimer = setInterval(() => {
        const now = Date.now();
        const diff = expiryTs - now;
        
        if (diff <= 0) {
            clearInterval(sessionTimer);
            if (display) display.textContent = "EXPIRED";
            stopAttendanceSession(true);
            return;
        }
        
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        if (display) display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        // Visual warning for last minute
        if (diff < 60000) {
            display.style.background = "#ef4444";
            display.classList.add('pulse-animation');
        } else {
            display.style.background = "#3b82f6";
        }
    }, 1000);
}

// Stop Session
async function stopAttendanceSession(auto = false) {
    if (!currentSession) return;
    
    try {
        await fs.collection('attendance_sessions').doc(currentSession.sessionId).update({ active: false });
        if (!auto) {
            showToast("🛑 Session stopped manually.", "info");
            document.getElementById('activeSessionCard').style.display = 'none';
        } else {
            showToast("⌛ Session expired automatically.", "warning");
        }
        currentSession = null;
        if (sessionTimer) clearInterval(sessionTimer);
    } catch (e) {
        console.error("Error stopping session:", e);
    }
}

// Copy Link
function copyAttendanceLink() {
    const inp = document.getElementById('attendanceLinkInput');
    inp.select();
    document.execCommand('copy');
    showToast("📋 Link copied to clipboard!", "success");
}

// WhatsApp Share
function shareOnWhatsApp() {
    if (!currentSession) {
        showToast("❌ No active session to share.", "error");
        return;
    }
    const url = document.getElementById('attendanceLinkInput').value;
    const text = encodeURIComponent(`📍 *BCA STORE - ATTENDANCE ALERT*\n\n*Subject:* ${currentSession.subject}\n*Teacher:* ${currentSession.teacherName}\n*Semester:* ${currentSession.semester.replace('Semester', 'Semester ')}\n\nClick the link below to mark your attendance (Valid for 5 mins only):\n🔗 ${url}\n\n_Note: Please mark your attendance promptly._`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

// Load Records
function loadAttendanceRecords() {
    const table = document.getElementById('attendanceRecordsTable');
    const empty = document.getElementById('attendanceEmpty');
    
    if (!fs || !table) return;

    const dateFilter = document.getElementById('filterAttDate').value;
    const semFilter = document.getElementById('filterAttSem').value;
    const rollFilter = document.getElementById('filterAttRoll').value.trim();

    let query = fs.collection('attendance_records').orderBy('timestamp', 'desc');

    // Note: Complex queries in Firestore might require indexes. 
    // We'll do basic filtering in JS for simplicity unless indexes are provided.
    
    query.limit(100).onSnapshot(snap => {
        if (snap.empty) {
            table.innerHTML = "";
            empty.style.display = 'block';
            return;
        }

        let records = [];
        snap.forEach(doc => records.push(doc.data()));

        // Client-side filtering for better UX without index errors
        const filtered = records.filter(r => {
            let match = true;
            if (dateFilter) {
                const rDate = new Date(r.timestamp).toISOString().split('T')[0];
                if (rDate !== dateFilter) match = false;
            }
            if (semFilter && r.semester !== semFilter) match = false;
            if (rollFilter && !r.rollNumber.includes(rollFilter)) match = false;
            return match;
        });

        if (filtered.length === 0) {
            table.innerHTML = "";
            empty.style.display = 'block';
        } else {
            empty.style.display = 'none';
            table.innerHTML = filtered.map(r => `
                <tr>
                    <td style="font-weight:600; color:#f8fafc;">${r.studentName}</td>
                    <td><span style="background:rgba(255,255,255,0.05); padding:2px 8px; border-radius:4px;">${r.rollNumber}</span></td>
                    <td>${r.semester.replace('Semester','Sem ')}</td>
                    <td title="${r.subject}">${r.subject.length > 20 ? r.subject.substring(0,20)+'...' : r.subject}</td>
                    <td>${r.teacherName}</td>
                    <td>${r.date}</td>
                    <td>${r.time}</td>
                    <td><span style="color:#10b981;">● Present</span></td>
                </tr>
            `).join('');
        }
    });
}

// Export Functionality
function exportAttendance(format) {
    const rows = [];
    const tableRows = document.querySelectorAll("#attendanceRecordsTable tr");
    
    if (tableRows.length === 0) {
        showToast("❌ No records to export.", "error");
        return;
    }

    // Headers
    rows.push(["Student Name", "Roll Number", "Semester", "Subject", "Teacher", "Date", "Time", "Status"]);

    tableRows.forEach(tr => {
        const cells = tr.querySelectorAll("td");
        rows.push([
            cells[0].innerText,
            cells[1].innerText,
            cells[2].innerText,
            cells[3].innerText,
            cells[4].innerText,
            cells[5].innerText,
            cells[6].innerText,
            cells[7].innerText
        ]);
    });

    if (format === 'csv') {
        const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `BCA_Attendance_${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(link);
        link.click();
    } else if (format === 'excel') {
        const ws = XLSX.utils.aoa_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Attendance");
        XLSX.writeFile(wb, `BCA_Attendance_${new Date().toLocaleDateString()}.xlsx`);
    } else if (format === 'pdf') {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text("BCA STORE - Attendance Records", 14, 15);
        doc.autoTable({
            head: [rows[0]],
            body: rows.slice(1),
            startY: 20,
            theme: 'grid',
            styles: { fontSize: 8 }
        });
        doc.save(`BCA_Attendance_${new Date().toLocaleDateString()}.pdf`);
    }
}

// Check for any existing active session on load
async function checkActiveSession() {
    if (!fs) return;
    try {
        const snap = await fs.collection('attendance_sessions')
            .where('active', '==', true)
            .get();
        
        if (!snap.empty) {
            // Sort by startTime desc in JS to avoid composite index requirement
            const sessions = snap.docs.map(d => d.data()).sort((a,b) => b.startTime - a.startTime);
            const session = sessions[0];
            if (Date.now() < session.expiresAt) {
                currentSession = session;
                showActiveSessionUI(session);
            } else {
                // Auto-stop if found expired
                await fs.collection('attendance_sessions').doc(session.sessionId).update({ active: false });
            }
        }
    } catch (e) {
        console.error("Error checking active session:", e);
    }
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    initAttendanceFirestore();
    setTimeout(checkActiveSession, 1000); // Small delay to ensure FS is ready
});
