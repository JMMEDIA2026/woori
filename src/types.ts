/**
 * 비영리민간단체 우리원 & R.ef 30주년 프로젝트 
 * 통합 데이터베이스 스키마 및 타입 정의
 */

// --- 1. R.ef 30주년 프로젝트 전용 열거형 및 타입 ---

export enum MembershipTier {
  NORMAL = "NORMAL",
  GOLD = "GOLD",
  BLACK = "BLACK"
}

export enum CardType {
  GOLD_PREMIUM = "GOLD_PREMIUM",
  BLACK_VIP = "BLACK_VIP"
}

export enum PostCategory {
  NOTICE = "NOTICE",
  FREE = "FREE",
  GALLERY = "GALLERY",
  ACADEMIC = "ACADEMIC",
  FINANCE = "재정 투명성",
  VOLUNTEER = "자원봉사 신청"
}

export enum DriveAction {
  VIEW = "VIEW",
  DOWNLOAD = "DOWNLOAD",
  BACKUP = "BACKUP",
  UPLOAD = "UPLOAD"
}

/** R.ef 팬클럽 회원 */
export interface Member {
  id: string; 
  email: string;
  displayName: string;
  membershipTier: MembershipTier;
  joinDate: Date | any;
  isActive: boolean;
  phoneNumber?: string;
  photoURL?: string;
}

/** 디지털 멤버십 카드 */
export interface MembershipCard {
  id: string;
  memberId: string;
  cardNumber: string;
  cardType: CardType;
  issueDate: Date | any;
  expiryDate: Date | any;
}

/** 구글 드라이브 연동 로그 */
export interface DriveLog {
  id: string;
  fileId: string;
  fileName: string;
  action: DriveAction;
  timestamp: Date | any;
  performedBy: string;
}

// --- 2. 우리원 기존 시스템용 타입 (Legacy & Integration) ---

/** 연혁/마일스톤 */
export interface Milestone {
  year: number;
  date: string;
  title: string;
  description: string;
  iconType: "people" | "heart" | "globe" | "certificate" | "award" | "book" | "music";
}

/** 학술 자료 */
export interface AcademicDoc {
  id: string;
  title: string;
  author: string;
  publisher: string;
  publishYear: number;
  category: string;
  tags: string[];
  summary: string;
  keyPoints: string[];
}

/** 갤러리/미디어 */
export interface GalleryMedia {
  id: string;
  title: string;
  category: "활동소식" | "영상자료" | "대외협력";
  date: string;
  imageUrl: string;
  videoUrl?: string;
  description: string;
}

/** 커뮤니티 댓글 */
export interface CommunityReply {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

/** 커뮤니티 게시물 */
export interface CommunityPost {
  id: string;
  title: string;
  author: string;
  category: string;
  createdAt: string;
  views: number;
  isImportant?: boolean;
  content: string;
  replies: CommunityReply[];
}

/** 상담 신청 */
export interface CounselingRequest {
  id: string;
  name: string;
  phone: string;
  age: string;
  type: string; // "1:1 심리상담", "통일마중쉼터 입소" 등
  status: string; // "코치 배정완료", "접수대기" 등
  message: string;
  createdAt: string;
}

/** 기부/후원 기록 */
export interface DonationRecord {
  id: string;
  name: string;
  amount: number;
  isRegular: boolean;
  message: string;
  email: string;
  phone: string;
  createdAt: string;
}

/** 통합 게시물 (R.ef 30주년 통합용 신규 인터페이스) */
export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  category: PostCategory;
  createdAt: Date | any;
  viewCount: number;
  thumbnailUrl?: string;
  attachments?: string[];
}

/** 프로젝트 글로벌 환경 설정 */
export interface AppConfig {
  siteName: string;
  isMaintenanceMode: boolean;
  featuredNoticeId?: string;
  activeAnniversaryYear: number;
}
