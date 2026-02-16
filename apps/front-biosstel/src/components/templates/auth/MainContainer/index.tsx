"use client";

import { Formik } from "formik";
import { useTranslations } from "next-intl";
import { Input } from "@/components/atoms/Input";
import { InputPassword } from "@/components/molecules/InputPassword";
import { ErrorFormMsg } from "@/components/atoms/ErrorFormMsg";
import { Link } from "@/i18n/routing";
import PATHS from "@/constants/paths";
import { useLoginSchema } from "@/hooks/formValidations/useLoginSchema";

const inputStyles =
  "h-[43px] w-full rounded-lg border border-border-input bg-transparent px-3 text-body";

export const MainContainer = () => {
  const t = useTranslations();
  const validationSchema = useLoginSchema();

  return (
    <div className="w-full max-w-80 px-4 md:max-w-86 md:px-0">
      <h1 className="mb-8 text-h1 font-semibold text-black md:text-datos">
        {t("loginPage.title")}
      </h1>

      <Formik
        validateOnChange={false}
        initialValues={{ username: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ setFieldValue, values, errors, handleSubmit }) => (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Input
                name="username"
                type="text"
                placeholder={t("loginPage.firstInput")}
                value={values.username}
                onChange={(e) => setFieldValue("username", e.target.value)}
                cssProps={inputStyles}
                errorInput={Boolean(errors.username)}
              />
              <ErrorFormMsg errorMsg={errors.username} />
            </div>
            <div className="flex flex-col gap-1">
              <InputPassword
                name="password"
                placeholder={t("loginPage.secondInput")}
                value={values.password}
                onChange={(e) => setFieldValue("password", e.target.value)}
                cssProps={inputStyles}
                containerCssProps="w-full"
                errorInput={Boolean(errors.password)}
              />
              <ErrorFormMsg errorMsg={errors.password} />
              <Link
                href={PATHS.FORGOT_PASSWORD}
                className="self-end text-mid font-semibold text-gray-800 underline"
              >
                {t("form.forgotPassword")}
              </Link>
            </div>
            <button
              type="submit"
              className="mt-4 h-[43px] w-full rounded-lg bg-button-primary text-body text-white"
            >
              {t("loginPage.BtnSend")}
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
};
