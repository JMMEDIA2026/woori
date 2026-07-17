import fs from 'fs';

let code = `import React, { useState, useEffect } from "react";
import { Lock, Check, X, User, Calendar, Eye } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { db } from "../lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

const INITIAL_QNA = [
  { id: 1, type: "문의", title: "정기 후원 납부 방법 문의드립니다.", date: "2024.11.19", author: "김*민", views: 12, content: "자동이체 계좌 변경은 어떻게 하나요?", status: "답변완료" },
  { id: 2, type: "문의", title: "일시 후원도 가능한가요?", date: "2024.11.18", author: "이*영", views: 5, content: "일시적으로 후원하고 싶은데 계좌번호를 알고 싶습니다.", status: "답변대기" },
];

export default function CommunityBoard({ activeSubSection }: { activeSubSection?: string }) {
  const isQnA = activeSubSection === "qna";
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      if (isQnA) {
        setPosts(INITIAL_QNA);
        return;
      }
      try {
        const q = query(collection(db, "posts"), where("type", "==", "notice"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        data.sort((a: any, b: any) => b.createdAt - a.createdAt);
        
        if (data.length > 0) {
          setPosts(data);
        } else {
          setPosts([
             { id: 1, type: "notice", title: "[필독] 2024년도 하반기 지원사업 안내", date: "2024.11.19", author: "관리자", views: 124, content: "2024년도 하반기 지원사업 안내입니다." },
             { id: 2, type: "notice", title: "정기 후원금 영수증 발급 안내", date: "2024.11.18", author: "관리자", views: 98, content: "연말정산을 위한 기부금 영수증 발급 방법 안내" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };
    fetchNotices();
  }, [isQnA]);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-stone-200 pb-6">
        <div>
          <h2 className="text-3xl font-black text-stone-900 tracking-tight">
            {isQnA ? "Q&A" : "공지사항"}
          </h2>
          <p className="text-stone-500 mt-2">
            {isQnA ? "궁금한 점을 남겨주시면 성심껏 답변해 드립니다." : "재단의 새로운 소식과 주요 안내 사항을 알려드립니다."}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 text-sm font-bold">
                <th className="py-4 px-6 w-20 text-center">번호</th>
                <th className="py-4 px-6 w-24 text-center">분류</th>
                <th className="py-4 px-6">제목</th>
                <th className="py-4 px-6 w-28 text-center">작성자</th>
                <th className="py-4 px-6 w-32 text-center">작성일</th>
                <th className="py-4 px-6 w-24 text-center">조회수</th>
              </tr>
            </thead>
            <tbody className="text-stone-800 text-sm">
              {posts.map((post, idx) => (
                <tr
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="border-b border-stone-100 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6 text-center text-stone-400 font-medium">
                    {posts.length - idx}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={\`px-2 py-1 rounded-full text-xs font-bold \${post.type === '공지' || post.type === 'notice' ? 'bg-indigo-100 text-indigo-700' : 'bg-stone-100 text-stone-600'}\`}>
                      {post.type === 'notice' ? '공지' : post.type || '일반'}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium group">
                    <div className="flex items-center gap-2">
                      <span className="group-hover:text-indigo-600 transition-colors line-clamp-1">{post.title}</span>
                      {post.status === "답변완료" && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold border border-emerald-100 shrink-0">답변완료</span>
                      )}
                      {post.status === "답변대기" && (
                        <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded font-bold border border-amber-100 shrink-0">대기중</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center text-stone-500">{post.author || "관리자"}</td>
                  <td className="py-4 px-6 text-center text-stone-500">{post.date}</td>
                  <td className="py-4 px-6 text-center text-stone-400">{post.views || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
              <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-stone-100 p-6 flex justify-between items-center z-10">
                <h3 className="text-xl font-bold text-stone-900 truncate pr-8">{selectedPost.title}</h3>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-6 text-sm font-semibold text-stone-500 mb-8 pb-8 border-b border-stone-100">
                  <span className="flex items-center gap-2"><User className="w-4 h-4" /> {selectedPost.author || "관리자"}</span>
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {selectedPost.date}</span>
                  <span className="flex items-center gap-2"><Eye className="w-4 h-4" /> {selectedPost.views || 0}</span>
                </div>
                {selectedPost.img && (
                   <img src={selectedPost.img} alt="attachment" className="w-full max-w-2xl mx-auto rounded-xl object-cover mb-8 shadow-sm border border-stone-200" />
                )}
                <div className="prose prose-stone max-w-none prose-lg">
                   <p className="whitespace-pre-wrap text-stone-700 leading-relaxed">{selectedPost.content}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
`;

fs.writeFileSync('src/page/CommunityBoard.tsx', code);
