import React from "react";
import BloodTypeVisualizer from "../components/BloodTypeVisualizer";

// Icon nhỏ để thêm vào các liên kết "Đọc thêm" cho sinh động
const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 ml-1 transition-transform duration-300 group-hover:translate-x-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const HomePages = () => {
  // Dữ liệu mẫu, không thay đổi
  const participatingHospitals = [
    {
      name: "Bệnh viện Chợ Rẫy",
      image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      certification: "Chứng nhận ISO 9001:2015"
    },
    {
      name: "Bệnh viện Truyền máu Huyết học",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      certification: "Chứng nhận JCI Quốc tế"
    },
    {
      name: "Viện Huyết học - Truyền máu TW",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      certification: "Chứng nhận ISO 15189"
    }
  ];

  const blogPosts = [
    {
      title: "Tầm quan trọng của việc hiến máu định kỳ",
      excerpt: "Hiến máu định kỳ không chỉ cứu sống người khác mà còn mang lại nhiều lợi ích bất ngờ cho sức khỏe của chính người hiến tặng...",
      image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      link: "/blog/tam-quan-trong-hien-mau"
    },
    {
      title: "Các bước chuẩn bị cần thiết trước khi đi hiến máu",
      excerpt: "Để đảm bảo một buổi hiến máu an toàn và hiệu quả, việc chuẩn bị kỹ lưỡng về thể chất và tinh thần là vô cùng quan trọng...",
      image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      link: "/blog/chuan-bi-truoc-khi-hien-mau"
    }
  ];

  return (
    // Sử dụng màu nền xám rất nhạt để làm nổi bật các phần tử màu trắng
    <div className="bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* --- Phần Bệnh viện tham gia --- */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">
              Đối Tác Đồng Hành
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Các bệnh viện và trung tâm huyết học hàng đầu cùng chúng tôi trong sứ mệnh cứu người.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {participatingHospitals.map((hospital, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                <img 
                  src={hospital.image} 
                  alt={hospital.name} 
                  className="w-full h-48 object-cover" 
                />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-900">{hospital.name}</h3>
                  <p className="mt-2 text-sm font-medium text-red-600 bg-red-50 inline-block px-3 py-1 rounded-full">
                    {hospital.certification}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- Phần BloodTypeVisualizer được giữ nguyên --- */}
        <section className="py-16">
            {/* Blood Type Info */}
            <BloodTypeVisualizer />
        </section>
        
        {/* --- Phần Blog --- */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">
              Góc Kiến Thức
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Cập nhật những thông tin hữu ích về hiến máu và sức khỏe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
            {blogPosts.map((post, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col group"
              >
                <div className="overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-56 object-cover transform transition-transform duration-500 group-hover:scale-105" 
                    />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-600 flex-grow mb-4">{post.excerpt}</p>
                  <a 
                    href={post.link} 
                    className="mt-auto inline-flex items-center font-semibold text-red-600 hover:text-red-800 transition-colors duration-300 group"
                  >
                    Đọc thêm
                    <ArrowRightIcon />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default HomePages;