const Student = require('../models/Student');

// Xử lý lấy danh sách học sinh
//Bài 1: Hiển thị list student
exports.getStudents = async (req, res) => {
    try {
        const students = await Student.find(); // [cite: 62]
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Thêm học sinh mới
//Bài 2: Thêm student
exports.createStudent = async (req, res) => {
    try {
        const newStudent = new Student(req.body); // Tạo đối tượng từ dữ liệu gửi lên
        await newStudent.save(); // Lưu vào MongoDB
        res.status(201).json(newStudent); // Trả về dữ liệu vừa tạo (201 Created)
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


// Cập nhật thông tin học sinh
//Bài 3: Sửa thông tin student
exports.updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedStudent = await Student.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true } // Trả về dữ liệu MỚI sau khi update
        );

        if (!updatedStudent) {
            return res.status(404).json({ error: "Không tìm thấy học sinh" });
        }

        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Xóa học sinh
//Bài 4: Xóa student
exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStudent = await Student.findByIdAndDelete(id); // [cite: 244]

        if (!deletedStudent) {
            return res.status(404).json({ error: "Không tìm thấy học sinh để xóa" });
        }

        res.json({ message: "Đã xóa học sinh thành công", id: deletedStudent._id }); // [cite: 247]
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
