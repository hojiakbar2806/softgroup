import PreviewPageClient from "@/components/preview/previewPageClient";
import { getDictionary } from "@/features/localization/getDictionary";

export default async function PreviewPage() {
  const dictionary = await getDictionary();
  return <PreviewPageClient dictionary={dictionary} />;
}
