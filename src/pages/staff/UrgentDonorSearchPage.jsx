import React from 'react';

const donors = [
  { avatar: 'https://i.pravatar.cc/150?u=a', name: 'Nguyễn Văn An', bloodType: 'A+', distance: '2.5 km', status: 'Sẵn sàng' },
  { avatar: 'https://i.pravatar.cc/150?u=b', name: 'Trần Thị Bình', bloodType: 'O-', distance: '3.2 km', status: 'Bận' },
  { avatar: 'https://i.pravatar.cc/150?u=c', name: 'Phạm Văn Cường', bloodType: 'B+', distance: '4.1 km', status: 'Sẵn sàng' },
];

const UrgentDonorSearchPage = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Tìm kiếm người hiến máu khẩn cấp</h1>
      
      {/* Search Filters */}
      <div className="grid md:grid-cols-3 gap-4 mb-8 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chọn cơ sở y tế</label>
          <select className="w-full p-2 border border-gray-300 rounded-md">
            <option>Bệnh viện Bạch Mai</option>
            <option>Bệnh viện Việt Đức</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">Bán kính tìm kiếm (5 km)</label>
          <input id="distance" type="range" min="1" max="20" defaultValue="5" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
        </div>
      </div>
       <button className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-md hover:bg-red-700 transition-colors mb-8">
        🔍 Tìm kiếm
      </button>

      {/* Results */}
      <div className="space-y-4">
        {donors.map((donor, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <img src={donor.avatar} alt={donor.name} className="w-16 h-16 rounded-full" />
              <div>
                <p className="font-bold text-lg">{donor.name}</p>
                <p className="text-gray-600">Nhóm máu: <span className="font-semibold">{donor.bloodType}</span></p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Khoảng cách</p>
              <p className="font-semibold">{donor.distance}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Trạng thái</p>
              <p className={`font-bold ${donor.status === 'Sẵn sàng' ? 'text-green-600' : 'text-gray-500'}`}>{donor.status}</p>
            </div>
            <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors" disabled={donor.status !== 'Sẵn sàng'}>
              Gửi yêu cầu hiến máu
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UrgentDonorSearchPage;