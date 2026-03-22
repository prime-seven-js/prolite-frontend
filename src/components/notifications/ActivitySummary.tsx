import { Heart, MessageSquare, Star, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivitySummaryProps {
  likes: number;
  comments: number;
}

/**
 * ActivitySummary — card tổng hợp số lượng likes/comments trên right sidebar.
 */
const ActivitySummary = ({ likes, comments }: ActivitySummaryProps) => {
  return (
    <Card className="glass-card border-0 rounded-2xl py-0">
      <CardHeader className="p-5 pb-0">
        <CardTitle className="font-bold text-[15px] flex items-center gap-2">
          <Star className="w-4 h-4 text-[#63d4f7]" />
          Activity Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-4">
        <div className="space-y-3">
          <SummaryRow
            icon={Heart}
            iconColor="text-pink-500"
            label="Likes received"
            value={likes}
          />
          <SummaryRow
            icon={MessageSquare}
            iconColor="text-[#63d4f7]"
            label="Comments"
            value={comments}
          />
        </div>
      </CardContent>
    </Card>
  );
};

/** Dòng tổng hợp activity (likes/comments count) */
function SummaryRow({
  icon: Icon,
  iconColor,
  label,
  value,
}: {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        {label}
      </div>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

export default ActivitySummary;
