"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useMutation } from "@tanstack/react-query";
import { AddTemplateService } from "@/services/template.service";
import Form from "next/form";
import { Feature, TemplatePayload } from "@/types/template";

const AddTemplatePage: React.FC = () => {
  const [formData, setFormData] = useState<TemplatePayload>({
    title: "",
    current_price: 0,
    original_price: 0,
    description: "",
    features: [{ text: "", available: true }],
    images: [],
    template_file: null,
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => AddTemplateService(data),
  });

  const addFeature = (): void => {
    setFormData({
      ...formData,
      features: [...formData.features, { text: "", available: true }],
    });
  };

  const removeFeature = (index: number): void => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      features: newFeatures,
    });
  };

  const updateFeature = (
    index: number,
    field: keyof Feature,
    value: string | boolean
  ): void => {
    const newFeatures = formData.features.map((feature, i) => {
      if (i === index) {
        return { ...feature, [field]: value };
      }
      return feature;
    });
    setFormData({
      ...formData,
      features: newFeatures,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const newImages = [...formData.images, ...Array.from(e.target.files)];
      setFormData({
        ...formData,
        images: newImages,
      });
    }
  };

  const removeImage = (index: number): void => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: newImages,
    });
  };

  const handleTemplateFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files?.[0]) {
      setFormData({
        ...formData,
        template_file: e.target.files[0],
      });
    }
  };

  const AddTemplateAction = (formData: FormData): void => {
    const payload = new FormData();
    payload.append("title", formData.get("title") as string);
    payload.append("current_price", formData.get("current_price") as string);
    payload.append("original_price", formData.get("original_price") as string);
    payload.append("description", formData.get("description") as string);
    payload.append("template_file", formData.get("template_file") as File);

    formData.getAll("images").forEach((image) => {
      payload.append(`images`, image);
    });
    const feature_text = formData.getAll("feature_text");
    const feature_available = formData.getAll("feature_available");

    const result = feature_text.map((text, index) => ({
      text,
      available: feature_available[index] === "on",
    }));

    payload.append("features", JSON.stringify(result));

    console.log(payload);
    mutation.mutate(payload);
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto p-4 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Form action={AddTemplateAction} className="space-y-8">
        <Card className="border-2 shadow-lg">
          <CardHeader className="border-b bg-purple-50">
            <CardTitle className="text-2xl font-bold text-purple-900">
              Add New Template
            </CardTitle>
            <input type="text" name="ddd" />
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-lg font-medium">
                  Title
                </Label>
                <Input
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="h-12 text-lg"
                  placeholder="Enter template title"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="current_price"
                    className="text-lg font-medium"
                  >
                    Current Price
                  </Label>
                  <Input
                    name="current_price"
                    id="current_price"
                    type="number"
                    value={formData.current_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        current_price: Number(e.target.value),
                      })
                    }
                    className="h-12 text-lg"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="original_price"
                    className="text-lg font-medium"
                  >
                    Original Price
                  </Label>
                  <Input
                    name="original_price"
                    id="original_price"
                    type="number"
                    value={formData.original_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        original_price: Number(e.target.value),
                      })
                    }
                    className="h-12 text-lg"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-lg font-medium">
                  Description
                </Label>
                <Textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="min-h-[120px] text-lg"
                  placeholder="Describe your template..."
                />
              </div>
            </div>

            {/* Features Section */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-medium">Features</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={addFeature}
                  className="flex items-center gap-2 hover:bg-purple-100"
                >
                  <PlusCircle className="w-5 h-5" />
                  Add Feature
                </Button>
              </div>

              <AnimatePresence>
                {formData.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-[1fr,auto,auto] gap-4 items-center bg-white p-4 rounded-lg shadow-sm"
                  >
                    <Input
                      value={feature.text}
                      name="feature_text"
                      onChange={(e) =>
                        updateFeature(index, "text", e.target.value)
                      }
                      placeholder="Feature description"
                      className="h-12 text-lg"
                    />
                    <div className="flex items-center gap-2">
                      <Label className="cursor-pointer">Available</Label>
                      <Switch
                        name="feature_available"
                        className="data-[state=checked]:bg-purple-600"
                      />
                    </div>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFeature(index)}
                        className="hover:bg-red-50 hover:text-red-500"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Files Section */}
            <div className="space-y-6 bg-gray-50 p-4 rounded-lg">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="images" className="text-lg font-medium">
                    Images
                  </Label>
                  <Input
                    id="images"
                    type="file"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="h-12 cursor-pointer bg-white"
                  />
                  {formData.images.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      {formData.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative bg-white p-3 rounded-lg shadow-sm"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{image.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeImage(index)}
                              className="hover:bg-red-50 hover:text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="template_file"
                    className="text-lg font-medium"
                  >
                    Template File
                  </Label>
                  <Input
                    id="template_file"
                    type="file"
                    name="template_file"
                    onChange={handleTemplateFile}
                    className="h-12 cursor-pointer bg-white"
                  />
                  {formData.template_file && (
                    <div className="bg-white p-3 rounded-lg shadow-sm mt-4">
                      <span className="text-sm">
                        {formData.template_file.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" size="lg" className="px-8">
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            className="px-8 bg-purple-600 hover:bg-purple-700"
          >
            Save Template
          </Button>
        </div>
      </Form>
    </motion.div>
  );
};

export default AddTemplatePage;
