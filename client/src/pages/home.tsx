import { Navigation, HeroSection, AIAnalyzer, Dashboard, NewsFeed, Footer } from "@/components";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeroSection />
      <AIAnalyzer />
      <Dashboard />
      <NewsFeed />
      
      {/* Feature Highlights */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Why Choose Eco Guardian?</h3>
            <p className="text-xl text-gray-300">Powered by advanced AI and designed for maximum environmental impact</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-eco-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-brain text-white text-2xl"></i>
              </div>
              <h4 className="text-xl font-semibold mb-2">AI-Powered Analysis</h4>
              <p className="text-gray-300">Advanced computer vision identifies any item and suggests optimal eco-alternatives</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-eco-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-chart-line text-white text-2xl"></i>
              </div>
              <h4 className="text-xl font-semibold mb-2">Impact Tracking</h4>
              <p className="text-gray-300">Real-time CO2 savings calculation and environmental impact measurement</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-eco-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-gamepad text-white text-2xl"></i>
              </div>
              <h4 className="text-xl font-semibold mb-2">Gamified Experience</h4>
              <p className="text-gray-300">Earn EcoPoints, unlock achievements, and compete with eco-conscious community</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-eco-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-users text-white text-2xl"></i>
              </div>
              <h4 className="text-xl font-semibold mb-2">Community Driven</h4>
              <p className="text-gray-300">Connect with local recycling centers and join environmental events near you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 eco-gradient text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold mb-6">Start Your Sustainable Journey Today</h3>
          <p className="text-xl mb-8 text-green-100">Join thousands of eco-warriors making a real difference with AI-powered sustainability insights</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-white text-eco-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
              onClick={() => document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <i className="fas fa-rocket mr-2"></i>
              Get Started Free
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-eco-primary transition-colors">
              <i className="fas fa-mobile-alt mr-2"></i>
              Download App
            </button>
          </div>
          <div className="mt-8 flex items-center justify-center space-x-8 text-green-100">
            <div className="flex items-center">
              <i className="fas fa-check-circle mr-2"></i>
              <span>Free to use</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-check-circle mr-2"></i>
              <span>No ads</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-check-circle mr-2"></i>
              <span>Privacy focused</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
