import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, CheckCircle, AlertTriangle, Leaf, Recycle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useImageUpload } from "../hooks/use-image-upload";

export default function AIAnalyzer() {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { uploadImage, isUploading, previewUrl } = useImageUpload();

  const analyzeMutation = useMutation({
    mutationFn: async (imageData: string) => {
      const response = await apiRequest("POST", "/api/analyze", { image: imageData });
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Analysis Complete!",
        description: `Identified: ${data.analysis.analysis.itemName}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const selectAlternativeMutation = useMutation({
    mutationFn: async ({ itemId, alternativeName, pointsToEarn }: { itemId: string; alternativeName: string; pointsToEarn: number }) => {
      const response = await apiRequest("POST", "/api/select-alternative", { itemId, alternativeName, pointsToEarn });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/actions"] });
      toast({
        title: "Great Choice!",
        description: `Earned ${data.pointsEarned} EcoPoints!`,
      });
    },
  });

  const handleImageUpload = async (file: File) => {
    try {
      const imageData = await uploadImage(file);
      await analyzeMutation.mutateAsync(imageData);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Please try again with a different image",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleSelectAlternative = (alternative: any) => {
    if (analysisResult?.item) {
      selectAlternativeMutation.mutate({
        itemId: analysisResult.item.id,
        alternativeName: alternative.name,
        pointsToEarn: alternative.pointsValue,
      });
    }
  };

  return (
    <section id="analyzer" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered Item Analyzer</h3>
          <p className="text-xl text-gray-600">Upload a photo of any item and discover eco-friendly alternatives instantly</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-2xl p-8 mb-8">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-eco-primary transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
                disabled={isUploading || analyzeMutation.isPending}
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {previewUrl ? (
                  <div className="mb-4">
                    <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg mx-auto" />
                  </div>
                ) : (
                  <Upload className="text-4xl text-gray-400 mb-4 mx-auto" size={64} />
                )}
                <h4 className="text-xl font-semibold text-gray-700 mb-2">Upload Item Photo</h4>
                <p className="text-gray-500 mb-4">
                  {isUploading || analyzeMutation.isPending ? "Analyzing..." : "Drag and drop an image or click to browse"}
                </p>
                <Button 
                  className="bg-eco-primary text-white px-6 py-2 rounded-lg hover:bg-eco-secondary transition-colors"
                  disabled={isUploading || analyzeMutation.isPending}
                >
                  {isUploading || analyzeMutation.isPending ? "Processing..." : "Choose File"}
                </Button>
              </label>
            </div>
          </div>

          {analysisResult && (
            <>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                        <AlertTriangle className="text-red-500" size={24} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Identified Item</h4>
                        <p className="text-gray-600">{analysisResult.analysis.analysis.itemName}</p>
                      </div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="text-red-500 mr-2" size={16} />
                        <span className="font-semibold text-red-700">Environmental Impact</span>
                      </div>
                      <p className="text-red-600 text-sm">{analysisResult.analysis.analysis.environmentalImpact}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Eco-Friendly Alternatives</h4>
                    <div className="space-y-3">
                      {analysisResult.analysis.alternatives.map((alternative: any, index: number) => (
                        <div key={index} className="flex items-center p-3 bg-eco-light rounded-lg hover:bg-green-100 transition-colors">
                          <Leaf className="text-eco-primary mr-3" size={20} />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{alternative.name}</p>
                            <p className="text-sm text-gray-600">{alternative.description}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-eco-primary font-semibold">+{alternative.pointsValue} Points</span>
                            <Button
                              size="sm"
                              onClick={() => handleSelectAlternative(alternative)}
                              className="ml-2 bg-eco-primary hover:bg-eco-secondary"
                              disabled={selectAlternativeMutation.isPending}
                            >
                              Select
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="eco-gradient text-white">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div>
                      <Leaf className="text-3xl mb-2 mx-auto" size={48} />
                      <h5 className="font-semibold mb-1">CO2 Saved Annually</h5>
                      <p className="text-2xl font-bold">{analysisResult.analysis.totalCO2Savings} kg</p>
                    </div>
                    <div>
                      <Recycle className="text-3xl mb-2 mx-auto" size={48} />
                      <h5 className="font-semibold mb-1">Trees Equivalent</h5>
                      <p className="text-2xl font-bold">{(analysisResult.analysis.totalCO2Savings / 20).toFixed(1)}</p>
                    </div>
                    <div>
                      <CheckCircle className="text-3xl mb-2 mx-auto" size={48} />
                      <h5 className="font-semibold mb-1">EcoPoints Available</h5>
                      <p className="text-2xl font-bold">+{analysisResult.analysis.recommendedPoints}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
