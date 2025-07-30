import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { NewsArticle } from "@shared/schema";

export default function NewsFeed() {
  const { data: news = [] } = useQuery<NewsArticle[]>({
    queryKey: ["/api/news"],
  });

  const upcomingEvents = [
    { name: "Earth Day Community Cleanup", date: "Apr 22" },
    { name: "Sustainable Living Workshop", date: "Apr 28" },
    { name: "Green Tech Expo 2024", date: "May 15" },
  ];

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const published = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  return (
    <section id="news" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Environmental News & Events</h3>
          <p className="text-xl text-gray-600">Stay updated with the latest in sustainability and green innovations</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {news.length > 0 && (
              <Card className="mb-6 overflow-hidden">
                <img 
                  src={news[0].imageUrl} 
                  alt={news[0].title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="bg-eco-light text-eco-secondary px-3 py-1 rounded-full text-sm font-medium">
                      {news[0].category}
                    </span>
                    <span className="text-gray-500 text-sm ml-3">
                      {formatTimeAgo(news[0].publishedAt)}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{news[0].title}</h4>
                  <p className="text-gray-600 mb-4">{news[0].summary}</p>
                  <button className="inline-flex items-center text-eco-primary font-semibold hover:text-eco-secondary transition-colors">
                    Read Full Article <ExternalLink className="ml-2" size={16} />
                  </button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {news.slice(1).map((article) => (
              <Card key={article.id}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title}
                      className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 mb-2">{article.title}</h5>
                      <p className="text-sm text-gray-600 mb-2">{article.summary}</p>
                      <span className="text-xs text-gray-500">{formatTimeAgo(article.publishedAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="bg-eco-light border-eco-primary/20">
              <CardContent className="p-4">
                <h5 className="font-semibold text-eco-secondary mb-3">Upcoming Environmental Events</h5>
                <div className="space-y-2">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <Calendar className="text-eco-primary mr-2" size={16} />
                      <span className="text-gray-700">{event.name} - {event.date}</span>
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
