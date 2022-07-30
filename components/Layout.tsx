import React, { ReactNode } from 'react';
import Head from 'next/head';

type LayoutProps = {
  children: ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Gitimeline</title>
        <meta name="description" content="Shows a timeline of git commits on a repository" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      Header
      <main>{children}</main>
      Footer
    </>
  );
};
