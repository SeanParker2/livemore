import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于 - Livemore",
  description: "在这个噪音喧嚣的市场中，寻找确定的价值。",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4 sm:px-6 lg:px-8">
      <article className="prose prose-lg prose-slate dark:prose-invert mx-auto font-serif">
        <h1>在这个噪音喧嚣的市场中，寻找确定的价值。</h1>
        <p className="lead text-xl text-muted-foreground not-prose mb-8">
          Livemore 不仅仅是一份投资周刊，它是理性投资者对抗市场波动的避风港。
        </p>
        
        <h3>我们相信什么？</h3>
        <p>大多数财经媒体都在制造焦虑，试图让你频繁交易。而我们坚持<strong>“少即是多”</strong>的原则。</p>
        <ul>
          <li><strong>长期主义：</strong> 我们关注未来 5-10 年的产业趋势，而非明天的股价波动。</li>
          <li><strong>数据驱动：</strong> 拒绝模棱两可的“感觉”，每一份研报背后都是数十小时的数据清洗与建模。</li>
          <li><strong>独立思考：</strong> 不做华尔街的传声筒，提供独特、甚至反共识的视角。</li>
        </ul>

        <hr className="my-8" />

        <h3>关于创始人</h3>
        <div className="flex items-start gap-6 not-prose mt-8 p-6 bg-muted/30 rounded-md border border-fine">
            <Avatar className="h-16 w-16 border border-fine">
              <AvatarImage src="https://i.pravatar.cc/150?u=LivemoreFounder" />
              <AvatarFallback>LM</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-lg font-bold font-sans">Livemore 站长</h4>
              <p className="text-sm text-muted-foreground mt-1">
                前对冲基金分析师，现独立撰稿人。拥有 10 年美股与加密资产配置经验。致力于用最简单的语言，拆解最复杂的商业逻辑。
              </p>
            </div>
        </div>
      </article>
    </div>
  );
}