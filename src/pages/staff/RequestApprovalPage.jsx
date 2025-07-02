// import React from 'react';

// const requests = [
//   { hospital: 'Bệnh viện Bạch Mai', bloodType: 'A+', quantity: '5 đơn vị', time: '22:50 - 25/05/2025', status: 'Khẩn cấp' },
//   { hospital: 'Bệnh viện Việt Đức', bloodType: 'O-', quantity: '3 đơn vị', time: '22:50 - 25/05/2025', status: 'Đang xử lý' },
//   { hospital: 'Bệnh viện 108', bloodType: 'B-', quantity: '2 đơn vị', time: '22:50 - 25/05/2025', status: 'Hoàn thành' },
// ];

// const StatusTag = ({ status }) => {
//   const styles = {
//     'Khẩn cấp': 'bg-red-100 text-red-700 border border-red-300',
//     'Đang xử lý': 'bg-yellow-100 text-yellow-700 border border-yellow-300',
//     'Hoàn thành': 'bg-green-100 text-green-700 border border-green-300',
//   };
//   return <span className={`px-3 py-1 text-xs font-semibold rounded-md ${styles[status]}`}>{status}</span>;
// };

// const RequestApprovalPage = () => {
//   return (
//     <div className="bg-white p-8 rounded-lg shadow-lg w-full">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">Phê duyệt yêu cầu</h1>
//       <div className="overflow-x-auto">
//         <table className="min-w-full text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-6 py-3 text-left font-medium text-gray-600">Tên cơ sở y tế</th>
//               <th className="px-6 py-3 text-left font-medium text-gray-600">Loại máu</th>
//               <th className="px-6 py-3 text-left font-medium text-gray-600">Số lượng</th>
//               <th className="px-6 py-3 text-left font-medium text-gray-600">Thời gian</th>
//               <th className="px-6 py-3 text-left font-medium text-gray-600">Trạng thái</th>
//               <th className="px-6 py-3 text-left font-medium text-gray-600">Thao tác</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {requests.map((req, index) => (
//               <tr key={index}>
//                 <td className="px-6 py-4 font-medium">{req.hospital}</td>
//                 <td className="px-6 py-4 font-bold">{req.bloodType}</td>
//                 <td className="px-6 py-4">{req.quantity}</td>
//                 <td className="px-6 py-4">{req.time}</td>
//                 <td className="px-6 py-4"><StatusTag status={req.status} /></td>
//                 <td className="px-6 py-4">
//                   <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
//                     Chi tiết
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default RequestApprovalPage;
import React from 'react'

export default function RequestApprovalPage() {
  return (
    <div>
      PHÊ DUYỆT YÊU CẦU 
    </div>
  )
}
