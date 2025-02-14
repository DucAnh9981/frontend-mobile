export interface PostDataType {
  post_id: string; // ID bài đăng
  title: string; // Tiêu đề bài đăng
  estate_type: string; // Loại bất động sản (nhà hoặc đất)
  price: string; // Giá tiền (định dạng: số + VND)
  status: string; // Trạng thái bài đăng (VD: Đang chờ duyệt)
  city: string; // Thành phố
  district: string; // Quận/Huyện
  ward: string; // Phường/Xã
  street: string; // Tên đường
  address: string; // Địa chỉ cụ thể
  orientation: string; // Hướng (VD: Đông Nam)
  land_lot: string; // Lô đất
  map_sheet_number: string; // Tờ bản đồ
  land_parcel: string; // Thửa đất
  area: string; // Diện tích (định dạng: số + m²)
  frontage: string; // Mặt tiền (đơn vị: mét)
  bedroom: number; // Số phòng ngủ
  bathroom: number; // Số phòng tắm
  floor: number | undefined; // Số tầng
  longitude: string; // Kinh độ
  latitude: string; // Vĩ độ
  legal_status: string;
  length: string;
  width: string; 
  sale_status: string; 
  images: string | null; 
  description: string; 
  created_at: string; 
  updated_at: string; 
  reactions_count: number; 
  view_count: number; 
  comments_count: number;
  save_count: number;
  user: {
    avatar_url:string;
    user_id: string;
    username: string; 
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
  reputation_score: string;
  successful_transactions: number;
  response_rate: string;
  profile_completeness: string;
  negotiation_experience: number;
}
export interface UserAvatar {
  avatar_url: string;
}

export interface CommentPostInterface {
  id: number;
  username: string;
  fullname: string;
  comment: string;
  user_id: string;
  avatar_url:string;
  created_at: string;
}

export interface PostFormData {
  title: string; 
  estate_type: string; 
  price: string; 
  city: string; 
  district: string; 
  ward: string; 
  street: string;
  address: string; 
  orientation: string; 
  land_lot: string; 
  map_sheet_number: string; 
  land_parcel: string;
  area: number;
  frontage: number; 
  bedroom: number; 
  bathroom: number; 
  floor: number; 
  longitude: string; 
  latitude: string; 
  width: number;
  length: number;
  legal_status: string; 
  sale_status: string; 
  images: string | null; 
  description: string; 
}

interface UserNe {
  user_id: string;
  username: string;
  fullname: string;
}

export interface NegotiationData {
  negotiation_id: string;
  post: string;
  user: UserNe;
  negotiation_price: number;
  negotiation_date: string;
  payment_method: string;
  negotiation_note: string;
  is_considered: boolean;
  is_accepted: boolean;
  created_at: string;
  average_response_time: number | null;
  highest_negotiation_user: UserNe;
  proposals: any[]; 
  highest_negotiation_price: number;
}
export interface Proposal {
  proposal_id: string;
  user: User;
  negotiation: string;
  proposal_price: number;
  proposal_date: string; // ISO 8601 date string
  proposal_method: string;
  proposal_note: string;
  is_accepted: boolean;
  created_at: string; // ISO 8601 date-time string
}
export interface ReNegotiationData {
  message: string;
  count: number;
  proposals: Proposal[];
}

export interface PostImage {
  img: string[];
}
