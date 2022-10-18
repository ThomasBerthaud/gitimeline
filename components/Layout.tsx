import React, { ReactNode } from 'react';
import Head from 'next/head';
import { Header } from './Header';
import { Footer } from './Footer';

type LayoutProps = {
  children: ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col items-center">
      <Head>
        <title>Gitimeline</title>
        <meta name="description" content="Shows a timeline of git commits on a repository" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container h-screen flex flex-col p-6">{children}</main>
      <Footer />
    </div>
  );
};
