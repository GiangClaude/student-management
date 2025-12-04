const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const studentRoutes = require('./routes/studentRoutes'); // Import routes

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// app.use((req, res, next) => {
//   console.log(`👉 Server nhận yêu cầu: [${req.method}] ${req.url}`);
//   next();
// });



// Kết nối MongoDB [cite: 47]
mongoose.connect('mongodb://localhost:27017/student_db')
    .then(() => console.log("Đã kết nối MongoDB"))
    .catch(err => console.error("Lỗi kết nối MongoDB:", err));

// Sử dụng Routes
app.use('/api/students', studentRoutes); // [cite: 69]

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});