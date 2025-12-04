import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentModal from '../components/StudentModal';
import AlertModal from '../components/AlertModal';

function Home() {
  // --- STATE BÀI 1: DANH SÁCH ---
  const [students, setStudents] = useState([]);
  
  // --- STATE BÀI 5: TÌM KIẾM ---
  const [searchTerm, setSearchTerm] = useState("");
  
  // --- STATE BÀI 6: SẮP XẾP ---
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // State hỗ trợ Modal (Bài 2 & 3)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // State hỗ trợ Alert (Bài 4)
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: 'success',
    message: '',
    onConfirm: null
  });

  // --- BÀI 1: GỌI API LẤY DANH SÁCH KHI LOAD TRANG (GET) ---
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
    setAlertState({
        isOpen: true,
        type: type,
        message: message,
        onConfirm: null
    });
  };

  const showConfirm = (message, onConfirmAction) => {
    setAlertState({
        isOpen: true,
        type: 'confirm',
        message: message,
        onConfirm: onConfirmAction
    });
  };

  const closeAlert = () => {
    setAlertState(prev => ({ ...prev, isOpen: false }));
  };

  // --- BÀI 2: MỞ MODAL THÊM ---
  const openAddModal = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  // --- BÀI 3: MỞ MODAL SỬA ---
  const openEditModal = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  // --- XỬ LÝ LƯU (BÀI 2: THÊM & BÀI 3: SỬA) ---
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

  // --- BÀI 4: LOGIC GỌI API XÓA (DELETE) ---
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
        .catch(err => {
            closeAlert();
            showAlert("Lỗi khi xóa học sinh", "error");
        });
  };

  // --- BÀI 6: LOGIC XỬ LÝ SẮP XẾP ---
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const getSortIcon = (name) => {
    if (sortConfig.key !== name) return " ↕️";
    return sortConfig.direction === 'asc' ? " ⬆️" : " ⬇️";
  };

  // --- BÀI 5: LOGIC LỌC TÌM KIẾM ---
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- BÀI 6: ÁP DỤNG SẮP XẾP VÀO DANH SÁCH ĐÃ LỌC ---
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];
    if (typeof valA === 'string') { valA = valA.toLowerCase(); valB = valB.toLowerCase(); }
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="main-container">
      <div className="container-content">
        {/* BÀI 1: TIÊU ĐỀ */}
        <h1>📚 Quản Lý Học Sinh</h1>
        
        <div className="action-bar">
          {/* BÀI 5: GIAO DIỆN TÌM KIẾM */}
          <div className="search-container">
            <input 
                type="text" 
                placeholder="🔍 Tìm kiếm theo tên..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* BÀI 2: NÚT THÊM HỌC SINH */}
          <button 
            onClick={openAddModal}
            className="btn-primary"
          >
            Thêm Học Sinh Mới
          </button>
        </div>

        {/* BÀI 1: BẢNG HIỂN THỊ DANH SÁCH */}
        <table>
          <thead>
            <tr>
              {/* BÀI 6: TIÊU ĐỀ CÓ CHỨC NĂNG SẮP XẾP */}
              <th onClick={() => requestSort('name')}>Họ Tên {getSortIcon('name')}</th>
              <th onClick={() => requestSort('age')}>Tuổi {getSortIcon('age')}</th>
              <th onClick={() => requestSort('class')}>Lớp {getSortIcon('class')}</th>
              <th style={{ cursor: "default" }}>Hành Động</th>
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
                    >
                      ✏️ Sửa
                    </button>
                    
                    {/* BÀI 4: NÚT XÓA */}
                    <button 
                        onClick={() => requestDelete(student._id)}
                        className="btn-danger"
                    >
                        🗑️ Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">
                  <div className="empty-state">
                    <div className="empty-state-icon">📭</div>
                    <div className="empty-state-text">Không tìm thấy dữ liệu học sinh</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* COMPONENT HỖ TRỢ BÀI 2 & 3 (FORM) */}
        <StudentModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveStudent}
          studentToEdit={editingStudent}
        />

        {/* COMPONENT HỖ TRỢ BÀI 4 (THÔNG BÁO) */}
        <AlertModal
          isOpen={alertState.isOpen}
          type={alertState.type}
          message={alertState.message}
          onClose={closeAlert}
          onConfirm={alertState.onConfirm}
        />
      </div>
    </div>
  );
}

export default Home;