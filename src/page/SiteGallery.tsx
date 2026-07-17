import React, { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Check,
  X,
  Eye,
  Calendar,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { db } from "../lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

export default function SiteGallery() {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const q = query(
          collection(db, "posts"),
          where("type", "==", "gallery"),
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // sort in JS because orderBy with where requires a composite index
        data.sort((a: any, b: any) => b.createdAt - a.createdAt);
        if (data.length > 0) {
          setPosts(data);
        } else {
          setPosts([
            {
              id: 1,
              title: "우리원 봉사단과 함께하는 사랑의 연탄 나눔 및 밑반찬 배달",
              date: "2024.11.16",
              author: "관리자",
              views: 245,
              img: "https://images.unsplash.com/photo-1593113563332-f1488c282124?q=80&w=600&auto=format&fit=crop",
              content:
                "추운 겨울을 맞아 지역 사회의 소외된 이웃들에게 따뜻한 온기를 전하고자 사랑의 연탄 나눔과 밑반찬 배달 봉사활동을 진행했습니다.",
            },
            {
              id: 2,
              title: "탈북민 자립 공방 '희망을 빚다' 일일 체험 클래스",
              date: "2024.11.10",
              author: "관리자",
              views: 182,
              img: "https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=600&auto=format&fit=crop",
              content:
                "자립 공방에서 수공예품 제작 체험 클래스를 성황리에 마쳤습니다.",
            },
            {
              id: 3,
              title: "가을맞이 지역주민과 함께하는 바자회 현장 스케치",
              date: "2024.10.25",
              author: "관리자",
              views: 310,
              img: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=600&auto=format&fit=crop",
              content: "바자회 수익금은 전액 소외계층을 위해 쓰일 예정입니다.",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching gallery:", error);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-stone-200 pb-6">
        <div>
          <h2 className="text-3xl font-black text-stone-900 tracking-tight">
            단체 갤러리
          </h2>
          <p className="text-stone-500 mt-2">
            재단의 생생한 활동 현장을 사진과 함께 전해드립니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="group rounded-2xl bg-white border border-stone-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col h-full"
          >
            <div className="aspect-[4/3] w-full overflow-hidden relative shrink-0">
              {post.img ? (
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-stone-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-lg font-bold text-stone-900 mb-2 line-clamp-2 leading-snug">
                {post.title}
              </h3>
              <p className="text-stone-500 text-sm line-clamp-2 mb-4 flex-1">
                {post.content}
              </p>
              <div className="flex items-center justify-between text-xs font-semibold text-stone-400 mt-auto pt-4 border-t border-stone-50">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" /> 관리자
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full bg-stone-100 relative">
                {selectedPost.img && (
                  <img
                    src={selectedPost.img}
                    alt={selectedPost.title}
                    className="w-full max-h-[60vh] object-contain"
                  />
                )}
              </div>

              <div className="p-8 md:p-12">
                <div className="flex items-center gap-4 text-sm font-semibold text-stone-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {selectedPost.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" /> 관리자
                  </span>
                </div>
                <h2 className="text-3xl font-black text-stone-900 tracking-tight mb-8">
                  {selectedPost.title}
                </h2>

                <div className="prose prose-stone max-w-none prose-lg">
                  <p className="whitespace-pre-wrap leading-relaxed text-stone-700">
                    {selectedPost.content}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
