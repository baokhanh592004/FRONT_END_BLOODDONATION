import React, { useState } from 'react';

export default function ScreeningModal({ appointment, onClose, onSubmit, isSubmitting, bloodTypes }) {
    const [formData, setFormData] = useState({
        passed: true,
        remarks: '',
        weight: '',
        bloodTypeId: '',
        healthStatus: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "passed") {
            setFormData(prev => ({ ...prev, passed: value === 'true' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.weight || !formData.bloodTypeId || !formData.healthStatus) {
            alert('Vui lòng điền đầy đủ thông tin hồ sơ: Cân nặng, Nhóm máu, và Tình trạng sức khỏe.');
            return;
        }
        onSubmit(formData);
    };

    if (!appointment) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-6 border-b">
                    <h3 className="text-xl font-semibold text-gray-800">Sàng lọc & Cập nhật Hồ sơ</h3>
                    <p className="text-gray-600 mt-1">Người hiến máu: <span className="font-bold">{appointment.user.fullName}</span></p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-3 border-b pb-2">Thông tin hồ sơ</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">Cân nặng (kg)</label>
                                    <input type="number" name="weight" id="weight" step="0.1" value={formData.weight} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="VD: 65.5" required />
                                </div>
                                <div>
                                    <label htmlFor="bloodTypeId" className="block text-sm font-medium text-gray-700 mb-1">Nhóm máu</label>
                                    <select name="bloodTypeId" id="bloodTypeId" value={formData.bloodTypeId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white" required>
                                        <option value="" disabled>Chọn nhóm máu</option>
                                        {bloodTypes.map(bt => (
                                            <option key={bt.id} value={bt.id}>{bt.type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label htmlFor="healthStatus" className="block text-sm font-medium text-gray-700 mb-1">Tình trạng sức khỏe</label>
                                <textarea name="healthStatus" id="healthStatus" rows="3" value={formData.healthStatus} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Mô tả ngắn gọn tình trạng sức khỏe..." required></textarea>
                            </div>
                        </div>

                        <div>
                             <h4 className="font-semibold text-gray-700 mb-3 border-b pb-2">Kết quả sàng lọc</h4>
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">Kết luận:</p>
                                <div className="flex items-center gap-x-4">
                                    <label className="flex items-center cursor-pointer">
                                        <input type="radio" name="passed" value="true" checked={formData.passed === true} onChange={handleChange} className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"/>
                                        <span className="ml-2 text-gray-700">Đạt</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="radio" name="passed" value="false" checked={formData.passed === false} onChange={handleChange} className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"/>
                                        <span className="ml-2 text-gray-700">Không đạt</span>
                                    </label>
                                </div>
                            </div>
                             <div className="mt-4">
                                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">Ghi chú (nếu có)</label>
                                <textarea name="remarks" id="remarks" rows="3" value={formData.remarks} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Ghi chú thêm về kết quả sàng lọc..."></textarea>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end gap-3">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50">Hủy</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                            {isSubmitting ? 'Đang xử lý...' : 'Lưu kết quả'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}