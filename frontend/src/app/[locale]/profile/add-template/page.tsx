"use client";

import React, { useState } from "react";
import { X, Plus, PlusIcon } from "lucide-react";
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
import TitleCard from "@/components/profile/titleCard";
import { MyProfileService } from "@/services/user.service";
import { IUser } from "@/types/user";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

const AddTemplatePage: React.FC = () => {
  const [features, setFeatures] = useState([{ text: "", available: true }]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");

  const t = useTranslations("ProfilePage.AddTemplate");

  const router = useRouter();

  const { data: categories } = useQuery<ICategory[]>({
    queryKey: ["category"],
    queryFn: GetCategoriesService,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const { data: myData } = useQuery<IUser>({
    queryKey: ["user"],
    queryFn: MyProfileService,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const templateMutation = useMutation({
    mutationKey: ["template"],
    mutationFn: (data: FormData) => CreateTemplateService(data),
    onSuccess: () => {
      router.push("/");
    },
  });

  const categoryMutation = useMutation({
    mutationKey: ["category"],
    mutationFn: async (data: FormData) => {
      const result = await CreateCategoryService(data);
      setSelectedCategory(result.slug);
      setIsNewCategoryDialogOpen(false);
      return result;
    },
  });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    const formData = new FormData();
    const formElements = e.target as HTMLFormElement;

    const title = (
      formElements.elements.namedItem("title") as HTMLInputElement
    )?.value.trim();
    if (title) formData.append("title", title);

    const currentPrice =
      (
        formElements.elements.namedItem("current_price") as HTMLInputElement
      )?.value.trim() || "0";
    formData.append("current_price", currentPrice);

    const originalPrice =
      (
        formElements.elements.namedItem("original_price") as HTMLInputElement
      )?.value.trim() || "0";
    formData.append("original_price", originalPrice);

    const description = (
      formElements.elements.namedItem("description") as HTMLTextAreaElement
    )?.value.trim();
    if (description) formData.append("description", description);

    const templateFile = (
      formElements.elements.namedItem("template_file") as HTMLInputElement
    )?.files?.[0];
    if (templateFile) formData.append("template_file", templateFile);

    const images = (
      formElements.elements.namedItem("images") as HTMLInputElement
    )?.files;
    if (images) {
      Array.from(images).forEach((image) => formData.append("images", image));
    }

    if (!selectedCategory) {
      toast.warning("Please select a category.");
      return;
    }
    formData.append("category_slug", selectedCategory);

    formData.append("features", JSON.stringify(features));

    const emptyFields = Array.from(formData.keys()).filter(
      (key) => !formData.get(key)
    );
    if (emptyFields.length > 0) {
      toast.warning("Please fill in all the required fields.");
      return;
    }

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
        <TitleCard title={t("title")} href="/profile" linkName={t("button")} />
        <form onSubmit={handleSubmit}>
          <Card className="shadow-md">
            <CardContent className="space-y-6 p-6">
              <div className="w-full gap-4">
                <Label htmlFor="title">{t("form.title")}</Label>
                <Input name="title" id="title" placeholder={t("form.title")} />
              </div>

              {myData?.username === "premium" && (
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
              )}

              <div className="w-full gap-4">
                <Label htmlFor="description">{t("form.description")}</Label>
                <Textarea
                  name="description"
                  className="resize-y min-h-24"
                  placeholder={t("form.description")}
                />
              </div>

              <div className="flex gap-4 items-end">
                <div className="w-full">
                  <Label htmlFor="category">{t("form.category")}</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("form.category")} />
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
                  <Label>{t("form.feature")}</Label>
                  <Button
                    type="button"
                    variant="outline"
                    className="text-sm"
                    onClick={() =>
                      setFeatures([...features, { text: "", available: true }])
                    }
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1fr_auto] gap-2 items-center"
                    >
                      <Input
                        placeholder={t("form.feature")}
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
                  <Label>{t("form.file")}</Label>
                  <Input
                    name="template_file"
                    type="file"
                    accept=".doc,.docx,.pdf,.zip"
                    required
                  />
                </div>
                <div>
                  <Label>{t("form.image")}</Label>
                  <Input
                    name="images"
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.webp"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  className="w-full sm:w-auto"
                  type="submit"
                  disabled={templateMutation.isPending}
                >
                  {templateMutation.isPending
                    ? t("form.loading")
                    : t("form.submit")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </section>
  );
};

export default AddTemplatePage;
