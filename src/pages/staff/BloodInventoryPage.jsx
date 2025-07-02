// import React from 'react';

// const inventory = [
//   { group: 'A+', quantity: 150, status: 'Đủ' },
//   { group: 'O-', quantity: 40, status: 'Thiếu' },
//   { group: 'B+', quantity: 80, status: 'Đủ' },
//   { group: 'AB+', quantity: 30, status: 'Thiếu' },
// ];

// const BloodInventoryPage = () => {
//   return (
//     <div className="bg-white p-8 rounded-lg shadow-lg w-full">
//       <h1 className="text-2xl font-bold text-gray-800 mb-2">Quản lý kho máu</h1>
//       <p className="text-gray-600 mb-6">Chào mừng nhân viên y tế đến với hệ thống quản lý hiến máu!</p>
      
//       <div className="overflow-x-auto">
//         <table className="min-w-full text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-6 py-3 text-left font-medium text-gray-600">Nhóm máu</th>
//               <th className="px-6 py-3 text-left font-medium text-gray-600">Số lượng (đơn vị)</th>
//               <th className="px-6 py-3 text-left font-medium text-gray-600">Trạng thái</th>
//             </tr>
//           </thead>
//           <tbody>
//             {inventory.map((item, index) => (
//               <tr 
//                 key={index}
//                 className={item.status === 'Thiếu' ? 'bg-red-100' : 'bg-white'}
//               >
//                 <td className="px-6 py-4 font-bold">{item.group}</td>
//                 <td className="px-6 py-4">{item.quantity}</td>
//                 <td className={`px-6 py-4 font-semibold ${item.status === 'Thiếu' ? 'text-red-600' : 'text-green-600'}`}>
//                   {item.status}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default BloodInventoryPage;

import React from 'react'

export default function BloodInventoryPage() {
  return (
    <div>
      QUẢN LÝ KHO MÁU
    </div>
  )
}
