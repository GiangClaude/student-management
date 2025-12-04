const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentControllers');


// Lấy danh sách
router.get('/', studentController.getStudents);

// Thêm mới
router.post('/', studentController.createStudent);

router.put('/:id', studentController.updateStudent);

// Route: Xóa học sinh (DELETE /:id)
router.delete('/:id', studentController.deleteStudent);

module.exports = router;