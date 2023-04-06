import Head from "next/head";
import { FC } from "react";

const TwitterPreviewCard: FC<{
  displayName: string;
  bio?: string;
  handle?: string;
}> = ({ handle, displayName, bio }) => {
  return (
    <Head>
      <meta name="twitter:card" content="summary" />
      {handle && <meta name="twitter:site" content={handle} />}
      <meta name="twitter:title" content={`${displayName} on blessings.app`} />
      <meta name="twitter:description" content={bio || "View profile"} />
      <meta name="twitter:image" content={`/api/twitterCards/${displayName}`} />
    </Head>
  );
};


export default TwitterPreviewCard