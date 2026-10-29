import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_LANG } from "@/i18n";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/$lang", params: { lang: DEFAULT_LANG } });
  },
});
