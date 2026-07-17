import React, { useState, useEffect } from "react";
import {
  Save,
  Image as ImageIcon,
  Check,
  Upload,
  FileText,
  Link,
  Trash2,
  Plus,
  LayoutDashboard,
  LogOut,
  LogIn,
} from "lucide-react";
import { auth, db } from "../lib/firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("banner");

  // Banner State
  const [featureImg1, setFeatureImg1] = useState("");
  const [featureImg2, setFeatureImg2] = useState("");
  const [isBannerSaved, setIsBannerSaved] = useState(false);

  // Upload State
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadImg, setUploadImg] = useState("");
  const [uploadType, setUploadType] = useState("gallery");
  const [isUploadSaved, setIsUploadSaved] = useState(false);
  const [existingPosts, setExistingPosts] = useState<any[]>([]);

  // Partners State
  const [partners, setPartners] = useState<
    { id?: string; name: string; img: string; url: string; order: number }[]
  >([]);
  const [isPartnersSaved, setIsPartnersSaved] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchData();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    try {
      // Load banners
      const bannerDoc = await getDoc(doc(db, "banners", "main"));
      if (bannerDoc.exists()) {
        const data = bannerDoc.data();
        setFeatureImg1(
          data.img1 ||
            "https://images.unsplash.com/photo-1593113563332-f1488c282124?q=80&w=600&auto=format&fit=crop",
        );
        setFeatureImg2(
          data.img2 ||
            "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=600&auto=format&fit=crop",
        );
      } else {
        setFeatureImg1(
          "https://images.unsplash.com/photo-1593113563332-f1488c282124?q=80&w=600&auto=format&fit=crop",
        );
        setFeatureImg2(
          "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=600&auto=format&fit=crop",
        );
      }

      // Load partners
      const partnersSnapshot = await getDocs(
        query(collection(db, "partners"), orderBy("order")),
      );
      const partnersData = partnersSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as any,
      );
      setPartners(partnersData.length > 0 ? partnersData : []);

      // Load posts
      const postsSnapshot = await getDocs(
        query(collection(db, "posts"), orderBy("createdAt", "desc")),
      );
      setExistingPosts(
        postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      );
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleBannerSave = async () => {
    if (!user) return;
    try {
      await setDoc(doc(db, "banners", "main"), {
        img1: featureImg1,
        img2: featureImg2,
      });
      setIsBannerSaved(true);
      setTimeout(() => setIsBannerSaved(false), 2000);
    } catch (error) {
      console.error("Error saving banners:", error);
    }
  };

  const handleUploadSubmit = async () => {
    if (!user || !uploadTitle || !uploadImg) {
      alert("제목과 이미지 URL을 입력해주세요.");
      return;
    }

    try {
      const newItem = {
        title: uploadTitle,
        content: uploadDesc,
        img: uploadImg,
        type: uploadType,
        date: new Date().toLocaleDateString("ko-KR"),
        createdAt: new Date().getTime(),
      };
      await addDoc(collection(db, "posts"), newItem);
      setIsUploadSaved(true);
      setUploadTitle("");
      setUploadDesc("");
      setUploadImg("");
      setTimeout(() => setIsUploadSaved(false), 2000);
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!user || !confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteDoc(doc(db, "posts", id));
      fetchData();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handlePartnerChange = (index: number, field: string, value: string) => {
    const newPartners = [...partners];
    newPartners[index] = { ...newPartners[index], [field]: value };
    setPartners(newPartners);
  };

  const addPartner = () => {
    setPartners([
      ...partners,
      { name: "", img: "", url: "", order: partners.length },
    ]);
  };

  const removePartner = async (index: number) => {
    const partner = partners[index];
    if (partner.id) {
      if (!confirm("정말 삭제하시겠습니까?")) return;
      try {
        await deleteDoc(doc(db, "partners", partner.id));
      } catch (error) {
        console.error("Error deleting partner:", error);
        return;
      }
    }
    const newPartners = partners.filter((_, i) => i !== index);
    setPartners(newPartners);
  };

  const handlePartnersSave = async () => {
    if (!user) return;
    try {
      for (let i = 0; i < partners.length; i++) {
        const p = partners[i];
        const partnerData = {
          name: p.name,
          img: p.img,
          url: p.url,
          order: i,
        };
        if (p.id) {
          await updateDoc(doc(db, "partners", p.id), partnerData);
        } else {
          await addDoc(collection(db, "partners"), partnerData);
        }
      }
      setIsPartnersSaved(true);
      setTimeout(() => setIsPartnersSaved(false), 2000);
      fetchData();
    } catch (error) {
      console.error("Error saving partners:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-4 shadow-inner">
          <LayoutDashboard className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-stone-900 tracking-tight">
          관리자 로그인
        </h2>
        <p className="text-stone-500 text-center max-w-md">
          홈페이지 관리를 위해 로그인이 필요합니다. 허가된 관리자 계정으로
          로그인해주세요.
        </p>
        <button
          onClick={handleLogin}
          className="flex items-center gap-3 px-8 py-4 rounded-xl bg-stone-900 text-white font-bold hover:bg-stone-800 transition-all hover:shadow-lg hover:-translate-y-1"
        >
          <LogIn className="w-5 h-5" />
          Google 계정으로 로그인
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-lg">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-stone-900 tracking-tight">
              통합 관리자 패널
            </h2>
            <p className="text-stone-500 mt-1">
              홈페이지의 모든 콘텐츠를 관리할 수 있습니다.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-stone-500 bg-stone-100 px-4 py-2 rounded-lg">
            {user.email}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-500 rounded-lg text-sm font-bold hover:bg-rose-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-stone-200 pb-4 overflow-x-auto whitespace-nowrap hide-scrollbar">
        {[
          { id: "banner", label: "메인 배너 설정" },
          { id: "board", label: "게시물 등록" },
          { id: "manage_board", label: "게시물 관리" },
          { id: "partners", label: "제휴 기관 관리" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-full font-bold transition-all ${
              activeTab === tab.id
                ? "bg-stone-900 text-white shadow-md"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "banner" && (
        <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-stone-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-stone-800">
              홈페이지 주요 기능 카드 이미지 설정
            </h3>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-stone-700">
                첫 번째 카드 이미지 URL (자립과 성장의 요람)
              </label>
              <div className="flex gap-4 items-start">
                <input
                  type="text"
                  value={featureImg1}
                  onChange={(e) => setFeatureImg1(e.target.value)}
                  placeholder="이미지 URL을 입력하세요"
                  className="flex-1 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                />
                <div className="w-32 h-20 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                  {featureImg1 && (
                    <img
                      src={featureImg1}
                      alt="Preview 1"
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://via.placeholder.com/600x400?text=Invalid+Image")
                      }
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-stone-700">
                두 번째 카드 이미지 URL (따뜻한 나눔의 실천)
              </label>
              <div className="flex gap-4 items-start">
                <input
                  type="text"
                  value={featureImg2}
                  onChange={(e) => setFeatureImg2(e.target.value)}
                  placeholder="이미지 URL을 입력하세요"
                  className="flex-1 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                />
                <div className="w-32 h-20 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                  {featureImg2 && (
                    <img
                      src={featureImg2}
                      alt="Preview 2"
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://via.placeholder.com/600x400?text=Invalid+Image")
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <button
              onClick={handleBannerSave}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
            >
              {isBannerSaved ? (
                <Check className="w-5 h-5" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isBannerSaved ? "저장되었습니다" : "변경사항 저장"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "board" && (
        <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-stone-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-stone-800">
              갤러리 및 공지사항 게시물 등록
            </h3>
          </div>

          <div className="space-y-6">
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="gallery"
                  checked={uploadType === "gallery"}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="w-4 h-4 text-emerald-500 border-stone-300 focus:ring-emerald-400"
                />
                <span className="font-bold text-stone-700">갤러리</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="notice"
                  checked={uploadType === "notice"}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="w-4 h-4 text-emerald-500 border-stone-300 focus:ring-emerald-400"
                />
                <span className="font-bold text-stone-700">공지사항</span>
              </label>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-stone-700">
                게시물 제목
              </label>
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="게시물 제목을 입력하세요"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-stone-700">
                이미지 URL
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <input
                  type="text"
                  value={uploadImg}
                  onChange={(e) => setUploadImg(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                />
              </div>

              <div className="mt-4 border-2 border-dashed border-stone-200 rounded-2xl p-4 bg-stone-50 flex items-center justify-center min-h-[16rem]">
                {uploadImg ? (
                  <img
                    src={uploadImg}
                    alt="Preview"
                    className="max-h-64 rounded-xl object-contain shadow-sm"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://via.placeholder.com/600x400?text=Invalid+Image")
                    }
                  />
                ) : (
                  <div className="text-center text-stone-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">
                      이미지 URL을 입력하면 미리보기가 표시됩니다.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-stone-700">
                설명 / 내용
              </label>
              <textarea
                value={uploadDesc}
                onChange={(e) => setUploadDesc(e.target.value)}
                placeholder="게시물에 대한 설명을 입력하세요..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all resize-none"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleUploadSubmit}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
            >
              {isUploadSaved ? (
                <Check className="w-5 h-5" />
              ) : (
                <FileText className="w-5 h-5" />
              )}
              {isUploadSaved ? "등록되었습니다" : "게시물 등록하기"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "manage_board" && (
        <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-stone-100">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-500 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-stone-800">
              등록된 게시물 관리
            </h3>
          </div>

          <div className="space-y-4">
            {existingPosts.length === 0 ? (
              <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200 border-dashed">
                <p className="text-stone-500">등록된 게시물이 없습니다.</p>
              </div>
            ) : (
              existingPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors"
                >
                  <div className="w-24 h-16 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                    {post.img ? (
                      <img
                        src={post.img}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 m-auto text-stone-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${post.type === "gallery" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}
                      >
                        {post.type === "gallery" ? "갤러리" : "공지사항"}
                      </span>
                      <span className="text-xs text-stone-400">
                        {post.date}
                      </span>
                    </div>
                    <h4 className="font-bold text-stone-900 truncate">
                      {post.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "partners" && (
        <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <Link className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-stone-800">
                제휴 기관 (로고 슬라이더) 관리
              </h3>
            </div>
            <button
              onClick={addPartner}
              className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-bold hover:bg-stone-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              기관 추가
            </button>
          </div>

          <div className="space-y-6">
            {partners.map((partner, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-stone-200 bg-stone-50 flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="flex-1 space-y-4 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-500">
                        기관명
                      </label>
                      <input
                        type="text"
                        value={partner.name}
                        onChange={(e) =>
                          handlePartnerChange(idx, "name", e.target.value)
                        }
                        placeholder="예: 통일부"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-500">
                        연결 링크 URL
                      </label>
                      <input
                        type="text"
                        value={partner.url}
                        onChange={(e) =>
                          handlePartnerChange(idx, "url", e.target.value)
                        }
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500">
                      로고 이미지 URL (PNG, SVG, JPG 등)
                    </label>
                    <input
                      type="text"
                      value={partner.img}
                      onChange={(e) =>
                        handlePartnerChange(idx, "img", e.target.value)
                      }
                      placeholder="이미지 주소를 입력하세요"
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="w-full md:w-48 flex flex-col items-center gap-3">
                  <div className="w-full h-24 rounded-xl border border-stone-200 bg-white flex items-center justify-center p-2">
                    {partner.img ? (
                      <img
                        src={partner.img}
                        alt={partner.name}
                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                        onError={(e) =>
                          (e.currentTarget.src =
                            "https://via.placeholder.com/150x50?text=Error")
                        }
                      />
                    ) : (
                      <span className="text-xs text-stone-400">
                        이미지 없음
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removePartner(idx)}
                    className="flex items-center gap-1 text-sm text-rose-500 hover:text-rose-600 font-bold"
                  >
                    <Trash2 className="w-4 h-4" />
                    삭제
                  </button>
                </div>
              </div>
            ))}

            {partners.length === 0 && (
              <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200 border-dashed">
                <p className="text-stone-500">등록된 제휴 기관이 없습니다.</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handlePartnersSave}
              className="flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
            >
              {isPartnersSaved ? (
                <Check className="w-5 h-5" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isPartnersSaved ? "저장되었습니다" : "로고 정보 저장"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
