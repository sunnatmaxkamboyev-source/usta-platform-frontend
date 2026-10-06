import { useState } from "react";
import { useTranslation } from "react-i18next";
import { message } from "antd";

export default function Newsletter() {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      message.error(t("newsletter.invalidEmail"));
      return;
    }

    setLoading(true);

    try {
      const existingEmails = JSON.parse(
        localStorage.getItem("homepro_newsletters") || "[]"
      );

      if (existingEmails.includes(email)) {
        message.info(t("newsletter.alreadySubscribed"));
        setLoading(false);
        return;
      }

      const updatedEmails = [...existingEmails, email];

      localStorage.setItem(
        "homepro_newsletters",
        JSON.stringify(updatedEmails)
      );

      setEmail("");
      setSubscribed(true);

      message.success(t("newsletter.success"));

      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    } catch (error) {
      console.error("Newsletter error:", error);
      message.error(t("newsletter.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-navy rounded-3xl p-8 md:p-12 text-white">

          {!subscribed ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  {t("newsletter.title")}
                </h2>

                <p className="text-white/80 max-w-xl mx-auto">
                  {t("newsletter.description")}
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("newsletter.placeholder")}
                  className="flex-1 px-5 py-3 rounded-full bg-white text-gray-800 outline-none border-0"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="px-7 py-3 rounded-full bg-brand text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
                >
                  {loading
                    ? t("common.loading")
                    : t("newsletter.button")}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-green-500 flex items-center justify-center text-2xl">
                ✓
              </div>

              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                {t("newsletter.successTitle")}
              </h2>

              <p className="text-white/80 max-w-xl mx-auto">
                {t("newsletter.successDescription")}
              </p>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}