import React, { useState } from "react";

const HomePages = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

 
  const participatingHospitals = [
    {
      name: "Bệnh viện Chợ Rẫy",
      image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3",
      certification: "Chứng nhận ISO 9a001:2015"
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

  const bloodTypesDetail = {
    O: {
      name: "Group O",
      description: "không có kháng nguyên A và B trên tế bào hồng cầu (nhưng cả kháng thể A và B đều có trong huyết tương)",
      image: "/images/blood-o.png" // Đường dẫn đến ảnh bạn đã upload
    },
    A: {
      name: "Group A",
      description: "chỉ có kháng nguyên A trên tế bào hồng cầu (và kháng thể B trong huyết tương)",
      image: "/images/blood-a.png"
    },
    B: {
      name: "Group B",
      description: "chỉ có kháng nguyên B trên tế bào hồng cầu (và kháng thể A trong huyết tương)",
      image: "/images/blood-b.png"
    },
    AB: {
      name: "Group AB",
      description: "có cả kháng nguyên A và B trên tế bào hồng cầu (nhưng không có kháng thể A và B trong huyết tương)",
      image: "/images/blood-ab.png"
    }
  };
  
  const [selectedBloodType, setSelectedBloodType] = useState("O");
  
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

      <section className="bg-red-100 p-6">
  <h2 className="text-2xl font-bold text-center mb-6">Thông tin nhóm máu</h2>

  <div className="flex justify-center space-x-2 mb-6">
    {["A", "B", "AB", "O"].map((type) => (
      <button
        key={type}
        onClick={() => setSelectedBloodType(type)}
        className={`px-4 py-2 rounded-full text-sm font-semibold ${
          selectedBloodType === type ? "bg-red-600 text-white" : "bg-white text-gray-700 border"
        }`}
      >
        Group {type}
      </button>
    ))}
  </div>

  <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-4 text-center">
    <h3 className="text-xl font-semibold">{bloodTypesDetail[selectedBloodType].name}</h3>
    <p className="text-sm text-gray-600 mb-4">{bloodTypesDetail[selectedBloodType].description}</p>
    <img
      src={bloodTypesDetail[selectedBloodType].image}
      alt={bloodTypesDetail[selectedBloodType].name}
      className="mx-auto w-full max-h-72 object-contain"
    />
  </div>
</section>


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
