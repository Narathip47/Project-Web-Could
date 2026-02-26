const express = require('express');
const path = require('path');
const db = require("./db");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));


// ==========================================
// 1. ADMIN LOGIN (เชื่อม MySQL)
// ==========================================
app.post('/checkLoginAdminData', (req, res) => {
    const { adminEmail, adminPassword } = req.body;

    const sql = `
        SELECT * FROM queue_admin
        WHERE email = ? AND password = ?
    `;

    db.query(sql, [adminEmail, adminPassword], (err, result) => {
        if (err) return res.json({ checkAdmin: false });

        if (result.length > 0) {
            res.json({
                checkAdmin: true,
                page: "/AdminSystem.html"
            });
        } else {
            res.json({
                checkAdmin: false,
                title: "Login failed",
                text: "Email or password incorrect",
                icon: "error"
            });
        }
    });
});


// ==========================================
// 2. BOOK ROOM
// ==========================================
app.post('/api/book-room', (req, res) => {
    const { name, studentId, room, date, timeSlot } = req.body;

    const checkSql = `
        SELECT * FROM queue_contact
        WHERE subject = ? AND date = ? AND message = ?
    `;

    db.query(checkSql, [room, date, timeSlot], (err, result) => {
        if (err) return res.json({ success: false });

        if (result.length > 0) {
            return res.json({
                success: false,
                message: "ห้องถูกจองแล้ว"
            });
        }

        const insertSql = `
            INSERT INTO queue_contact
            (username, email, subject, message, date)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(insertSql, [name, studentId, room, timeSlot, date], (err2) => {
            if (err2) return res.json({ success: false });
            res.json({ success: true });
        });
    });
});


// ==========================================
// GET BOOKINGS
// ==========================================
app.get('/api/getBookings', (req, res) => {
    const sql = "SELECT * FROM queue_contact ORDER BY date ASC";

    db.query(sql, (err, result) => {
        if (err) return res.json({ success: false });
        res.json({ success: true, bookings: result });
    });
});


// ==========================================
// CANCEL BOOKING
// ==========================================
app.post('/api/cancel-booking', (req, res) => {
    const { id } = req.body;

    const sql = "DELETE FROM queue_contact WHERE id = ?";

    db.query(sql, [id], (err) => {
        if (err) return res.json({ success: false });
        res.json({ success: true });
    });
});


// ==========================================
// ADMIN: GET STUDENTS
// ==========================================
app.get('/api/getUsers', (req, res) => {
    const sql = "SELECT * FROM queue_students";

    db.query(sql, (err, result) => {
        if (err) return res.json({ success: false });
        res.json({ success: true, users: result });
    });
});


// ==========================================
// 3. DASHBOARD SUMMARY
// ==========================================
app.get('/api/dashboard', (req, res) => {

    const sqlBookings = "SELECT COUNT(*) AS total FROM queue_contact";
    const sqlStudents = "SELECT COUNT(*) AS total FROM queue_students";

    db.query(sqlBookings, (err, bResult) => {
        if (err) return res.json({ success: false });

        db.query(sqlStudents, (err2, sResult) => {
            if (err2) return res.json({ success: false });

            res.json({
                countBookings: bResult[0].total,
                countStudents: sResult[0].total,
                countAdmin: 1
            });
        });
    });
});


// ==========================================
// 4. REGISTER STUDENT
// ==========================================
app.post('/api/register', (req, res) => {
    const { student_id, name, password } = req.body;

    if (!student_id || !name || !password) {
        return res.json({
            success: false,
            message: "กรอกข้อมูลให้ครบ"
        });
    }

    // เช็คว่ามี studentId นี้ในระบบแล้วไหม
    const checkSql = `
        SELECT * FROM queue_students
        WHERE student_id = ?
    `;

    db.query(checkSql, [student_id], (err, result) => {
        if (err) return res.json({ success: false });

        if (result.length > 0) {
            return res.json({
                success: false,
                message: "รหัสนักศึกษานี้ถูกใช้แล้ว"
            });
        }

        // ถ้ายังไม่มี → สมัครได้
        const insertSql = `
            INSERT INTO queue_students (student_id, username, password)
            VALUES (?, ?, ?)
        `;

        db.query(insertSql, [student_id, name, password], (err2) => {
            if (err2) return res.json({ success: false });

            res.json({
                success: true,
                message: "สมัครสำเร็จ"
            });
        });
    });
});


// ==========================================
// STUDENT LOGIN
// ==========================================
app.post('/api/login', (req, res) => {
    const { student_id, password } = req.body;

    if (!student_id || !password) {
        return res.json({ success: false, message: "กรอกข้อมูลไม่ครบ" });
    }

    const sql = `
        SELECT * FROM queue_students
        WHERE student_id = ? AND password = ?
    `;

    db.query(sql, [student_id, password], (err, result) => {
        if (err) return res.json({ success: false });

        if (result.length > 0) {
            res.json({
                success: true,
                user: {
                    studentId: result[0].student_id,
                    name: result[0].username
                }
            });
        } else {
            res.json({
                success: false,
                message: "รหัสหรือรหัสผ่านผิด"
            });
        }
    });
});


// ==========================================
// DASHBOARD CHART DATA
// ==========================================
app.get('/api/dashboard-chart', (req, res) => {

    const sql = `
        SELECT subject AS room, date, message AS timeSlot
        FROM queue_contact
    `;

    db.query(sql, (err, result) => {
        if (err) return res.json({ success: false });

        const bookingByDate = {};
        const bookingByRoom = {};
        const bookingByTime = {};

        result.forEach(b => {
            bookingByDate[b.date] = (bookingByDate[b.date] || 0) + 1;
            bookingByRoom[b.room] = (bookingByRoom[b.room] || 0) + 1;
            bookingByTime[b.timeSlot] = (bookingByTime[b.timeSlot] || 0) + 1;
        });

        res.json({
            byDate: bookingByDate,
            byRoom: bookingByRoom,
            byTime: bookingByTime
        });
    });
});


// ==========================================
// START SERVER
// ==========================================
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});