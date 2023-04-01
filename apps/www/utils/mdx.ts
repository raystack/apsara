import rehypePrism from "@mapbox/rehype-prism";
import { compareVersions } from "compare-versions";
import fs from "fs";
import glob from "glob";
import matter from "gray-matter";
import { bundleMDX } from "mdx-bundler";
import path from "path";
import readingTime from "reading-time";
import remarkParse from "remark-parse";
import remarkSlug from "remark-slug";
import { Frontmatter } from "~/types/frontmatter";

const ROOT_PATH = process.cwd();
export const CONTENT_PATH = path.join(ROOT_PATH, "content");
export const getFileContent = (filename: string) => fs.readFileSync(filename, "utf8");

const firstFourLines = (file: any, options: any) => {
    file.excerpt = file.content.substring(0, 120) + "...";
};
export const parseFileContent = (source: string) => matter(source.trim(), { excerpt: firstFourLines as any });

// the front matter and content of all mdx files based on `docsPaths`
export const getAllFrontmatter = (pathName: string) => {
    const PATH = path.join(CONTENT_PATH, pathName);
    const paths = glob.sync(`${PATH}/**/*.mdx`);

    return paths.map((filePath) => {
        const source = fs.readFileSync(path.join(filePath), "utf8");
        const { data, content } = matter(source);

        return {
            ...(data as Frontmatter),
            slug: filePath.replace(`${CONTENT_PATH}/`, "").replace(".mdx", ""),
            readingTime: readingTime(content),
        } as Frontmatter;
    });
};

const getCompiledMDX = async (content: string) => {
    if (process.platform === "win32") {
        process.env.ESBUILD_BINARY_PATH = path.join(ROOT_PATH, "node_modules", "esbuild", "esbuild.exe");
    } else {
        process.env.ESBUILD_BINARY_PATH = path.join(ROOT_PATH, "node_modules", "esbuild", "bin", "esbuild");
    }

    const remarkPlugins = [remarkSlug, remarkParse];
    const rehypePlugins = [rehypePrism];

    try {
        return await bundleMDX({
            source: content,
            mdxOptions(options) {
                options.remarkPlugins = [...(options.remarkPlugins ?? []), ...remarkPlugins];
                options.rehypePlugins = [...(options.rehypePlugins ?? []), ...rehypePlugins];
                return options;
            },
        });
    } catch (error) {
        throw new Error("failed to build mdx");
    }
};
export const getMdxBySlug = async (base: string, slug: string) => {
    const source = getFileContent(path.join(CONTENT_PATH, base, `${slug}.mdx`));
    const { content, excerpt } = parseFileContent(source) as any;
    const { code, frontmatter } = await getCompiledMDX(source);

    return {
        code,
        frontmatter: {
            ...frontmatter,
            excerpt,
            slug,
            readingTime: readingTime(content),
        } as Frontmatter,
        nextBlog: null,
        previousBlog: null,
    };
};

export function getAllVersionsFromPath(pathName: string) {
    const PATH = path.join(CONTENT_PATH, pathName);
    if (!fs.existsSync(PATH)) return [];
    return fs
        .readdirSync(PATH)
        .map((fileName) => fileName.replace(".mdx", ""))
        .sort(compareVersions)
        .reverse();
}
