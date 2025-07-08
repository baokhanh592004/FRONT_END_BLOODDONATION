// import React from "react";
// import { FaChartBar } from "react-icons/fa";

// const bloodData = [
//   { group: "O+", donors: 32, unitsLeft: 90 },
//   { group: "A-", donors: 21, unitsLeft: 47 },
//   { group: "B+", donors: 19, unitsLeft: 55 },
//   { group: "AB+", donors: 11, unitsLeft: 33 },
// ];

// const StaffDashboard = () => {
//   return (
//     <div>
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//           <FaChartBar className="text-blue-600" />
//           Dashboard Báo cáo & Thống kê
//         </h1>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//         <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg">
//           <p className="text-sm">Tổng số người hiến</p>
//           <p className="text-3xl font-bold">124</p>
//         </div>
//         <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg">
//           <p className="text-sm">Tổng đơn vị máu hiện có</p>
//           <p className="text-3xl font-bold">380</p>
//         </div>
//         <div className="bg-cyan-500 text-white p-6 rounded-lg shadow-lg">
//           <p className="text-sm">Yêu cầu đã đáp ứng</p>
//           <p className="text-3xl font-bold">52</p>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//         <div className="bg-gray-700 text-white p-4 text-md font-semibold">
//           Báo cáo theo nhóm máu
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-6 py-3 text-left font-medium text-gray-600">Nhóm máu</th>
//                 <th className="px-6 py-3 text-left font-medium text-gray-600">Số người hiến</th>
//                 <th className="px-6 py-3 text-left font-medium text-gray-600">Số đơn vị còn lại</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {bloodData.map((item, index) => (
//                 <tr key={index}>
//                   <td className="px-6 py-4 font-bold">{item.group}</td>
//                   <td className="px-6 py-4">{item.donors}</td>
//                   <td className="px-6 py-4">{item.unitsLeft}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StaffDashboard;
import React from 'react'

export default function StaffDashboard() {
  return (
    <div>
      STAFF DASHBOARD
    </div>
  )
}
