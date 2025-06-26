import React, { useState } from "react";
import BloodTypeVisualizer from "../components/BloodTypeVisualizer";

const HomePages = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

 

  const participatingHospitals = [
    {
      name: "Bệnh viện Chợ Rẫy",
      image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3",
      certification: "Chứng nhận ISO 9001:2015"
    },
    {
      name: "Bệnh viện Huyết học",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3",
      certification: "Chứng nhận JCI"
    },
    {
      name: "Viện Huyết học",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3",
      certification: "Chứng nhận ISO 15189"
    }
  ];

  const bloodTypeInfo = [
    { type: "A+", canGiveTo: ["A+", "AB+"], canReceiveFrom: ["A+", "A-", "O+", "O-"] },
    { type: "O+", canGiveTo: ["O+", "A+", "B+", "AB+"], canReceiveFrom: ["O+", "O-"] },
    { type: "B+", canGiveTo: ["B+", "AB+"], canReceiveFrom: ["B+", "B-", "O+", "O-"] },
    { type: "AB+", canGiveTo: ["AB+"], canReceiveFrom: ["All"] }
  ];

  const blogPosts = [
    {
      title: "Tầm quan trọng của việc hiến máu định kỳ",
      excerpt: "Hiến máu định kỳ không chỉ cứu sống người khác mà còn có lợi cho sức khỏe người hiến...",
      image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-4.0.3"
    },
    {
      title: "Các bước chuẩn bị trước khi hiến máu",
      excerpt: "Để đảm bảo sức khỏe và chất lượng máu hiến tặng, bạn cần lưu ý những điều sau...",
      image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?ixlib=rb-4.0.3"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Participating Hospitals */}
      <section className="p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Các bệnh viện tham gia</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {participatingHospitals.map((hospital, idx) => (
            <div key={idx} className="bg-white p-4 rounded-lg shadow-md text-center">
              <img src={hospital.image} alt={hospital.name} className="w-full h-40 object-cover rounded-md mb-4" />
              <h3 className="text-lg font-semibold">{hospital.name}</h3>
              <p className="text-sm text-gray-500">{hospital.certification}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blood Type Info */}
      <BloodTypeVisualizer />

      {/* Blog Section */}
      <section className="p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Bài viết</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.map((post, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-4">
              <img src={post.image} alt={post.title} className="w-full h-40 object-cover rounded-md mb-4" />
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-600">{post.excerpt}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePages;
