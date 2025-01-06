"use client";

import React, { useEffect, useState } from "react";
import { PlusCircle, X, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CreateTemplateService,
  GetCategoriesService,
  CreateCategoryService,
} from "@/services/template.service";
import { toast } from "sonner";
import { ICategory } from "@/types/mixin";
import { useAuthStore } from "@/store/authStore";
import TitleCard from "@/components/profile/titleCard";
import Form from "next/form";

const AddTemplatePage: React.FC = () => {
  const { refreshToken } = useAuthStore();
  useEffect(() => {
    refreshToken();
  }, []);

  const [features, setFeatures] = useState([{ text: "", available: true }]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");

  const { data: categories } = useQuery<ICategory[]>({
    queryKey: ["categories"],
    queryFn: GetCategoriesService,
  });

  const templateMutation = useMutation({
    mutationFn: (data: FormData) => CreateTemplateService(data),
  });

  const categoryMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const result = await CreateCategoryService(data);
      setSelectedCategory(result.slug);
      setIsNewCategoryDialogOpen(false);
      return result;
    },
  });

  const handleSubmit = (formData: FormData): void => {
    const allKeys = Array.from(formData.keys());
    const emptyKeys = allKeys.filter(
      (key) => !formData.get(key) || formData.get(key)?.toString().trim() === ""
    );

    if (emptyKeys.length > 0) {
      toast.warning("Please fill in all the required fields.");
      return;
    }

    if (!selectedCategory) {
      toast.warning("Please select a category.");
      return;
    }

    formData.append("features", JSON.stringify(features));
    formData.append("category_slug", selectedCategory);
    templateMutation.mutate(formData);
  };

  const handleCreateCategory = () => {
    if (!newCategoryImage) {
      toast.warning("Please select a category image.");
      return;
    }

    if (!newCategoryTitle) {
      toast.warning("Please fill in the category title.");
      return;
    }

    const formData = new FormData();
    formData.append("image", newCategoryImage);
    formData.append("title", newCategoryTitle);
    categoryMutation.mutate(formData);
  };

  const updateFeature = (index: number, value: string): void => {
    setFeatures(
      features.map((feature, i) =>
        i === index ? { ...feature, text: value } : feature
      )
    );
  };

  return (
    <section className="flex-1">
      <div className="container max-w-4xl mx-auto">
        <TitleCard title="Add Template" href="/profile" linkName="Back" />
        <Form action={handleSubmit}>
          <Card className="shadow-md">
            <CardContent className="space-y-6 p-6">
              <div className="w-full gap-4">
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

              <div className="w-full gap-4">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  name="description"
                  className="resize-y min-h-24"
                  placeholder="Description"
                />
              </div>

              <div className="flex gap-4 items-end">
                <div className="w-full">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.slug} value={category.slug}>
                          {category.translations.find(
                            (t) => t.language === "en"
                          )?.title || category.slug}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Dialog
                  open={isNewCategoryDialogOpen}
                  onOpenChange={setIsNewCategoryDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" className="shrink-0">
                      <Plus />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Category Image</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setNewCategoryImage(e.target.files?.[0] || null)
                          }
                        />
                      </div>
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={newCategoryTitle}
                          onChange={(e) => setNewCategoryTitle(e.target.value)}
                          placeholder="Category title"
                        />
                      </div>
                      <Button
                        className="w-full"
                        onClick={handleCreateCategory}
                        disabled={categoryMutation.isPending}
                      >
                        {categoryMutation.isPending
                          ? "Creating..."
                          : "Create Category"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
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
                    <PlusCircle className="w-4 h-4 mr-2" /> Add Feature
                  </Button>
                </div>

                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1fr_auto] gap-2 items-center"
                    >
                      <Input
                        placeholder="Feature"
                        value={feature.text}
                        onChange={(e) => updateFeature(index, e.target.value)}
                      />
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={feature.available}
                          onCheckedChange={(checked) => {
                            setFeatures(
                              features.map((f, i) =>
                                i === index ? { ...f, available: checked } : f
                              )
                            );
                          }}
                        />
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            className="text-red-500"
                            onClick={() =>
                              setFeatures(
                                features.filter((_, i) => i !== index)
                              )
                            }
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Template File</Label>
                  <Input type="file" name="template_file" accept=".zip" />
                </div>
                <div>
                  <Label>Image Preview</Label>
                  <Input type="file" name="images" accept="image/*" multiple />
                </div>
              </div>
            </CardContent>
          </Card>
          <Button
            className="w-full mt-8"
            disabled={templateMutation.isPending}
            type="submit"
          >
            {templateMutation.isPending ? "Submitting..." : "Submit"}
          </Button>
        </Form>
      </div>
    </section>
  );
};

export default AddTemplatePage;
