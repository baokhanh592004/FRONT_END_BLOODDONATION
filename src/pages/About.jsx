import React from 'react';

// === Biểu tượng (Icons) dạng SVG ===
// Để component tự chứa và dễ dàng sử dụng,  nhúng các icon SVG trực tiếp.
const BloodDropIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d90429" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10a8 8 0 0 0-16 0c0 6 8 10 8 10z"></path>
  </svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d90429" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const CommunityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d90429" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const MicroscopeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d90429" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 18h8"></path>
    <path d="M3 22h18"></path>
    <path d="M14 22a7 7 0 1 0 0-14h-1"></path>
    <path d="M9 14h2"></path>
    <path d="M9 11h2"></path>
    <path d="M13 11h2"></path>
    <path d="M13 8h2"></path>
    <path d="M18 8a3 3 0 0 0-3-3V2a3 3 0 0 0-3 3v3a3 3 0 0 0-3 3"></path>
  </svg>
);


// === CSS cho trang About ===
const styles = `
  .about-page {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #2b2d42; /* Màu chữ chính, tối để dễ đọc */
    background-color: #fff;
  }

  /* --- Hero Section --- */
  .hero-section {
    position: relative;
    height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
    background-image: url('https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80');
    background-size: cover;
    background-position: center;
  }

  .hero-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Lớp phủ tối để làm nổi bật chữ */
  }

  .hero-content {
    position: relative;
    z-index: 1;
  }

  .hero-content h1 {
    font-size: 3.5rem;
    margin-bottom: 0.5rem;
    font-weight: 700;
  }

  .hero-content p {
    font-size: 1.5rem;
    font-style: italic;
    font-weight: 300;
  }

  /* --- Content Sections --- */
  .content-section {
    max-width: 1100px;
    margin: 4rem auto;
    padding: 0 1rem;
  }
  
  .section-title {
    text-align: center;
    font-size: 2.5rem;
    color: #d90429; /* Màu đỏ chủ đạo */
    margin-bottom: 1rem;
    font-weight: 600;
  }

  .section-subtitle {
    text-align: center;
    max-width: 800px;
    margin: 0 auto 3rem auto;
    font-size: 1.1rem;
    line-height: 1.6;
    color: #8d99ae;
  }

  /* --- Intro Section (Video & Text) --- */
  .intro-layout {
    display: flex;
    gap: 2rem;
    align-items: center;
  }

  .intro-video {
    flex: 1;
    aspect-ratio: 16 / 9; /* Giữ tỷ lệ video */
  }

  .intro-video iframe {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 8px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  }

  .intro-text {
    flex: 1;
    font-size: 1.1rem;
    line-height: 1.7;
  }

  /* --- Work Section (Grid) --- */
  .work-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-top: 3rem;
  }

  .work-card {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .work-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(43, 45, 66, 0.1);
  }

  .work-card .icon-container {
    flex-shrink: 0;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border: 2px solid #d90429;
  }

  .work-card h3 {
    margin: 0 0 0.5rem 0;
    color: #d90429;
    font-size: 1.25rem;
  }

  .work-card p {
    margin: 0;
    font-size: 0.95rem;
    color: #8d99ae;
    line-height: 1.5;
  }

  /* --- Responsive --- */
  @media (max-width: 768px) {
    .hero-content h1 {
      font-size: 2.5rem;
    }
    .hero-content p {
      font-size: 1.2rem;
    }
    .intro-layout, .work-grid {
      flex-direction: column;
      grid-template-columns: 1fr;
    }
    .section-title {
      font-size: 2rem;
    }
  }
`;

export default function About() {
  return (
    <>
      <style>{styles}</style>
      <div className="about-page">
        {/* --- Hero Section --- */}
        <header className="hero-section">
          <div className="hero-content">
            <h1>Về Chúng Tôi</h1>
            <p>Kết Nối Những Trái Tim, Trao Tặng Dòng Máu Sự Sống</p>
          </div>
        </header>

        <main>
          {/* --- Intro Section with Video --- */}
          <section className="content-section">
            <div className="intro-layout">
              <div className="intro-video">
                {/* 
                  QUAN TRỌNG:
                  Đây là iframe để nhúng video của bạn từ YouTube.
                  Nếu bạn có video khác, hãy vào YouTube, nhấn "Chia sẻ" (Share) -> "Nhúng" (Embed)
                  và sao chép URL trong thuộc tính `src="..."` để dán vào đây.
                */}
                <iframe
                  src="https://www.youtube.com/embed/VbDIjIydrWM?si=iDEImqeHhsVgjsga"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="intro-text">
                <p>
                  Mỗi ngày, hàng ngàn người bệnh đang cần đến những giọt máu quý giá để duy trì sự sống. Tại <strong>Trung tâm Hiến Máu Nhân Đạo</strong>, chúng tôi kết nối những tấm lòng nhân ái - những người hiến máu, tình nguyện viên và đội ngũ y bác sĩ - cùng chung một sứ mệnh ngăn ngừa và xoa dịu nỗi đau, mang lại hy vọng cho cộng đồng.
                </p>
                <p>
                  Chúng tôi tin rằng mỗi giọt máu cho đi không chỉ là một hành động cao đẹp, mà còn là nguồn sống vô giá, đặc biệt đối với những bệnh nhân mang nhóm máu hiếm. Hãy cùng chúng tôi lan tỏa yêu thương và viết tiếp những câu chuyện về sự sống.
                </p>
              </div>
            </div>
          </section>

          {/* --- Our Work Section --- */}
          <section className="content-section">
            <h2 className="section-title">Lĩnh Vực Hoạt Động Của Chúng Tôi</h2>
            <p className="section-subtitle">
              Chúng tôi hoạt động trên nhiều lĩnh vực để đảm bảo nguồn máu an toàn và hỗ trợ cộng đồng một cách toàn diện nhất.
            </p>
            <div className="work-grid">
              
              <div className="work-card">
                <div className="icon-container"><BloodDropIcon /></div>
                <div>
                  <h3>Tiếp Nhận & Sàng Lọc Máu</h3>
                  <p>Tổ chức các điểm hiến máu cố định và lưu động, áp dụng quy trình sàng lọc nghiêm ngặt để đảm bảo an toàn tuyệt đối.</p>
                </div>
              </div>

              <div className="work-card">
                <div className="icon-container"><MicroscopeIcon /></div>
                <div>
                  <h3>Ngân Hàng Máu Hiếm</h3>
                  <p>Xây dựng và quản lý ngân hàng dữ liệu các nhóm máu hiếm, sẵn sàng đáp ứng các trường hợp khẩn cấp cho bệnh nhân đặc biệt.</p>
                </div>
              </div>

              <div className="work-card">
                <div className="icon-container"><HeartIcon /></div>
                <div>
                  <h3>Hỗ Trợ Bệnh Nhân</h3>
                  <p>Hỗ trợ trực tiếp cho các bệnh nhân cần truyền máu, đặc biệt là bệnh nhi và người có hoàn cảnh khó khăn.</p>
                </div>
              </div>
              
              <div className="work-card">
                <div className="icon-container"><CommunityIcon /></div>
                <div>
                  <h3>Phát Triển Cộng Đồng</h3>
                  <p>Tổ chức các sự kiện, chiến dịch truyền thông nhằm nâng cao nhận thức và xây dựng một cộng đồng hiến máu bền vững.</p>
                </div>
              </div>

            </div>
          </section>
        </main>
      </div>
    </>
  );
}