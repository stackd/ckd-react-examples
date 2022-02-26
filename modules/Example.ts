import fs from "fs";
import { join } from "path";
import util from "util";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import smartypants from "remark-smartypants";
import remarkGfm from "remark-gfm";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/";

loadLanguages(["tsx"]);

const readDir = util.promisify(fs.readdir);
const fsReadFile = util.promisify(fs.readFile);

const readFile = async (...path: string[]) =>
  fsReadFile(join(process.cwd(), ...path))
    .then((f) => f.toString("utf-8"))
    .catch((e) => {
      console.error(e);
      return "";
    });

export type ExampleId = "CkdSignIn" | "useAccount" | "useCkd" | "useDero";

type ExampleFrontmatter = {
  title: string;
  type: "component" | "hook";
  signInRequired: boolean;
};

export type ExampleProps = {
  id: ExampleId;
  frontmatter: ExampleFrontmatter;
};

export type Example = {
  props: ExampleProps;
  mdxRaw: string;
  tsxRaw: string;
  mdxSource: MDXRemoteSerializeResult<Record<string, unknown>>;
  tsxHTML: string;
};

const endsWithMdx = (d: string) => d.endsWith(".mdx");

const removeMdxExtension = (d: string) => d.replace(/\.mdx$/, "");

const loadExample = async (id: ExampleId): Promise<Example> => {
  const mdxRaw = await readFile("examples", `${id}.mdx`);
  const tsxRaw = await readFile("examples", `${id}.tsx`);
  const mdxSource = await serialize(mdxRaw, {
    mdxOptions: {
      remarkPlugins: [smartypants, remarkGfm],
    },
    parseFrontmatter: true,
  });
  const tsxHTML = Prism.highlight(tsxRaw, Prism.languages.tsx, "tsx");
  return {
    props: {
      id,
      frontmatter: mdxSource.frontmatter as unknown as ExampleFrontmatter,
    },
    mdxRaw,
    tsxRaw,
    mdxSource,
    tsxHTML,
  };
};

const Example = {
  async list(): Promise<Example[]> {
    const dirs = await readDir(join(process.cwd(), "examples"));
    const ids = dirs.filter(endsWithMdx).map(removeMdxExtension) as ExampleId[];
    const examples = await Promise.all(ids.map(loadExample));
    return examples;
  },

  toPath({ props: { id } }: Example) {
    return {
      params: {
        example: [id],
      },
    };
  },
};

export default Example;
