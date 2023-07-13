import { Client } from "@notionhq/client";

export async function fetchData() {
    const notion = new Client({ auth: process.env.NEXT_PUBLIC_NOTION_API_KEY });

    const databaseId = process.env.NEXT_PUBLIC_NOTION_DATABASE_ID;
    const response = await notion.databases.query({
        database_id: databaseId
    });

    const content = await Promise.all(
        response.results.map(async (table) => {
            const children = await notion.blocks.children.list({
                block_id: table.id,
                page_size: 50
            });
            return children;
        })
    );

    return {
        tables: response.results,
        data: content
    };
}
