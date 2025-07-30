import { useQuery } from "@tanstack/react-query";
import { Trophy, CheckCircle, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RewardsCard } from "@/components";
import type { User, UserAction, RecyclingCenter } from "@shared/schema";

export default function Dashboard() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const { data: actions = [] } = useQuery<UserAction[]>({
    queryKey: ["/api/actions"],
  });

  const { data: recyclingCenters = [] } = useQuery<RecyclingCenter[]>({
    queryKey: ["/api/recycling-centers"],
  });

  const monthlyGoal = 20;
  const itemsReplaced = actions.filter(action => action.actionType === 'eco_switch').length;
  const progressPercentage = Math.min((itemsReplaced / monthlyGoal) * 100, 100);

  return (
    <section id="dashboard" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Your Eco Impact Dashboard</h3>
          <p className="text-xl text-gray-600">Track your sustainable journey and environmental contribution</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-6">Monthly Progress</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
                        <circle cx="64" cy="64" r="56" stroke="#E5E7EB" strokeWidth="8" fill="none"/>
                        <circle 
                          cx="64" 
                          cy="64" 
                          r="56" 
                          stroke="var(--eco-primary)" 
                          strokeWidth="8" 
                          fill="none" 
                          strokeDasharray="351.86" 
                          strokeDashoffset={351.86 - (351.86 * progressPercentage) / 100}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-eco-primary">{Math.round(progressPercentage)}%</p>
                          <p className="text-sm text-gray-600">Goal</p>
                        </div>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900">Items Replaced</p>
                    <p className="text-sm text-gray-600">{itemsReplaced} of {monthlyGoal} target</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Plastic Reduction</span>
                      <span className="font-semibold text-eco-primary">89%</span>
                    </div>
                    <Progress value={89} className="w-full" />
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">CO2 Savings</span>
                      <span className="font-semibold text-eco-primary">67%</span>
                    </div>
                    <Progress value={67} className="w-full" />
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Reusable Adoption</span>
                      <span className="font-semibold text-eco-primary">92%</span>
                    </div>
                    <Progress value={92} className="w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-6">Recent Eco Actions</h4>
                <div className="space-y-4">
                  {actions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No actions yet. Start by analyzing your first item!</p>
                    </div>
                  ) : (
                    actions.slice(0, 5).map((action) => (
                      <div key={action.id} className="flex items-center p-4 bg-eco-light rounded-lg">
                        <div className="w-10 h-10 bg-eco-primary rounded-full flex items-center justify-center mr-4">
                          {action.actionType === 'eco_switch' ? (
                            <CheckCircle className="text-white" size={20} />
                          ) : (
                            <Trophy className="text-white" size={20} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{action.description}</p>
                          <p className="text-sm text-gray-600">
                            {action.createdAt ? new Date(action.createdAt).toLocaleString() : 'Unknown date'} • +{action.pointsEarned || 0} EcoPoints
                          </p>
                        </div>
                        <CheckCircle className="text-eco-primary" size={20} />
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <RewardsCard user={user} />

            <Card>
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Nearby Recycling Centers</h4>
                <div className="space-y-3">
                  {recyclingCenters.map((center) => (
                    <div key={center.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-eco-primary transition-colors cursor-pointer">
                      <MapPin className="text-eco-primary mr-3" size={20} />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{center.name}</p>
                        <p className="text-sm text-gray-600">{center.distance} away</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {center.type}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
