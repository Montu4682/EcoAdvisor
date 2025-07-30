import { useQuery } from "@tanstack/react-query";
import { Leaf, Menu, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { User } from "@shared/schema";

export default function Navigation() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const navItems = [
    { href: "#dashboard", label: "Dashboard" },
    { href: "#analyzer", label: "AI Analyzer" },
    { href: "#rewards", label: "Rewards" },
    { href: "#news", label: "News" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-eco-primary rounded-full flex items-center justify-center">
              <Leaf className="text-white text-sm" size={16} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Eco Guardian</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-gray-600 hover:text-eco-primary transition-colors"
              >
                {item.label}
              </button>
            ))}
            
            {user && (
              <div className="flex items-center space-x-2 bg-eco-light px-3 py-2 rounded-full">
                <Coins className="text-eco-primary" size={16} />
                <span className="text-eco-secondary font-semibold">{user.ecoPoints.toLocaleString()}</span>
                <span className="text-eco-secondary text-sm">EcoPoints</span>
              </div>
            )}
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className="text-left text-gray-600 hover:text-eco-primary transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                {user && (
                  <div className="flex items-center space-x-2 bg-eco-light px-3 py-2 rounded-full">
                    <Coins className="text-eco-primary" size={16} />
                    <span className="text-eco-secondary font-semibold">{user.ecoPoints.toLocaleString()}</span>
                    <span className="text-eco-secondary text-sm">EcoPoints</span>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
