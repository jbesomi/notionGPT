import { GetStaticProps, GetStaticPaths } from "next";
import { getPageContent, Page } from "../../lib/notion";

import { getToken } from "next-auth/jwt";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface Props {
  page: Page;
}

export default function PageContent({ page }: Props) {
  return (
    <div>
      <h1>{page.title}</h1>
      <ReactMarkdown>{page.content}</ReactMarkdown>
      <p>
        <Link href="/" className="">
          Go back
        </Link>
      </p>
    </div>
  );
}

export const getServerSideProps: GetStaticProps = async ({ req, params }) => {
  const pageId = params.id as string;

  const token = await getToken({
    req,
    encryption: true,
  });

  const pageContent = await getPageContent(token.accessToken, [pageId]);
  const page = pageContent[0];

  return { props: { page: page } };
};
