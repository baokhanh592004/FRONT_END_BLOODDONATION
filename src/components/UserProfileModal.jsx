// src/components/UserProfileModal.js

import React from 'react';

// Tiện ích định dạng ngày tháng
const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

// Component để hiển thị một dòng thông tin
const InfoRow = ({ label, value, highlight = false }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className={`mt-1 text-sm sm:col-span-2 sm:mt-0 ${highlight ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
            {value}
        </dd>
    </div>
);

export default function UserProfileModal({ userProfile, onClose }) {
    if (!userProfile) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-5 border-b border-gray-200">
                    <h3 className="text-xl font-semibold leading-6 text-gray-900">
                        Hồ sơ sức khỏe
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Thông tin của người hiến máu: {userProfile.user?.fullName || 'N/A'}
                    </p>
                </div>
                <div className="p-5">
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
                </div>
                <div className="px-5 py-4 bg-gray-50 text-right">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}