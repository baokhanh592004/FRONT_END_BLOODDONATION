// src/components/UserProfileModal.jsx

import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

// Tiện ích định dạng ngày tháng
const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const InfoRow = ({ label, value, highlight = false }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd
            className={`mt-1 text-sm sm:col-span-2 sm:mt-0 ${
                highlight ? 'font-semibold text-gray-900' : 'text-gray-700'
            }`}
        >
            {value}
        </dd>
    </div>
);

export default function UserProfileModal({
    appointment,
    userProfile,
    onClose,
    bloodTypes,
    onProfileUpdate
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        weight: '',
        bloodTypeId: '',
        healthStatus: ''
    });

    useEffect(() => {
        if (userProfile) {
            setFormData({
                weight: userProfile.weight || '',
                bloodTypeId: userProfile.bloodType?.id || '',
                healthStatus: userProfile.healthStatus || ''
            });
        }
    }, [userProfile]);

    if (!userProfile || !appointment) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.weight || !formData.bloodTypeId || !formData.healthStatus) {
            return alert('Vui lòng điền đầy đủ thông tin: Cân nặng, Nhóm máu, và Tình trạng sức khỏe.');
        }

        setIsSubmitting(true);
        const token = localStorage.getItem('token');

        const payload = {
            userId: appointment.user.userId,
            weight: Number(formData.weight),
            bloodTypeId: Number(formData.bloodTypeId),
            healthStatus: formData.healthStatus,
            lastScreeningDate: userProfile.lastScreeningDate
        };

        try {
            await axiosClient.post('/staff/user-profile', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Cập nhật hồ sơ thành công!');
            onProfileUpdate();
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ.';
            alert(`Lỗi: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
            setIsEditing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-5 border-b border-gray-200">
                    <h3 className="text-xl font-semibold leading-6 text-gray-900">Hồ sơ sức khỏe</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Thông tin của người hiến máu: {appointment.user?.fullName || 'N/A'}
                    </p>
                </div>

                <div className="p-5">
                    {isEditing ? (
                        <form onSubmit={handleSave}>
                            <dl className="divide-y divide-gray-200">
                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 items-center">
                                    <dt className="text-sm font-medium text-gray-500">Nhóm máu</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                        <select
                                            name="bloodTypeId"
                                            value={formData.bloodTypeId}
                                            onChange={handleChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="">Chọn nhóm máu</option>
                                            {bloodTypes.map((bt) => (
                                                <option key={bt.id} value={bt.id}>
                                                    {bt.type}
                                                </option>
                                            ))}
                                        </select>
                                    </dd>
                                </div>

                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 items-center">
                                    <dt className="text-sm font-medium text-gray-500">Cân nặng (kg)</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                        <input
                                            type="number"
                                            name="weight"
                                            value={formData.weight}
                                            onChange={handleChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </dd>
                                </div>

                                <InfoRow label="Ngày sàng lọc cuối" value={formatDate(userProfile.lastScreeningDate)} />

                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                                    <dt className="text-sm font-medium text-gray-500">Tình trạng sức khỏe</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                        <textarea
                                            name="healthStatus"
                                            value={formData.healthStatus}
                                            onChange={handleChange}
                                            rows="4"
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-sans"
                                        ></textarea>
                                    </dd>
                                </div>
                            </dl>
                        </form>
                    ) : (
                        <dl className="divide-y divide-gray-200">
                            <InfoRow label="Nhóm máu" value={userProfile.bloodType?.type || 'N/A'} highlight={true} />
                            <InfoRow label="Cân nặng" value={`${userProfile.weight || 'N/A'} kg`} />
                            <InfoRow label="Ngày sàng lọc cuối" value={formatDate(userProfile.lastScreeningDate)} />
                            <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                                <dt className="text-sm font-medium text-gray-500">Tình trạng sức khỏe</dt>
                                <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                                    <pre className="whitespace-pre-wrap font-sans bg-gray-50 p-2 rounded-md">
                                        {userProfile.healthStatus || 'Chưa có thông tin.'}
                                    </pre>
                                </dd>
                            </div>
                        </dl>
                    )}
                </div>

                <div className="px-5 py-4 bg-gray-50 flex justify-end gap-3">
                    {isEditing ? (
                        <>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                disabled={isSubmitting}
                                className="inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSubmitting}
                                className="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                                Đóng
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="inline-flex justify-center rounded-md bg-yellow-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-600"
                            >
                                Chỉnh sửa
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
