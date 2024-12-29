"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlusCircle, X } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useMutation } from "@tanstack/react-query";
import { AddTemplateService } from "@/services/template.service";
import Form from "next/form";
import { Feature } from "@/types/template";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

const AddTemplatePage: React.FC = () => {
  const { refreshToken } = useAuthStore();

  useEffect(() => {
    refreshToken();
  }, []);

  const [features, setFeatures] = useState<Feature[]>([
    {
      text: "",
      available: true,
    },
  ]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => AddTemplateService(data),
  });
  const router = useRouter();

  const handleSubmit = (formData: FormData): void => {
    const allKeys = Array.from(formData.keys());
    const emptyKeys = allKeys.filter(
      (key) => !formData.get(key) || formData.get(key)?.toString().trim() === ""
    );
    if (emptyKeys.length > 0) {
      toast.warning("Please fill in all the required fields.");
      return;
    }
    formData.append("features", JSON.stringify(features));
    mutation.mutate(formData);
  };

  const updateFeature = (index: number, text: string): void => {
    const newFeatures = features.map((feature, i) =>
      i === index ? { ...feature, text } : feature
    );
    setFeatures(newFeatures);
  };

  return (
    <section className="flex-1 py-8">
      <motion.div
        className=""
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Add New Template</h1>
          <Button onClick={() => router.push("/profile/templates")}>
            Back
          </Button>
        </CardHeader>
        <Form action={handleSubmit}>
          <Card className="shadow-md">
            <CardContent className="space-y-4 p-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input name="title" id="title" placeholder="Title" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="current_price">Current Price</Label>
                    <Input
                      name="current_price"
                      type="number"
                      placeholder="Current Price"
                    />
                  </div>
                  <div>
                    <Label htmlFor="original_price">Original Price</Label>
                    <Input
                      name="original_price"
                      type="number"
                      placeholder="Original Price"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    name="description"
                    className="resize-y min-h-24"
                    placeholder="Description"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <Label>Features</Label>
                  <Button
                    type="button"
                    variant="outline"
                    className="text-sm"
                    onClick={() =>
                      setFeatures([...features, { text: "", available: true }])
                    }
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Feature
                  </Button>
                </div>

                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                      placeholder="Feature"
                      onChange={(e) => updateFeature(index, e.target.value)}
                    />
                    <Switch
                      className="data-[state=checked]:bg-purple-600"
                      checked={feature.available}
                      onCheckedChange={(checked) => {
                        const newFeatures = features.map((f, i) =>
                          i === index ? { ...f, available: checked } : f
                        );
                        setFeatures(newFeatures);
                      }}
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-red-500"
                        onClick={() => {
                          const newFeatures = features.filter(
                            (_, i) => i !== index
                          );
                          setFeatures(newFeatures);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Template File</Label>
                  <Input type="file" name="template_file" accept=".zip" />
                </div>

                <div>
                  <Label>Images</Label>
                  <Input type="file" name="images" multiple accept="image/*" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Saving..." : "Save Template"}
            </Button>
          </div>
        </Form>
      </motion.div>
    </section>
  );
};

export default AddTemplatePage;
