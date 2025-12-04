import React, { useState, useEffect } from 'react';

const StudentModal = ({ isOpen, onClose, onSave, studentToEdit }) => {
    // State cho các trường nhập liệu
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [stuClass, setStuClass] = useState("");

    // useEffect này chạy mỗi khi modal mở ra hoặc studentToEdit thay đổi
    useEffect(() => {
        if (studentToEdit) {
            // Nếu có dữ liệu sửa, điền vào form
            setName(studentToEdit.name);
            setAge(studentToEdit.age);
            setStuClass(studentToEdit.class);
        } else {
            // Nếu thêm mới, xóa trắng form
            setName("");
            setAge("");
            setStuClass("");
        }
    }, [studentToEdit, isOpen]); // Chạy lại khi mở modal hoặc đổi học sinh

    const handleSubmit = (e) => {
        e.preventDefault();
        // Gửi dữ liệu ra ngoài cho Home.js xử lý
        onSave({ 
            name, 
            age: Number(age), 
            class: stuClass, 
            _id: studentToEdit ? studentToEdit._id : null // Gửi kèm ID nếu là sửa
        });
    };

    // Nếu isOpen = false thì không hiển thị gì cả
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>&times;</button>
                
                <h2>{studentToEdit ? "Chỉnh Sửa Học Sinh" : "Thêm Học Sinh Mới"}</h2>
                
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <div>
                        <label>Họ Tên:</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            required 
                            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                        />
                    </div>
                    <div>
                        <label>Tuổi:</label>
                        <input 
                            type="number" 
                            value={age} 
                            onChange={e => setAge(e.target.value)} 
                            required 
                            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                        />
                    </div>
                    <div>
                        <label>Lớp:</label>
                        <input 
                            type="text" 
                            value={stuClass} 
                            onChange={e => setStuClass(e.target.value)} 
                            required 
                            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                        />
                    </div>
                    
                    <button type="submit" style={{ padding: "10px", background: "#28a745", color: "white", border: "none", cursor: "pointer", fontSize: "16px" }}>
                        {studentToEdit ? "Lưu Thay Đổi" : "Thêm Mới"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StudentModal;