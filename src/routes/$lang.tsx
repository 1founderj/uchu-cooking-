import { createFileRoute, notFound } from "@tanstack/react-router";
import i18n, { isLang, SUPPORTED_LANGS } from "@/i18n";
import { Landing } from "@/components/landing/Landing";

export const Route = createFileRoute("/$lang")({
  beforeLoad: ({ params }) => {
    if (!isLang(params.lang)) throw notFound();
  },
  head: ({ params }) => {
    const t = i18n.getFixedT(params.lang, "seo");
    return {
      meta: [
        { title: t("title") },
        { name: "description", content: t("description") },
        { property: "og:title", content: t("ogTitle") },
        { property: "og:description", content: t("ogDescription") },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: params.lang },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: t("ogTitle") },
        { name: "twitter:description", content: t("ogDescription") },
      ],
      links: [
        { rel: "canonical", href: `/${params.lang}` },
        ...SUPPORTED_LANGS.map((l) => ({ rel: "alternate", hrefLang: l, href: `/${l}` })),
        { rel: "alternate", hrefLang: "x-default", href: "/es" },
      ],
    };
  },
  component: LangPage,
});

function LangPage() {
  const { lang } = Route.useParams();
  if (i18n.language !== lang) i18n.changeLanguage(lang);
  return <Landing />;
}
