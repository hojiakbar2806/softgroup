"use client";

import React, { useState } from "react";
import { X, PlusIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import TitleCard from "@/components/profile/titleCard";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useGetMeQuery } from "@/services/userService";
import { useGetCategoriesQuery } from "@/services/categoryService";
import { useCreateTemplateMutation } from "@/services/templateService";

const AddTemplatePage: React.FC = () => {
  const [features, setFeatures] = useState([{ text: "", available: true }]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const t = useTranslations("ProfilePage.AddTemplate");
  const router = useRouter();

  const { data: user } = useGetMeQuery();
  const { data: categories } = useGetCategoriesQuery();
  const [create, { isLoading, isError, error }] = useCreateTemplateMutation();

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

    create(formData)
      .unwrap()
      .then(() => {
        toast.success(t("success"));
        router.push("/profile");
      });
  };

  const updateFeature = (index: number, value: string): void => {
    setFeatures(
      features.map((feature, i) =>
        i === index ? { ...feature, text: value } : feature
      )
    );
  };

  if (isError) {
    if ((error as any).status === 422) {
      toast.error("All fields are required");
    } else {
      toast.error((error as any)?.data?.detail);
    }
  }

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

              {user?.username === "premium" && (
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
                  defaultValue={
                    "Mazkur bo‘limga o‘rnatiladigan matn, loyihani to‘liq ko‘rib chiqish uchun mo‘ljallangan. Bu yerda foydalanuvchi diqqatini jalb qiluvchi asosiy axborot yoki xabar keltiriladi. Sizning web-loyihangizni tasvirlash uchun shunchaki bu matnni ishlating. Keyinroq bu bo‘lim o‘ziga xos ma'lumot bilan almashtiriladi."
                  }
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
                  disabled={isLoading}
                >
                  {isLoading ? t("form.loading") : t("form.submit")}
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
