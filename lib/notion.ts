import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

export type Page = {
  id: string;
  title: string;
  content: string;
};

export async function getAllPageIds(auth: string): Promise<string[]> {
  const notion = new Client({ auth });
  const pageIds = [];
  let cursor = undefined;
  do {
    const response = await notion.search({
      query: "",
      start_cursor: cursor,
      filter: {
        property: "object",
        value: "page",
      },
    });

    const pages = response.results.filter((result) => result.object === "page");

    for (const page of pages) {
      pageIds.push(page.id);
    }

    cursor = response.next_cursor;
  } while (cursor !== null);

  return pageIds;
}

export async function getAllPageIds2(auth: string) {
  return await notion.search({});
}

export async function getPagesWithWorkspaceParent(auth: string) {
  const notion = new Client({ auth });
  const response = await notion.search({
    workspace: true,
  });
  return response.results;
}

export async function getWorkspacePageIds(auth: string) {
  const notion = new Client({ auth });

  const { results } = await notion.search({});
  const workspacePages = results.filter(
    (result) =>
      result.object === "page" &&
      result.parent.type === "workspace" &&
      result.parent.workspace === true
  );

  const pageIds = workspacePages.map((page) => page.id);
  return pageIds;
}

export async function getAllPageIds3(auth) {
  const notion = new Client({ auth });

  const databaseResults = await notion.search({
    query: "",
    filter: {
      property: "object",
      value: "database",
    },
  });

  const databases = databaseResults.results;
  const pageIds = [];

  for (const database of databases) {
    const databaseId = database.id;
    const databasePages = await notion.databases.query({
      database_id: databaseId,
    });
    const pages = databasePages.results;
    for (const page of pages) {
      pageIds.push(page.id);
    }
  }

  return pageIds;
}

export async function getPageContent(
  auth: string,
  pageIds: string[]
): Promise<Page[]> {
  const notion = new Client({ auth });
  const n2m = new NotionToMarkdown({ notionClient: notion });
  const pages: Page[] = [];

  for (const pageId of pageIds) {
    const mdblocks = await n2m.pageToMarkdown(pageId);
    const pageContentText = n2m.toMarkdownString(mdblocks);

    const page = await notion.pages.retrieve({ page_id: pageId });
    const pageTitle = page.properties.title.title[0].plain_text;

    pages.push({
      id: pageId,
      title: pageTitle,
      content: pageContentText,
    });
  }

  return pages;
}

export async function getPages(auth: string): Promise<Page[]> {
  const pageIds = await getWorkspacePageIds(auth);
  const pages = await getPageContent(auth, pageIds);
  return pages;
}
