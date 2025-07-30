import { Trophy, Medal, Leaf, Recycle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RewardsCardProps {
  user?: {
    level: string;
    ecoPoints: number;
  };
}

export default function RewardsCard({ user }: RewardsCardProps) {
  const achievements = [
    {
      name: "Plastic Fighter",
      icon: Medal,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 border-yellow-200",
      completed: true,
    },
    {
      name: "Green Pioneer", 
      icon: Leaf,
      color: "text-green-500",
      bgColor: "bg-green-50 border-green-200",
      completed: true,
    },
    {
      name: "Recycle Master",
      icon: Recycle,
      color: "text-gray-400",
      bgColor: "bg-gray-50 border-gray-200",
      completed: false,
      remaining: "5 more actions",
    },
  ];

  const getPointsToNextLevel = (currentPoints: number, currentLevel: string) => {
    if (currentLevel === "Eco Starter") return 500 - currentPoints;
    if (currentLevel === "Eco Champion") return 1000 - currentPoints;
    if (currentLevel === "Eco Warrior") return 2000 - currentPoints;
    return 0;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">Rewards & Achievements</h4>
        <div className="text-center mb-6">
          <div className="w-20 h-20 eco-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="text-white text-2xl" size={32} />
          </div>
          <h5 className="font-bold text-gray-900 text-lg">{user?.level || "Eco Starter"}</h5>
          <p className="text-sm text-gray-600">
            {user && user.level !== "Eco Master" ? (
              <>
                Level 3 • {getPointsToNextLevel(user.ecoPoints, user.level)} points to next level
              </>
            ) : (
              "Maximum Level Achieved!"
            )}
          </p>
        </div>
        
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between p-3 border rounded-lg ${achievement.bgColor}`}
            >
              <div className="flex items-center">
                <achievement.icon className={`${achievement.color} mr-3`} size={20} />
                <span className={`font-medium ${achievement.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                  {achievement.name}
                </span>
              </div>
              {achievement.completed ? (
                <CheckCircle className={achievement.color} size={20} />
              ) : (
                <span className="text-xs text-gray-400">{achievement.remaining}</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
