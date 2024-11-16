export interface PostDataType {
  post_id: string;              
  title: string;                
  estate_type: string;         
  price: string;                
  status: string;               
  city: string;                 
  district: string;             
  street: string;               
  address: string;             
  orientation: string;         
  area: string;                 
  frontage: string;            
  bedroom: number;              
  bathroom: number;            
  floor: number;                
  legal_status: string;         // Tình trạng pháp lý của bất động sản (Ví dụ: Sổ đỏ)
  sale_status: string;          // Trạng thái bán (Ví dụ: Đang bán)
  images: string | null;        // Đường dẫn tới hình ảnh (hoặc null nếu không có)
  description: string;          // Mô tả về bất động sản
  created_at: string;           // Thời gian tạo bài đăng
  updated_at: string;           // Thời gian cập nhật bài đăng
  reactions_count: number;      // Số lượt phản ứng
  view_count: number;           // Số lượt xem
  comments_count: number;       // Số lượt bình luận
  save_count: number;           // Số lượt lưu bài đăng
  user: {                       // Thông tin người đăng bài
    user_id: string;            // ID của người đăng bài
    username: string;           // Tên người dùng
    fullname: string | null;    
  };
}


export interface NewsDataType {
  article_id: string;
  title: string;
  link: string;
  keywords: string[];
  creator: null;
  video_url: null;
  description: string;
  content: string;
  pubDate: string;
  image_url: string;
  source_id: string;
  source_priority: number;
  source_name: string;
  source_url: string;
  source_icon: string;
  language: string;
  country: string[];
  category: string[];
  ai_tag: string[];
  ai_region: string[];
  ai_org: null;
  sentiment: string;
  sentiment_stats: Sentimentstats;
  duplicate: boolean;
}

interface Sentimentstats {
  positive: number;
  neutral: number;
  negative: number;
}

export interface User {
  email: string;
  username: string;
  role: string;
}

export interface UserProfile {
  user_id: string;
  user: User;
  fullname: string;
  city: string;
  birthdate: string;
  phone_number: string;
  gender: string;
  avatar: string | null;
}