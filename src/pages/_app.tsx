import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { getToken, isValidJwt } from "../services/auth";
import Layout from "../components/layout/Layout";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const isAuthPage = useMemo(() => {
    return router.pathname === "/login" || router.pathname === "/cadastro";
  }, [router.pathname]);

  useEffect(() => {
    const token = getToken();
    if (!token || !isValidJwt(token)) {
      if (!isAuthPage) router.replace("/login");
    } else if (isAuthPage) {
      router.replace("/");
    }
  }, [router.pathname, isAuthPage]);

  const content = <Component {...pageProps} />;

  if (isAuthPage) return content;

  return <Layout>{content}</Layout>;
}
