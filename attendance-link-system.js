/**
 * BCA STORE - Secure Temporary Attendance Link System
 * Production-Ready With Firebase Integration
 * Features: One-time links, 5-min expiry, Device lock, Anti-bypass validation
 */

class AttendanceLinkSystem {
    constructor() {
        this.db = null;
        this.linksRef = null;
        this.attendanceRef = null;
        this.EXPIRY_MINUTES = 5;
        this.LINK_LENGTH = 10;
        this.serverTimeOffset = 0;
        this._cache = {};
        this.readyPromise = this.initializeDatabase();
    }

    /**
     * Load Firebase SDK scripts dynamically when not present to avoid blocking page load
     */
    async loadFirebaseScripts() {
        if (typeof window === 'undefined') return;

        if (typeof firebase !== 'undefined') return;

        // Avoid duplicate injection
        if (this._loadingFirebase) {
            return this._loadingFirebase;
        }

        this._loadingFirebase = new Promise((resolve, reject) => {
            try {
                const urls = [
                    'https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js',
                    'https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js'
                ];

                let loaded = 0;

                urls.forEach(src => {
                    const s = document.createElement('script');
                    s.src = src;
                    s.async = true;
                    s.onload = () => {
                        loaded += 1;
                        if (loaded === urls.length) {
                            // small delay to allow firebase to initialize
                            setTimeout(() => resolve(), 50);
                        }
                    };
                    s.onerror = (e) => reject(new Error('Failed loading ' + src));
                    document.head.appendChild(s);
                });
            } catch (err) {
                reject(err);
            }
        });

        return this._loadingFirebase;
    }

    /**
     * Initialize Firebase Realtime Database
     */
    initializeDatabase() {
        try {
            // If firebase is not yet present, load scripts lazily
            return (async () => {
                if (typeof firebase === 'undefined') {
                    await this.loadFirebaseScripts();
                }

                if (typeof firebase !== 'undefined') {
                    // Ensure app is initialized (support pages that only provide config object)
                    try {
                        const hasApp = firebase.apps && firebase.apps.length > 0;
                        const config = (typeof window !== 'undefined' && window.FIREBASE_CONFIG) ? window.FIREBASE_CONFIG : (typeof firebaseConfig !== 'undefined' ? firebaseConfig : null);
                        if (!hasApp && config) {
                            firebase.initializeApp(config);
                        }
                    } catch (e) {
                        // ignore
                    }

                    this.db = firebase.database();
                    this.linksRef = this.db.ref('attendance_links');
                    this.attendanceRef = this.db.ref('attendance_records');
                    this.syncServerTime();
                    console.log('✅ Attendance Link System Initialized');
                } else {
                    console.error('❌ Firebase SDK not initialized');
                }
            })();
        } catch (error) {
            console.error('❌ Database Init Error:', error);
            return Promise.resolve();
        }
    }

    async ensureReady() {
        if (this.readyPromise) {
            await this.readyPromise;
        }
    }

    /**
     * Keep client expiry checks aligned with Firebase server time
     */
    syncServerTime() {
        try {
            if (!this.db) {
                return;
            }

            this.db.ref('.info/serverTimeOffset').on('value', (snapshot) => {
                const offset = snapshot.val();
                this.serverTimeOffset = typeof offset === 'number' ? offset : 0;
            });
        } catch (error) {
            console.warn('⚠️ Server time sync unavailable, falling back to client time');
        }
    }

    /**
     * Generate Unique Token (Cryptographically Secure)
     * Format: /a7xK29LmQp
     */
    generateUniqueToken() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        const randomValues = new Uint8Array(this.LINK_LENGTH);
        crypto.getRandomValues(randomValues);

        for (let i = 0; i < this.LINK_LENGTH; i++) {
            token += chars[randomValues[i] % chars.length];
        }
        return token;
    }

    /**
     * Get Device ID (Browser Fingerprint + IP-like identifier)
     */
    getDeviceId() {
        let deviceId = localStorage.getItem('device_id');
        
        if (!deviceId) {
            // Generate unique device fingerprint
            const navigator_data = `${navigator.userAgent}${navigator.language}${new Date().getTime()}`;
            deviceId = btoa(navigator_data).substring(0, 32);
            localStorage.setItem('device_id', deviceId);
        }
        
        return deviceId;
    }

    /**
     * Get current timestamp using Firebase server offset when available
     */
    getCurrentTimestamp() {
        return Date.now() + this.serverTimeOffset;
    }

    /**
     * Create Attendance Link
     * @param {Object} config - {semester, subject, teacher, duration}
     * @returns {Promise<string>} - Generated link token
     */
    async createAttendanceLink(config) {
        try {
            await this.ensureReady();
            const token = this.generateUniqueToken();
            const now = this.getCurrentTimestamp();
            const expiryTime = now + this.EXPIRY_MINUTES * 60000;

            const linkData = {
                token: token,
                createdAt: now,
                expiresAt: expiryTime,
                semester: config.semester || '',
                subject: config.subject || '',
                teacher: config.teacher || '',
                status: 'active',
                usedBy: [],
                submitted: false,
                createdBy: config.createdBy || 'admin',
                totalAllowedSubmissions: 999, // Unlimited per link, but one per student
                currentSubmissions: 0,
                notes: config.notes || ''
            };

            // Save to Firebase
            await this.linksRef.child(token).set(linkData);

            // Auto-deactivate after expiry (Safety mechanism)
            setTimeout(() => {
                this.deactivateLink(token);
            }, this.EXPIRY_MINUTES * 60000 + 1000);

            console.log(`✅ Link Created: ${token}`);
            // Return token and link snapshot to avoid an extra read by the caller
            // Also cache briefly for immediate reads
            this.cacheSet('link:' + token, linkData, 5000);
            return { token, data: linkData };
        } catch (error) {
            console.error('❌ Link Creation Error:', error);
            throw error;
        }
    }

    /**
     * Validate Attendance Link
     * @param {string} token - Link token
     * @returns {Promise<Object>} - {valid: boolean, data: linkData, reason: string}
     */
    async validateLink(token) {
        try {
            await this.ensureReady();
            if (!token || token.length !== this.LINK_LENGTH) {
                return { valid: false, reason: 'Invalid token format' };
            }

            const snapshot = await this.linksRef.child(token).once('value');
            const linkData = snapshot.val();

            if (!linkData) {
                return { valid: false, reason: 'Link not found' };
            }

            const now = this.getCurrentTimestamp();

            // Check if expired
            if (now > linkData.expiresAt) {
                await this.deactivateLink(token);
                return { valid: false, reason: 'Link expired', expired: true };
            }

            // Check if already submitted
            if (linkData.status === 'used' || linkData.status === 'disabled') {
                return { valid: false, reason: 'Link is no longer active' };
            }

            // Check if device already used this link
            const deviceId = this.getDeviceId();
            if (linkData.usedBy && linkData.usedBy.includes(deviceId)) {
                return { valid: false, reason: 'Attendance already submitted from this device', duplicate: true };
            }

            return { 
                valid: true, 
                data: linkData,
                timeRemaining: linkData.expiresAt - now
            };
        } catch (error) {
            console.error('❌ Link Validation Error:', error);
            return { valid: false, reason: 'Validation error' };
        }
    }

    /**
     * Submit Attendance via Link
     * @param {string} token - Link token
     * @param {Object} attendanceData - Student attendance info
     * @returns {Promise<Object>} - {success: boolean, message: string}
     */
    async submitAttendance(token, attendanceData, options = {}) {
        try {
            await this.ensureReady();
            const now = this.getCurrentTimestamp();

            // Reuse a fresh snapshot from the form page when available.
            if (options.cachedLinkData) {
                const cachedLink = options.cachedLinkData;

                if (cachedLink.status === 'used' || cachedLink.status === 'disabled') {
                    return { success: false, message: 'Link is no longer active' };
                }

                if (now > cachedLink.expiresAt) {
                    await this.deactivateLink(token);
                    return { success: false, message: 'Link expired' };
                }
            } else {
                // Validate link first when no cached snapshot is provided
                const validation = await this.validateLink(token);
                if (!validation.valid) {
                    return { success: false, message: validation.reason };
                }
            }

            const deviceId = this.getDeviceId();
            // Check duplicate submission for same roll number
            const rollCheckSnapshot = await this.attendanceRef
                .orderByChild('rollNumber')
                .equalTo(attendanceData.rollNumber)
                .limitToLast(1)
                .once('value');

            const existingRecords = rollCheckSnapshot.val();
            if (existingRecords) {
                const lastRecord = Object.values(existingRecords)[0];
                const lastSubmitTime = lastRecord.submittedAt || 0;
                const timeDiff = now - lastSubmitTime;

                // If submitted in last 5 mins, reject
                if (timeDiff < 5 * 60000) {
                    return { success: false, message: 'Attendance already submitted', duplicate: true };
                }
            }

            // Create attendance record
            const recordId = this.db.ref('attendance_records').push().key;
            
            const record = {
                recordId: recordId,
                token: token,
                studentName: attendanceData.studentName || '',
                rollNumber: attendanceData.rollNumber || '',
                semester: attendanceData.semester || '',
                subject: attendanceData.subject || '',
                teacher: attendanceData.teacher || '',
                date: attendanceData.date || this.formatDate(now),
                time: attendanceData.time || this.formatTime(now),
                deviceId: deviceId,
                submittedAt: now,
                ipAddress: attendanceData.ipAddress || 'N/A',
                userAgent: navigator.userAgent,
                status: 'present'
            };

            // Save attendance record
            await this.attendanceRef.child(recordId).set(record);
            // Update link atomically using a transaction to avoid race conditions
            await this.linksRef.child(token).transaction((current) => {
                if (!current) return current;

                const usedBy = Array.isArray(current.usedBy) ? current.usedBy : [];
                if (!usedBy.includes(deviceId)) usedBy.push(deviceId);

                current.usedBy = usedBy;
                current.currentSubmissions = (current.currentSubmissions || 0) + 1;
                current.lastSubmittedBy = attendanceData.rollNumber;
                current.lastSubmittedAt = now;

                return current;
            });

            // Schedule link deactivation
            setTimeout(() => {
                this.deactivateLink(token);
            }, this.EXPIRY_MINUTES * 60000);

            console.log(`✅ Attendance Submitted: ${recordId}`);
            return { 
                success: true, 
                message: 'Attendance recorded successfully', 
                recordId: recordId 
            };
        } catch (error) {
            console.error('❌ Attendance Submission Error:', error);
            return { success: false, message: 'Error recording attendance' };
        }
    }

    /**
     * Deactivate/Disable Link
     */
    async deactivateLink(token) {
        try {
            await this.ensureReady();
            await this.linksRef.child(token).update({
                status: 'disabled',
                disabledAt: this.getCurrentTimestamp()
            });
            console.log(`✅ Link Deactivated: ${token}`);
        } catch (error) {
            console.error('❌ Link Deactivation Error:', error);
        }
    }

    /**
     * Get Link Details
     */
    async getLinkDetails(token) {
        try {
            await this.ensureReady();
            const cacheKey = 'link:' + token;
            const cached = this.cacheGet(cacheKey);
            if (cached) return cached;

            const snapshot = await this.linksRef.child(token).once('value');
            const data = snapshot.val() || null;
            if (data) this.cacheSet(cacheKey, data, 3000);
            return data;
        } catch (error) {
            console.error('❌ Error fetching link details:', error);
            return null;
        }
    }

    /**
     * Get All Active Links (for admin)
     */
    async getActiveLinks() {
        try {
            await this.ensureReady();
            const cacheKey = 'activeLinks';
            const cached = this.cacheGet(cacheKey);
            if (cached) return cached;

            const snapshot = await this.linksRef.once('value');
            const allLinks = snapshot.val() || {};
            const now = this.getCurrentTimestamp();

            const activeLinks = Object.entries(allLinks)
                .filter(([_, link]) => {
                    return link.status === 'active' && now <= link.expiresAt;
                })
                .map(([token, link]) => ({
                    token,
                    ...link,
                    timeRemaining: link.expiresAt - now
                }));

            this.cacheSet(cacheKey, activeLinks, 2000);
            return activeLinks;
        } catch (error) {
            console.error('❌ Error fetching active links:', error);
            return [];
        }
    }

    /**
     * Get Attendance Records (with filters)
     */
    async getAttendanceRecords(filters = {}) {
        try {
            await this.ensureReady();
            let query = this.attendanceRef;
            const snapshot = await query.once('value');
            let records = Object.values(snapshot.val() || {});

            // Apply filters
            if (filters.teacher) {
                records = records.filter(r => r.teacher === filters.teacher);
            }
            if (filters.semester) {
                records = records.filter(r => r.semester === filters.semester);
            }
            if (filters.subject) {
                records = records.filter(r => r.subject === filters.subject);
            }
            if (filters.date) {
                records = records.filter(r => r.date === filters.date);
            }
            if (filters.rollNumber) {
                records = records.filter(r => r.rollNumber === filters.rollNumber);
            }

            return records.sort((a, b) => b.submittedAt - a.submittedAt);
        } catch (error) {
            console.error('❌ Error fetching attendance records:', error);
            return [];
        }
    }

    /**
     * Export Attendance Data (CSV)
     */
    async exportAttendanceCSV(records, filename = 'attendance.csv') {
        try {
            await this.ensureReady();
            if (!records || records.length === 0) {
                console.warn('⚠️ No records to export');
                return;
            }

            // Prepare CSV headers
            const headers = ['Roll No', 'Name', 'Subject', 'Semester', 'Teacher', 'Date', 'Time', 'Status'];
            const csvContent = [
                headers.join(','),
                ...records.map(r => [
                    r.rollNumber,
                    r.studentName,
                    r.subject,
                    r.semester,
                    r.teacher,
                    r.date,
                    r.time,
                    r.status
                ].map(field => `"${field}"`).join(','))
            ].join('\n');

            // Create blob and download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log(`✅ Attendance exported: ${filename}`);
        } catch (error) {
            console.error('❌ Export Error:', error);
        }
    }

    /**
     * Get Analytics
     */
    async getAnalytics() {
        try {
            await this.ensureReady();
            const linksSnapshot = await this.linksRef.once('value');
            const links = linksSnapshot.val() || {};
            const recordsSnapshot = await this.attendanceRef.once('value');
            const records = Object.values(recordsSnapshot.val() || {});
            const now = this.getCurrentTimestamp();

            const analytics = {
                totalLinksCreated: Object.keys(links).length,
                activeLinks: Object.values(links).filter(l => l.status === 'active' && now <= l.expiresAt).length,
                expiredLinks: Object.values(links).filter(l => now > l.expiresAt).length,
                totalAttendanceSubmitted: records.length,
                todayAttendance: records.filter(r => r.date === this.formatDate(new Date())).length,
                uniqueStudents: new Set(records.map(r => r.rollNumber)).size,
                byTeacher: this.groupBy(records, 'teacher'),
                bySemester: this.groupBy(records, 'semester'),
                bySubject: this.groupBy(records, 'subject'),
                byDate: this.groupBy(records, 'date')
            };

            return analytics;
        } catch (error) {
            console.error('❌ Analytics Error:', error);
            return {};
        }
    }

    /**
     * Helper: Group array by property
     */
    groupBy(arr, prop) {
        return arr.reduce((groups, item) => {
            const value = item[prop];
            if (!groups[value]) groups[value] = 0;
            groups[value]++;
            return groups;
        }, {});
    }

    /**
     * Helper: Format Date
     */
    formatDate(date) {
        const d = new Date(date);
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    }

    /**
     * Helper: Format Time
     */
    formatTime(date) {
        const d = new Date(date);
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    /**
     * Real-time Listener for Link Status
     */
    onLinkStatusChange(token, callback) {
        this.ensureReady().then(() => {
        this.linksRef.child(token).on('value', (snapshot) => {
            callback(snapshot.val());
        });
        });
    }

    /**
     * Real-time Listener for New Attendance
     */
    onNewAttendance(callback) {
        this.ensureReady().then(() => {
        this.attendanceRef.on('child_added', (snapshot) => {
            callback(snapshot.val());
        });
        });
    }

    /**
     * Cancel Link Listener
     */
    cancelLinkListener(token) {
        if (!this.linksRef) return;
        this.linksRef.child(token).off();
    }

    /**
     * Cancel Attendance Listener
     */
    cancelAttendanceListener() {
        if (!this.attendanceRef) return;
        this.attendanceRef.off();
    }

    /**
     * Cleanup Expired Links Periodically
     */
    cleanupExpiredLinks() {
        this.ensureReady().then(() => {
        setInterval(async () => {
            try {
                const snapshot = await this.linksRef.once('value');
                const links = snapshot.val() || {};
                const now = this.getCurrentTimestamp();
                const updates = {};

                for (const [token, link] of Object.entries(links)) {
                    if (now > link.expiresAt && link.status === 'active') {
                        updates[token + '/status'] = 'expired';
                    }
                }

                if (Object.keys(updates).length > 0) {
                    await this.linksRef.update(updates);
                    console.log('✅ Cleanup: Expired links marked');
                }
            } catch (error) {
                console.error('❌ Cleanup Error:', error);
            }
        }, 300000); // Run every 5 minutes to reduce DB load
        });
    }

    /* Simple in-memory cache helpers */
    cacheGet(key) {
        const entry = this._cache[key];
        if (!entry) return null;
        if (Date.now() > entry.expiresAt) {
            delete this._cache[key];
            return null;
        }
        return entry.value;
    }

    cacheSet(key, value, ttl = 2000) {
        this._cache[key] = { value, expiresAt: Date.now() + ttl };
    }

    /**
     * Check Link Status (Client-side)
     */
    getTimeRemaining(expiryTime) {
        const now = this.getCurrentTimestamp();
        const remaining = expiryTime - now;

        if (remaining <= 0) return { expired: true, message: 'Expired' };

        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);

        return {
            expired: false,
            minutes,
            seconds,
            message: `${minutes}m ${seconds}s`
        };
    }
}

// Export for use
const attendanceLinkSystem = new AttendanceLinkSystem();
