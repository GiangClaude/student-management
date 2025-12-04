import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentModal from '../components/StudentModal';
import AlertModal from '../components/AlertModal';

function Home() {
  // --- STATE BÀI 1: DANH SÁCH --- [cite: 12]
  const [students, setStudents] = useState([]);
  
  // --- STATE BÀI 5: TÌM KIẾM --- [cite: 281]
  const [searchTerm, setSearchTerm] = useState("");
  
  // --- STATE BÀI 6: SẮP XẾP --- [cite: 314]
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // State hỗ trợ Modal (Bài 2 & 3)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // State hỗ trợ Alert (Bài 4)
  const [alertState, setAlertState] = useState({
    isOpen: false, type: 'success', message: '', onConfirm: null
  });

  // --- BÀI 1: GỌI API LẤY DANH SÁCH KHI LOAD TRANG --- [cite: 73]
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios.get('http://localhost:5000/api/students')
      .then(response => setStudents(response.data))
      .catch(error => console.error("Lỗi:", error));
  };

  // --- CÁC HÀM HỖ TRỢ ALERT & MODAL ---
  const showAlert = (message, type = 'success') => {
    setAlertState({ isOpen: true, type, message, onConfirm: null });
  };
  const showConfirm = (message, onConfirmAction) => {
    setAlertState({ isOpen: true, type: 'confirm', message, onConfirm: onConfirmAction });
  };
  const closeAlert = () => setAlertState(prev => ({ ...prev, isOpen: false }));

  const openAddModal = () => { setEditingStudent(null); setIsModalOpen(true); };
  const openEditModal = (student) => { setEditingStudent(student); setIsModalOpen(true); };

  // --- XỬ LÝ LƯU (BÀI 2: THÊM & BÀI 3: SỬA) --- [cite: 90, 151]
  const handleSaveStudent = (studentData) => {
    if (studentData._id) {
        // --- BÀI 3: LOGIC GỌI API SỬA (PUT) ---
        axios.put(`http://localhost:5000/api/students/${studentData._id}`, studentData)
            .then(res => {
                showAlert("Cập nhật học sinh thành công!");
                setStudents(prev => prev.map(s => s._id === studentData._id ? res.data : s));
                setIsModalOpen(false);
            })
            .catch(err => showAlert("Lỗi khi cập nhật!", "error"));
    } else {
        // --- BÀI 2: LOGIC GỌI API THÊM (POST) ---
        axios.post('http://localhost:5000/api/students', studentData)
            .then(res => {
                showAlert("Thêm mới thành công!");
                setStudents(prev => [...prev, res.data]);
                setIsModalOpen(false);
            })
            .catch(err => showAlert("Lỗi khi thêm mới!", "error"));
    }
  };

  // --- BÀI 4: LOGIC GỌI API XÓA (DELETE) --- [cite: 231]
  const requestDelete = (id) => {
    showConfirm(
        "Bạn có chắc chắn muốn xóa học sinh này không?", 
        () => performDelete(id)
    );
  };

  const performDelete = (id) => {
    axios.delete(`http://localhost:5000/api/students/${id}`)
        .then(res => {
            closeAlert();
            setTimeout(() => showAlert("Đã xóa học sinh thành công!"), 300);
            setStudents(prev => prev.filter(s => s._id !== id));
        })
        .catch(err => { closeAlert(); showAlert("Lỗi khi xóa", "error"); });
  };

  // --- BÀI 6: LOGIC XỬ LÝ SẮP XẾP --- [cite: 326]
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };
  const getSortIcon = (name) => {
    if (sortConfig.key !== name) return " ↕️";
    return sortConfig.direction === 'asc' ? " ⬆️" : " ⬇️";
  };

  // --- BÀI 5: LOGIC LỌC TÌM KIẾM --- [cite: 296]
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- BÀI 6: ÁP DỤNG SẮP XẾP VÀO DANH SÁCH ĐÃ LỌC --- [cite: 328]
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];
    if (typeof valA === 'string') { valA = valA.toLowerCase(); valB = valB.toLowerCase(); }
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div style={{ padding: "20px" }}>
      {/* BÀI 1: TIÊU ĐỀ */}
      <h1>Quản Lý Học Sinh</h1>
      
      {/* BÀI 2: NÚT THÊM HỌC SINH */}
      <button 
        onClick={openAddModal}
        className="btn-primary"
        style={{ fontSize: "16px" }}
      >
        + Thêm Học Sinh Mới
      </button>

      {/* BÀI 5: GIAO DIỆN TÌM KIẾM */}
      <div style={{ margin: "20px 0" }}>
        <input 
            type="text" placeholder="🔍 Tìm kiếm theo tên..." 
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "8px", width: "300px" }}
        />
        <span style={{ marginLeft: "10px", color: "#666", fontSize: "14px" }}>
            *Nhấn tiêu đề (Bài 6) để sắp xếp
        </span>
      </div>

      {/* BÀI 1: BẢNG HIỂN THỊ DANH SÁCH */}
      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0", cursor: "pointer", userSelect: "none" }}>
            {/* BÀI 6: TIÊU ĐỀ CÓ CHỨC NĂNG SẮP XẾP */}
            <th onClick={() => requestSort('name')}>Họ Tên {getSortIcon('name')}</th>
            <th onClick={() => requestSort('age')}>Tuổi {getSortIcon('age')}</th>
            <th onClick={() => requestSort('class')}>Lớp {getSortIcon('class')}</th>
            <th style={{ cursor: "default" }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.length > 0 ? (
            sortedStudents.map((student) => (
              <tr key={student._id}>
                {/* BÀI 1: HIỂN THỊ DỮ LIỆU */}
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>{student.class}</td>
                <td>
                  {/* BÀI 3: NÚT SỬA */}
                  <button 
                    onClick={() => openEditModal(student)}
                    className="btn-secondary"
                    style={{ marginRight: "10px" }}
                  >
                    Sửa
                  </button>
                  
                  {/* BÀI 4: NÚT XÓA */}
                  <button 
                      onClick={() => requestDelete(student._id)}
                      className="btn-danger"
                  >
                      Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
             <tr><td colSpan="4" style={{ textAlign: "center" }}>Không tìm thấy dữ liệu.</td></tr>
          )}
        </tbody>
      </table>

      {/* COMPONENT HỖ TRỢ BÀI 2, 3 (FORM) */}
      <StudentModal 
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveStudent} studentToEdit={editingStudent}
      />

      {/* COMPONENT HỖ TRỢ BÀI 4 (THÔNG BÁO) */}
      <AlertModal
        isOpen={alertState.isOpen} type={alertState.type} 
        message={alertState.message} onClose={closeAlert} onConfirm={alertState.onConfirm}
      />
    </div>
  );
}

export default Home;