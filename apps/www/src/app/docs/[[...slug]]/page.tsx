import { docs } from "@/lib/source";
import {
  DocsPage,
  DocsDescription,
  DocsTitle,
  DocsBody,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { TypeTable } from "fumadocs-ui/components/type-table";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import Demo from "@/components/demo";
import styles from "./page.module.css";
import Tag from "@/components/tag";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = docs.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{
        single: false,
      }}>
      <DocsTitle>
        <div className={styles.title}>
          {page.data.title}
          <Tag value={page.data.tag} size="regular" />
        </div>
      </DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={{
            ...defaultMdxComponents,
            TypeTable,
            Tab,
            Tabs,
            Demo,
          }}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return docs.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = docs.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
