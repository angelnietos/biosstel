import { useTranslations } from "next-intl";
import * as Yup from "yup";

export const useLoginSchema = () => {
  const t = useTranslations();

  return Yup.object().shape({
    username: Yup.string()
      .required(t("form.isRequired"))
      .min(6, t("form.minSixCharacters")),
    password: Yup.string()
      .required(t("form.isRequired"))
      .min(6, t("form.minSixCharacters")),
  });
};
