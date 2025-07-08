import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function RecordDonationModal({ appointment, userProfile, onClose, onSubmit, isSubmitting }) {
    const [componentTypes, setComponentTypes] = useState([]);
    const [selectedComponentTypeId, setSelectedComponentTypeId] = useState('');
    
    // --- THAY ĐỔI LOGIC CHO VIỆC NHẬP THỂ TÍCH ---
    // 'units' sẽ lưu các giá trị chuẩn hoặc chuỗi 'other'
    const [units, setUnits] = useState('350'); 
    // 'customUnits' sẽ lưu giá trị khi người dùng chọn 'other'
    const [customUnits, setCustomUnits] = useState('');
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchComponentTypes = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/component-types', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const componentData = response.data || [];
                setComponentTypes(componentData);
                if (componentData.length > 0) {
                    setSelectedComponentTypeId(componentData[0].id);
                }
            } catch (err) {
                setError('Không thể tải danh sách thành phần máu.');
            } finally {
                setLoading(false);
            }
        };
        fetchComponentTypes();
    }, []);

    const handleUnitChange = (e) => {
        const value = e.target.value;
        setUnits(value);
        // Nếu người dùng chọn một giá trị chuẩn, xóa giá trị tùy chỉnh
        if (value !== 'other') {
            setCustomUnits('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Xác định giá trị thể tích cuối cùng
        const finalUnits = units === 'other' ? parseInt(customUnits, 10) : parseInt(units, 10);
        
        // Validation
        if (!selectedComponentTypeId || !finalUnits || finalUnits <= 0) {
            alert("Vui lòng điền đầy đủ và chính xác các thông tin.");
            return;
        }
        
        const payload = {
            appointmentId: appointment.appointmentId,
            bloodTypeId: userProfile.bloodType.id,
            componentTypeId: parseInt(selectedComponentTypeId, 10),
            units: finalUnits, // Sử dụng giá trị cuối cùng
        };
        
        onSubmit(payload);
    };

    if (!appointment || !userProfile) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Ghi nhận ca hiến máu</h3>
                <p className="text-gray-600 mb-4">Người hiến: <span className="font-semibold">{appointment.user?.fullName}</span></p>
                
                {loading ? <p className="text-center py-4">Đang tải...</p> 
                : error ? <p className="text-center text-red-500 py-4">{error}</p> 
                : (
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nhóm máu</label>
                                <p className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-800 font-semibold">
                                    {userProfile.bloodType.type}
                                </p>
                            </div>
                            <div>
                                <label htmlFor="componentType" className="block text-sm font-medium text-gray-700">Loại thành phần</label>
                                <select id="componentType" value={selectedComponentTypeId} onChange={(e) => setSelectedComponentTypeId(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
                                    {componentTypes.map(type => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* --- PHẦN NHẬP THỂ TÍCH ĐÃ ĐƯỢC CẢI TIẾN --- */}
                            <div>
                                <label htmlFor="units" className="block text-sm font-medium text-gray-700">Thể tích (ml)</label>
                                <select id="units" value={units} onChange={handleUnitChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    <option value="250">250</option>
                                    <option value="350">350</option>
                                    <option value="450">450</option>
                                    <option value="other">Khác...</option>
                                </select>
                            </div>

                            {/* Ô nhập liệu này chỉ hiện ra khi người dùng chọn "Khác..." */}
                            {units === 'other' && (
                                <div>
                                    <label htmlFor="customUnits" className="block text-sm font-medium text-gray-700">Nhập thể tích chính xác</label>
                                    <input 
                                        type="number"
                                        id="customUnits"
                                        value={customUnits}
                                        onChange={(e) => setCustomUnits(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="VD: 320"
                                        required 
                                    />
                                </div>
                            )}
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300">Hủy</button>
                            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-gray-400">
                                {isSubmitting ? 'Đang lưu...' : 'Lưu lại'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}