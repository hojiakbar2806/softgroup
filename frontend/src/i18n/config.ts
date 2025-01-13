export const getConfig = async (locale: string) => {
  if (!locale || !["uz", "en", "ru"].includes(locale)) {
    locale = "uz";
  }
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
};