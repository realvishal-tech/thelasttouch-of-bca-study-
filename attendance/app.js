(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyC_mWJld2NksodLIg0hI_O0wuLWpUL4AoE",
    authDomain: "bca-store.firebaseapp.com",
    projectId: "bca-store",
    storageBucket: "bca-store.firebasestorage.app",
    messagingSenderId: "1063532602856",
    appId: "1:1063532602856:web:30812a52ccbded1548305d"
  };

  const COLLECTIONS = {
    links: "attendanceLinks",
    records: "attendanceRecords"
  };

  const ADMIN_SESSION_KEY = "bca-attendance-admin-session";
  const ADMIN_PASSCODE_HASH = "0d9024179214d384e2913c4eba0f5fe9033651b97f48f6717b14ddb19707b5cc";

  const TEACHERS = [
    "Raunak Sir",
    "Aman Sir",
    "Abhishek Sir",
    "Priya Ma'am",
    "Neha Ma'am",
    "Guest Faculty"
  ];

  const SEMESTERS = [
    "1st Semester",
    "2nd Semester",
    "3rd Semester",
    "4th Semester",
    "5th Semester",
    "6th Semester"
  ];

  const SUBJECTS_BY_SEMESTER = {
    "1st Semester": [
      "Mathematical Foundation",
      "Computer Fundamentals",
      "Business Communication & Information System",
      "C Programming",
      "Lab on DOS & Windows",
      "Lab on C"
    ],
    "2nd Semester": [
      "Discrete Mathematics",
      "Computer Architecture",
      "Data Structure through C",
      "System Analysis and Design",
      "Lab on MS-Office",
      "Lab on Data Structure through C"
    ],
    "3rd Semester": [
      "Fundamentals of Management & Business Accounting",
      "Database Management System",
      "Object Oriented Programming using C++",
      "Numerical Methodology",
      "Lab on DBMS (SQL/MS-ACCESS)",
      "Lab on C++"
    ],
    "4th Semester": [
      "Java Programming",
      "Computer Graphics & Multimedia",
      "Operating System & Linux",
      "Software Engineering, Principles",
      "Lab on Java Programming",
      "Lab on Computer Graphics & Linux"
    ],
    "5th Semester": [
      "Relational Database Management System",
      "Artificial Intelligence through Python Programming",
      "Web Technology (HTML, Java Script, CSS)",
      "Computer Network, Security and Cyber Law",
      "Lab on Oracle",
      "Lab on Python Programming & Web Technology"
    ],
    "6th Semester": [
      "Project Report",
      "Seminar Presentation",
      "Viva-Voce"
    ]
  };

  function initializeFirebase() {
    if (typeof firebase === "undefined") {
      throw new Error("Firebase SDK not loaded.");
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    return firebase.firestore();
  }

  class AttendanceApp {
    constructor() {
      this.db = initializeFirebase();
    }

    generateToken(length = 10) {
      const characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
      const randomValues = new Uint8Array(length);
      crypto.getRandomValues(randomValues);
      let token = "";

      for (let index = 0; index < length; index += 1) {
        token += characters[randomValues[index] % characters.length];
      }

      return token;
    }

    buildAttendanceUrl(token) {
      return `${window.location.origin}/attendance?token=${encodeURIComponent(token)}`;
    }

    normalizeRollNumber(rollNumber) {
      return String(rollNumber || "").trim().replace(/\s+/g, "").toUpperCase();
    }

    buildRecordId(token, rollNumber) {
      return `${token}_${this.normalizeRollNumber(rollNumber)}`;
    }

    getLinkStatus(link) {
      const now = Date.now();
      const expired = Number(link.expiryTime) <= now;
      const active = Boolean(link.activeStatus) && !expired;
      return {
        active,
        expired,
        label: active ? "Active" : expired ? "Expired" : "Inactive",
        countdown: this.formatCountdown(Number(link.expiryTime) - now)
      };
    }

    formatDateTime(timestamp) {
      const date = new Date(timestamp);
      return {
        date: date.toLocaleDateString("en-IN"),
        time: date.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
      };
    }

    formatCountdown(remainingMs) {
      if (remainingMs <= 0) {
        return "Expired";
      }

      const totalSeconds = Math.floor(remainingMs / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    async createLink(payload) {
      const token = this.generateToken();
      const now = Date.now();
      const expiryTime = now + Number(payload.expiryMinutes) * 60 * 1000;
      const link = {
        token,
        teacherName: payload.teacherName,
        semester: payload.semester,
        subject: payload.subject,
        createdTime: now,
        expiryTime,
        activeStatus: true
      };

      await this.db.collection(COLLECTIONS.links).doc(token).set(link);

      return {
        token,
        url: this.buildAttendanceUrl(token),
        link
      };
    }

    async getLink(token) {
      if (!token) {
        return null;
      }

      const snapshot = await this.db.collection(COLLECTIONS.links).doc(token).get();
      if (!snapshot.exists) {
        return null;
      }

      return {
        id: snapshot.id,
        ...snapshot.data()
      };
    }

    async markLinkInactive(token, extraData = {}) {
      await this.db.collection(COLLECTIONS.links).doc(token).set(
        {
          activeStatus: false,
          ...extraData
        },
        { merge: true }
      );
    }

    async validateLink(token) {
      const link = await this.getLink(token);

      if (!link) {
        return { valid: false, reason: "not-found" };
      }

      const status = this.getLinkStatus(link);
      if (!status.active) {
        if (status.expired && link.activeStatus) {
          await this.markLinkInactive(token, { expiredTime: Date.now() });
        }

        return { valid: false, reason: status.expired ? "expired" : "inactive", link };
      }

      return { valid: true, link };
    }

    async submitAttendance(payload) {
      const token = payload.token;
      const recordId = this.buildRecordId(token, payload.rollNumber);
      const linkRef = this.db.collection(COLLECTIONS.links).doc(token);
      const recordRef = this.db.collection(COLLECTIONS.records).doc(recordId);

      try {
        await this.db.runTransaction(async (transaction) => {
          const [linkSnapshot, recordSnapshot] = await Promise.all([
            transaction.get(linkRef),
            transaction.get(recordRef)
          ]);

          if (!linkSnapshot.exists) {
            throw new Error("LINK_NOT_FOUND");
          }

          const link = linkSnapshot.data();
          const status = this.getLinkStatus(link);

          if (!status.active) {
            transaction.set(linkRef, { activeStatus: false }, { merge: true });
            throw new Error(status.expired ? "LINK_EXPIRED" : "LINK_INACTIVE");
          }

          if (recordSnapshot.exists) {
            throw new Error("DUPLICATE");
          }

          const now = Date.now();
          const formatted = this.formatDateTime(now);
          transaction.set(recordRef, {
            tokenId: token,
            studentName: payload.studentName.trim(),
            rollNumber: this.normalizeRollNumber(payload.rollNumber),
            semester: payload.semester,
            subject: link.subject,
            teacherName: link.teacherName,
            date: formatted.date,
            time: formatted.time,
            submittedAt: now
          });
          transaction.set(
            linkRef,
            {
              submissionCount: Number(link.submissionCount || 0) + 1,
              lastSubmissionTime: now
            },
            { merge: true }
          );
        });

        return { success: true, message: "Attendance Submitted Successfully" };
      } catch (error) {
        if (error.message === "DUPLICATE") {
          return { success: false, message: "Attendance Already Submitted" };
        }

        if (error.message === "LINK_EXPIRED" || error.message === "LINK_INACTIVE" || error.message === "LINK_NOT_FOUND") {
          return { success: false, message: "Attendance Link Expired", expired: true };
        }

        throw error;
      }
    }

    async listLinks() {
      const snapshot = await this.db.collection(COLLECTIONS.links).orderBy("createdTime", "desc").get();
      return snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data()
      }));
    }

    async listRecords(filters = {}) {
      const snapshot = await this.db.collection(COLLECTIONS.records).orderBy("submittedAt", "desc").get();
      let records = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data()
      }));

      if (filters.semester) {
        records = records.filter((record) => record.semester === filters.semester);
      }

      if (filters.teacherName) {
        records = records.filter((record) => record.teacherName === filters.teacherName);
      }

      if (filters.subject) {
        const subjectNeedle = filters.subject.toLowerCase();
        records = records.filter((record) => String(record.subject || "").toLowerCase().includes(subjectNeedle));
      }

      if (filters.tokenId) {
        const tokenNeedle = filters.tokenId.toLowerCase();
        records = records.filter((record) => String(record.tokenId || "").toLowerCase().includes(tokenNeedle));
      }

      return records;
    }

    async deleteRecord(recordId) {
      await this.db.collection(COLLECTIONS.records).doc(recordId).delete();
    }

    async deleteRecordsByToken(token) {
      const snapshot = await this.db.collection(COLLECTIONS.records).where("tokenId", "==", token).get();
      if (snapshot.empty) {
        return 0;
      }

      const batch = this.db.batch();
      snapshot.docs.forEach((document) => batch.delete(document.ref));
      await batch.commit();
      return snapshot.size;
    }

    async deactivateLink(token) {
      await this.markLinkInactive(token, { deactivatedTime: Date.now() });
    }

    async cleanupExpiredLinks() {
      const links = await this.listLinks();
      const now = Date.now();
      const expiredActiveLinks = links.filter((link) => Boolean(link.activeStatus) && Number(link.expiryTime) <= now);

      if (!expiredActiveLinks.length) {
        return 0;
      }

      const batch = this.db.batch();
      expiredActiveLinks.forEach((link) => {
        batch.set(
          this.db.collection(COLLECTIONS.links).doc(link.id),
          { activeStatus: false, expiredTime: now },
          { merge: true }
        );
      });
      await batch.commit();
      return expiredActiveLinks.length;
    }

    downloadCsv(records, fileName = "attendance-records.csv") {
      const rows = [
        ["Student Name", "Roll Number", "Semester", "Subject", "Teacher Name", "Date", "Time", "Token ID"]
      ];

      records.forEach((record) => {
        rows.push([
          record.studentName,
          record.rollNumber,
          record.semester,
          record.subject,
          record.teacherName,
          record.date,
          record.time,
          record.tokenId
        ]);
      });

      const csvContent = rows
        .map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    buildWhatsAppMessage(details) {
      return [
        "Attendance Link",
        "",
        `Teacher: ${details.teacherName}`,
        `Subject: ${details.subject}`,
        `Semester: ${details.semester}`,
        "",
        "Submit your attendance before expiry.",
        "",
        details.url
      ].join("\n");
    }

    openWhatsAppShare(details) {
      const message = this.buildWhatsAppMessage(details);
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    }

    async copyText(value) {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        return;
      }

      const input = document.createElement("textarea");
      input.value = value;
      input.setAttribute("readonly", "");
      input.style.position = "absolute";
      input.style.left = "-9999px";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }

    startCountdown(expiryTime, callbacks = {}) {
      let intervalId = null;
      const update = () => {
        const remaining = Number(expiryTime) - Date.now();
        if (callbacks.onTick) {
          callbacks.onTick(this.formatCountdown(remaining));
        }
        if (remaining <= 0) {
          if (intervalId) {
            clearInterval(intervalId);
          }
          if (callbacks.onExpire) {
            callbacks.onExpire();
          }
        }
      };

      intervalId = window.setInterval(update, 1000);
      update();
      return () => window.clearInterval(intervalId);
    }

    redirectTo404(reason = "expired") {
      sessionStorage.setItem("attendance404State", reason);
      window.location.replace("/404.html");
    }

    async sha256(value) {
      const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
      return Array.from(new Uint8Array(buffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
    }

    async verifyAdminPasscode(passcode) {
      const hash = await this.sha256(passcode.trim());
      return hash === ADMIN_PASSCODE_HASH;
    }
  }

  window.BCAAttendance = {
    AttendanceApp,
    TEACHERS,
    SEMESTERS,
    SUBJECTS_BY_SEMESTER,
    ADMIN_SESSION_KEY
  };
})();
