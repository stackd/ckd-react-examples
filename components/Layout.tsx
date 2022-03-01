import React from "react";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <footer>
        <a href="https://ckd.dev" target="_blank" rel="noopener noreferrer">
          <Image
            src="/ckd_logo.svg"
            height="58"
            width="88.7291311755"
            alt="Ckd Logo"
          />
        </a>
        <a
          href="https://github.com/stackd/ckd-react-examples"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/github_icon.svg"
            height="58"
            width="59.392"
            alt="GitHub icon"
          />
        </a>
      </footer>
    </>
  );
}
