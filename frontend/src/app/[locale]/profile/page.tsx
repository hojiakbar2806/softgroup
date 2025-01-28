import ProfileClient from "@/components/profile/profileClient";
import { getDictionary } from "@/features/localization/getDictionary";

export default async function Profile() {
  const dictionary = await getDictionary();

  return <ProfileClient dictionary={dictionary} />;
}
