import RegisterPageClient from "@/components/auth/registerPageClient";
import { getDictionary } from "@/features/localization/getDictionary";

export default async function RegisterPage() {
  const dictionary = await getDictionary();
  return <RegisterPageClient dictionary={dictionary} />;
}
