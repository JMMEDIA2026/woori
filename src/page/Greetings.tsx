import React from "react";
import { UserCheck } from "lucide-react";

export default function Greetings() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-stone-900 drop-shadow-sm mb-4">대표 인사말</h2>
        <p className="text-stone-500 font-medium">우리원 이사장 인사말입니다.</p>
      </div>
      <div className="bg-white rounded-3xl p-8 md:p-12 border border-stone-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] transition-all duration-500">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="w-48 h-48 rounded-2xl bg-stone-50 shrink-0 border border-stone-100 overflow-hidden mx-auto md:mx-0 shadow-sm relative group cursor-pointer hover:border-rose-200 transition-colors">
             <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <UserCheck className="w-16 h-16 text-stone-300 group-hover:text-rose-400 transition-colors" />
             </div>
             {/* Actual image could go here */}
          </div>
          <div className="space-y-6 text-stone-700 leading-relaxed text-sm md:text-base font-medium">
            <h3 className="text-2xl font-bold text-stone-900 leading-tight">"탈북민의 자립과 희망,<br/>우리원이 함께 만들어가겠습니다."</h3>
            <p>
              안녕하십니까, 비영리민간단체 우리원 이사장 채신아입니다.
            </p>
            <p>
              우리원은 북한이탈주민들이 대한민국 사회에 안정적으로 정착하고, 나아가 경제적·정서적으로 완전한 자립을 이룰 수 있도록 돕기 위해 설립되었습니다. 고향을 떠나 낯선 땅에서 새로운 삶을 개척하는 일은 결코 쉽지 않지만, 그 과정에서 겪는 어려움을 누구보다 잘 알기에 동료로서 함께 손을 맞잡고자 합니다.
            </p>
            <p>
              단순한 지원을 넘어, 1:1 치유 멘토링, 수공예 자립 공방 운영, 그리고 메아리 예술단을 통한 문화 소통까지, 우리원은 다양한 방식으로 탈북민의 삶에 실질적인 힘이 되고자 노력하고 있습니다. 
            </p>
            <p>
              앞으로도 지역사회와 상생하며 투명하고 진정성 있는 활동을 통해 나눔의 가치를 실천하겠습니다. 우리원의 발걸음에 따뜻한 관심과 성원을 부탁드립니다. 감사합니다.
            </p>
            <div className="mt-8 pt-6 border-t border-stone-100 text-right font-bold text-stone-900 text-lg">
              비영리민간단체 우리원 이사장 <span className="text-rose-600 ml-2 text-xl font-black">채 신 아</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
