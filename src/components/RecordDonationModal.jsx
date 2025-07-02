import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function RecordDonationModal({ appointment, onClose, onSubmit, isSubmitting }) {
    const [bloodTypes, setBloodTypes] = useState([]);
    const [componentTypes, setComponentTypes] = useState([]);
    
    const [selectedBloodType, setSelectedBloodType] = useState(null);
    const [selectedComponentType, setSelectedComponentType] = useState(null);
    
    const [units, setUnits] = useState(350);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError("Token không hợp lệ. Vui lòng đăng nhập lại.");
                    setLoading(false);
                    return;
                }

                const apiHeaders = { headers: { Authorization: `Bearer ${token}` } };
                
                const [bloodTypeRes, componentTypeRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/blood-types', apiHeaders),
                    axios.get('http://localhost:8080/api/component-types', apiHeaders)
                ]);

                const bloodData = bloodTypeRes.data || [];
                const componentData = componentTypeRes.data || [];

                setBloodTypes(bloodData);
                setComponentTypes(componentData);

                // SỬA Ở ĐÂY: Dùng đúng tên trường "id" từ API
                if (bloodData.length > 0 && bloodData[0] && typeof bloodData[0].id !== 'undefined') {
                    setSelectedBloodType(bloodData[0].id.toString());
                }

                // SỬA Ở ĐÂY: Dùng đúng tên trường "id" từ API
                if (componentData.length > 0 && componentData[0] && typeof componentData[0].id !== 'undefined') {
                    setSelectedComponentType(componentData[0].id.toString());
                }

            } catch (err) {
                setError('Không thể tải dữ liệu cần thiết. Vui lòng thử lại.');
                console.error("Failed to fetch modal data:", err.response || err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const finalBloodTypeId = selectedBloodType ? parseInt(selectedBloodType, 10) : null;
        const finalComponentTypeId = selectedComponentType ? parseInt(selectedComponentType, 10) : null;
        const finalUnits = units ? parseInt(units, 10) : null;

        if (!finalBloodTypeId || !finalComponentTypeId || !finalUnits || finalUnits <= 0) {
            alert("Vui lòng đảm bảo đã chọn đủ thông tin và số đơn vị máu là một số dương.");
            return;
        }
        
        onSubmit({
            appointmentId: appointment.appointmentId,
            bloodTypeId: finalBloodTypeId,
            componentTypeId: finalComponentTypeId,
            units: finalUnits
        });
    };

    if (!appointment) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Ghi nhận ca hiến máu</h3>
                <p className="text-gray-600 mb-4">Người hiến: <span className="font-semibold">{appointment.user?.fullName}</span></p>
                
                {loading ? <p className="text-center py-4">Đang tải...</p> : error ? <p className="text-center text-red-500 py-4">{error}</p> :
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">Loại máu</label>
                                <select id="bloodType" value={selectedBloodType || ''} onChange={(e) => setSelectedBloodType(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    <option value="" disabled>-- Vui lòng chọn --</option>
                                    {bloodTypes.map(type => (
                                        // SỬA Ở ĐÂY: Dùng đúng tên trường "id" cho key và value
                                        <option key={type.id} value={type.id.toString()}>
                                            {type.type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="componentType" className="block text-sm font-medium text-gray-700">Loại thành phần</label>
                                <select id="componentType" value={selectedComponentType || ''} onChange={(e) => setSelectedComponentType(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    <option value="" disabled>-- Vui lòng chọn --</option>
                                    {componentTypes.map(type => (
                                        // SỬA Ở ĐÂY: Dùng đúng tên trường "id" cho key và value
                                        <option key={type.id} value={type.id.toString()}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="units" className="block text-sm font-medium text-gray-700">Số đơn vị (ml)</label>
                                <input type="number" id="units" value={units} onChange={(e) => setUnits(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="VD: 350"/>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300">Hủy</button>
                            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-gray-400">
                                {isSubmitting ? 'Đang lưu...' : 'Lưu lại'}
                            </button>
                        </div>
                    </form>
                }
            </div>
        </div>
    );
}