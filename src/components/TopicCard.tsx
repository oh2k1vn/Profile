import { Play, Map, Share2, Trophy, Monitor, ShoppingBag } from "lucide-react";
interface TopicCardProps {
  topic: string;
}

const TOPIC_ICONS: Record<string, React.ElementType> = {
  play_games: Play,
  travelling: Map,
  social_media: Share2,
  sport: Trophy,
  learning_online: Monitor,
  shopping_online: ShoppingBag,
};

export function TopicCard({ topic }: TopicCardProps) {
  const cleanTopic = topic.replace(/^vocab_/, "");
  const Icon = TOPIC_ICONS[cleanTopic] || Play;

  return (
    <div className="flex flex-col items-center text-center space-y-4 p-4">
      {/* Icon Container with Glassy Glow */}
      <div className="relative group/icon">
        <div className="absolute -inset-2 bg-linear-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500" />
        <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-slate-900 border border-white/5 group-hover/icon:border-blue-500/30 transition-all duration-300 shadow-2xl">
          <Icon className="w-8 h-8 text-slate-400 group-hover/icon:text-blue-400 group-hover/icon:scale-110 transition-all duration-300" />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-black capitalize text-slate-200 group-hover:text-white transition-colors tracking-tight leading-tight">
          {cleanTopic.replace(/_/g, " ")}
        </h3>
        <div className="flex items-center justify-center gap-2 mt-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5">
          <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">
            Topic Module
          </span>
        </div>
      </div>
    </div>
  );
}
