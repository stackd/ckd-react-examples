import "../styles/globals.css";
import "../styles/prism-one-dark.css";
import type { AppProps } from "next/app";
import { CkdProvider } from "ckd-react";
import Layout from "../components/Layout";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CkdProvider>
      <Head>
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CkdProvider>
  );
}

export default MyApp;
