import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // Load messages from the nested structure
  const generalMessages = (await import(`../../messages/${locale}/general.json`)).default;

  return {
    locale,
    messages: generalMessages,
  };
});
