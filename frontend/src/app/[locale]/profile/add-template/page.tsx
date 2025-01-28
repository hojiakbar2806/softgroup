import AddTemplatePageClient from "@/components/profile/addTemplateClient";
import { getDictionary } from "@/features/localization/getDictionary";

export default async function AddTemplatePage() {
  const dictionary = await getDictionary();

  return <AddTemplatePageClient dictionary={dictionary} />;
}
