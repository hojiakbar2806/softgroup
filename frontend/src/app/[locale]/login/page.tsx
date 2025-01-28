import LoginPageClient from "@/components/auth/loginPageClient";
import { getDictionary } from "@/features/localization/getDictionary";

export default async function LoginPage() {
  const dictionary = await getDictionary();
  return <LoginPageClient dictionary={dictionary} />;
}
