import { Camera, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToAnalyzer = () => {
    document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="eco-gradient text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Turn Waste into Wisdom with AI</h2>
            <p className="text-xl mb-8 text-green-100">
              Upload any item photo and get intelligent eco-friendly alternatives, CO2 impact insights, and earn rewards for sustainable choices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={scrollToAnalyzer}
                className="bg-white text-eco-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <Camera className="mr-2" size={20} />
                Start Analyzing
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-eco-primary transition-colors"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Smartphone with eco-friendly app interface" 
              className="rounded-2xl shadow-2xl w-full h-auto"
            />
            <div className="absolute -top-4 -right-4 bg-white text-eco-primary px-4 py-2 rounded-full shadow-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="font-semibold">AI Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
