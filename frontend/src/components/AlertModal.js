import React from 'react';

const AlertModal = ({ isOpen, type, message, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="alert-box">
                <div className="alert-box-icon">
                    {type === "confirm" ? "⚠️" : (type === "error" ? "❌" : "✅")}
                </div>

                <p className="alert-message">{message}</p>

                <div className="alert-buttons">
                    {type === "confirm" ? (
                        <>
                            <button className="btn-secondary" onClick={onClose}>Hủy bỏ</button>
                            <button className="btn-danger" onClick={onConfirm}>Đồng ý</button>
                        </>
                    ) : (
                        <button className="btn-primary" onClick={onClose}>OK</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlertModal;