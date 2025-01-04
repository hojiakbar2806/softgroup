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
import Form from "next/form";
import { ICategory } from "@/types/mixin";
import { useAuthStore } from "@/store/authStore";
import TitleCard from "@/components/profile/titleCard";

interface Feature {
  text_uz: string;
  text_ru: string;
  text_en: string;
  available: boolean;
}

const AddTemplatePage: React.FC = () => {
  const { refreshToken } = useAuthStore();
  useEffect(() => {
    refreshToken();
  }, []); // eslint-disable-line
  const [features, setFeatures] = useState<Feature[]>([
    { text_uz: "", text_ru: "", text_en: "", available: true },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
  const [newCategoryTitles, setNewCategoryTitles] = useState({
    uz: "",
    ru: "",
    en: "",
  });

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

    if (
      !newCategoryTitles.uz ||
      !newCategoryTitles.ru ||
      !newCategoryTitles.en
    ) {
      toast.warning("Please fill in all category titles.");
      return;
    }

    const formData = new FormData();
    formData.append("image", newCategoryImage);
    formData.append(
      "translations",
      JSON.stringify([
        { language: "uz", title: newCategoryTitles.uz },
        { language: "ru", title: newCategoryTitles.ru },
        { language: "en", title: newCategoryTitles.en },
      ])
    );

    categoryMutation.mutate(formData);
  };

  const updateFeature = (index: number, field: string, value: string): void => {
    const newFeatures = features.map((feature, i) =>
      i === index ? { ...feature, [field]: value } : feature
    );
    setFeatures(newFeatures);
  };

  return (
    <section className="flex-1">
      <div className="container max-w-4xl mx-auto">
        <TitleCard title="Add Template" href="/profile" linkName="Back" />

        <Form action={handleSubmit}>
          <Card className="shadow-md">
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="title_uz">Title (UZ)</Label>
                  <Input
                    name="title_uz"
                    id="title_uz"
                    placeholder="Title in Uzbek"
                  />
                </div>
                <div>
                  <Label htmlFor="title_ru">Title (RU)</Label>
                  <Input
                    name="title_ru"
                    id="title_ru"
                    placeholder="Title in Russian"
                  />
                </div>
                <div>
                  <Label htmlFor="title_en">Title (EN)</Label>
                  <Input
                    name="title_en"
                    id="title_en"
                    placeholder="Title in English"
                  />
                </div>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="description_uz">Description (UZ)</Label>
                  <Textarea
                    name="description_uz"
                    className="resize-y min-h-24"
                    placeholder="Description in Uzbek"
                  />
                </div>
                <div>
                  <Label htmlFor="description_ru">Description (RU)</Label>
                  <Textarea
                    name="description_ru"
                    className="resize-y min-h-24"
                    placeholder="Description in Russian"
                  />
                </div>
                <div>
                  <Label htmlFor="description_en">Description (EN)</Label>
                  <Textarea
                    name="description_en"
                    className="resize-y min-h-24"
                    placeholder="Description in English"
                  />
                </div>
              </div>

              <div className="flex flex-row gap-4 items-end">
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
                      <Plus className="" />
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
                        <Label>Title (UZ)</Label>
                        <Input
                          value={newCategoryTitles.uz}
                          onChange={(e) =>
                            setNewCategoryTitles((prev) => ({
                              ...prev,
                              uz: e.target.value,
                            }))
                          }
                          placeholder="Category title in Uzbek"
                        />
                      </div>
                      <div>
                        <Label>Title (RU)</Label>
                        <Input
                          value={newCategoryTitles.ru}
                          onChange={(e) =>
                            setNewCategoryTitles((prev) => ({
                              ...prev,
                              ru: e.target.value,
                            }))
                          }
                          placeholder="Category title in Russian"
                        />
                      </div>
                      <div>
                        <Label>Title (EN)</Label>
                        <Input
                          value={newCategoryTitles.en}
                          onChange={(e) =>
                            setNewCategoryTitles((prev) => ({
                              ...prev,
                              en: e.target.value,
                            }))
                          }
                          placeholder="Category title in English"
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
                      setFeatures([
                        ...features,
                        {
                          text_uz: "",
                          text_ru: "",
                          text_en: "",
                          available: true,
                        },
                      ])
                    }
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Feature
                  </Button>
                </div>

                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center"
                    >
                      <Input
                        placeholder="Feature (UZ)"
                        value={feature.text_uz}
                        onChange={(e) =>
                          updateFeature(index, "text_uz", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Feature (RU)"
                        value={feature.text_ru}
                        onChange={(e) =>
                          updateFeature(index, "text_ru", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Feature (EN)"
                        value={feature.text_en}
                        onChange={(e) =>
                          updateFeature(index, "text_en", e.target.value)
                        }
                      />
                      <div className="flex items-center gap-2">
                        <Switch
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
              disabled={templateMutation.isPending}
            >
              {templateMutation.isPending ? "Saving..." : "Save Template"}
            </Button>
          </div>
        </Form>
      </div>
    </section>
  );
};

export default AddTemplatePage;
