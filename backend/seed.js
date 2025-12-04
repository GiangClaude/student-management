const mongoose = require('mongoose');
const Student = require('./models/Student'); // Import model

// Dữ liệu mẫu 10 học sinh
const sampleData = [
    { name: "Nguyễn Văn An", age: 10, class: "4A" },
    { name: "Trần Thị Bích", age: 11, class: "5B" },
    { name: "Lê Hoàng Cường", age: 10, class: "4A" },
    { name: "Phạm Minh Đức", age: 12, class: "6C" },
    { name: "Hoàng Mai Anh", age: 11, class: "5B" },
    { name: "Vũ Tuấn Kiệt", age: 9, class: "3A" },
    { name: "Đặng Thùy Linh", age: 12, class: "6C" },
    { name: "Bùi Văn Hùng", age: 10, class: "4B" },
    { name: "Ngô Bảo Ngọc", age: 9, class: "3A" },
    { name: "Đỗ Gia Huy", age: 11, class: "5A" }
];

// Kết nối DB và thêm dữ liệu
mongoose.connect('mongodb://localhost:27017/student_db')
    .then(async () => {
        console.log("Đang thêm dữ liệu mẫu...");
        
        // Xóa dữ liệu cũ (để tránh trùng lặp khi chạy nhiều lần)
        await Student.deleteMany({});
        
        // Thêm dữ liệu mới
        await Student.insertMany(sampleData);
        
        console.log("Đã thêm thành công 10 học sinh!");
        process.exit(); // Thoát script sau khi xong
    })
    .catch(err => {
        console.error("Lỗi:", err);
        process.exit(1);
    });