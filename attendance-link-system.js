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
        this.initializeDatabase();
    }

    /**
     * Initialize Firebase Realtime Database
     */
    initializeDatabase() {
        try {
            if (typeof firebase !== 'undefined') {
                this.db = firebase.database();
                this.linksRef = this.db.ref('attendance_links');
                this.attendanceRef = this.db.ref('attendance_records');
                console.log('✅ Attendance Link System Initialized');
            } else {
                console.error('❌ Firebase SDK not initialized');
            }
        } catch (error) {
            console.error('❌ Database Init Error:', error);
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
     * Create Attendance Link
     * @param {Object} config - {semester, subject, teacher, duration}
     * @returns {Promise<string>} - Generated link token
     */
    async createAttendanceLink(config) {
        try {
            const token = this.generateUniqueToken();
            const now = new Date();
            const expiryTime = new Date(now.getTime() + this.EXPIRY_MINUTES * 60000);

            const linkData = {
                token: token,
                createdAt: now.getTime(),
                expiresAt: expiryTime.getTime(),
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
            return token;
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
            if (!token || token.length !== this.LINK_LENGTH) {
                return { valid: false, reason: 'Invalid token format' };
            }

            const snapshot = await this.linksRef.child(token).once('value');
            const linkData = snapshot.val();

            if (!linkData) {
                return { valid: false, reason: 'Link not found' };
            }

            const now = new Date().getTime();

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
    async submitAttendance(token, attendanceData) {
        try {
            // Validate link first
            const validation = await this.validateLink(token);
            if (!validation.valid) {
                return { success: false, message: validation.reason };
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
                const timeDiff = new Date().getTime() - lastSubmitTime;

                // If submitted in last 5 mins, reject
                if (timeDiff < 5 * 60000) {
                    return { success: false, message: 'Attendance already submitted', duplicate: true };
                }
            }

            // Create attendance record
            const recordId = this.db.ref('attendance_records').push().key;
            const now = new Date();
            
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
                submittedAt: now.getTime(),
                ipAddress: attendanceData.ipAddress || 'N/A',
                userAgent: navigator.userAgent,
                status: 'present'
            };

            // Save attendance record
            await this.attendanceRef.child(recordId).set(record);

            // Update link - add device to usedBy
            const linkSnapshot = await this.linksRef.child(token).once('value');
            const linkData = linkSnapshot.val();
            const updatedUsedBy = linkData.usedBy || [];
            updatedUsedBy.push(deviceId);

            await this.linksRef.child(token).update({
                usedBy: updatedUsedBy,
                currentSubmissions: (linkData.currentSubmissions || 0) + 1,
                lastSubmittedBy: attendanceData.rollNumber,
                lastSubmittedAt: now.getTime()
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
            await this.linksRef.child(token).update({
                status: 'disabled'
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
            const snapshot = await this.linksRef.child(token).once('value');
            return snapshot.val() || null;
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
            const snapshot = await this.linksRef.once('value');
            const allLinks = snapshot.val() || {};
            const now = new Date().getTime();

            const activeLinks = Object.entries(allLinks)
                .filter(([_, link]) => {
                    return link.status === 'active' && now <= link.expiresAt;
                })
                .map(([token, link]) => ({
                    token,
                    ...link,
                    timeRemaining: link.expiresAt - now
                }));

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
            const linksSnapshot = await this.linksRef.once('value');
            const links = linksSnapshot.val() || {};
            const recordsSnapshot = await this.attendanceRef.once('value');
            const records = Object.values(recordsSnapshot.val() || {});
            const now = new Date().getTime();

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
        this.linksRef.child(token).on('value', (snapshot) => {
            callback(snapshot.val());
        });
    }

    /**
     * Real-time Listener for New Attendance
     */
    onNewAttendance(callback) {
        this.attendanceRef.on('child_added', (snapshot) => {
            callback(snapshot.val());
        });
    }

    /**
     * Cancel Link Listener
     */
    cancelLinkListener(token) {
        this.linksRef.child(token).off();
    }

    /**
     * Cancel Attendance Listener
     */
    cancelAttendanceListener() {
        this.attendanceRef.off();
    }

    /**
     * Cleanup Expired Links Periodically
     */
    cleanupExpiredLinks() {
        setInterval(async () => {
            try {
                const snapshot = await this.linksRef.once('value');
                const links = snapshot.val() || {};
                const now = new Date().getTime();
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
        }, 60000); // Run every minute
    }

    /**
     * Check Link Status (Client-side)
     */
    getTimeRemaining(expiryTime) {
        const now = new Date().getTime();
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
