import { CkdSignIn } from "ckd-react";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { MDXRemote } from "next-mdx-remote";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import { useEffect } from "react";

import CkdSignInExample from "../../examples/CkdSignIn";
import UseAccountExample from "../../examples/useAccount";
import UseCkdExample from "../../examples/useCkd";
import UseDeroExample from "../../examples/useDero";
import Example, { ExampleProps, ExampleId } from "../../modules/Example";

type ExamplePageProps = {
  example: ExampleProps & {
    mdxSource: MDXRemoteSerializeResult<Record<string, unknown>>;
    tsxHTML: string;
  };
  examples: ExampleProps[];
};

const EXAMPLE_COMPONENTS: Record<ExampleId, React.ComponentType<unknown>> = {
  CkdSignIn: CkdSignInExample,
  useAccount: UseAccountExample,
  useCkd: UseCkdExample,
  useDero: UseDeroExample,
};

export default function ExamplePage({ example, examples }: ExamplePageProps) {
  const ExampleComponent = EXAMPLE_COMPONENTS[example.id];
  if (!ExampleComponent) {
    throw new Error(`${example.id} not found in EXAMPLE_COMPONENTS`);
  }

  const router = useRouter();

  useEffect(() => {
    Prism.highlightAll();
  }, [example.id]);

  return (
    <>
      <Head>
        <title>{`Examples: ${example.frontmatter.title}`}</title>
        <meta
          property="og:title"
          content={`Examples: ${example.frontmatter.title}`}
        />
        <meta
          property="og:url"
          content={`https://react-examples.ckd.dev/examples/${example.id}`}
        />
        <meta property="og:image" content="https://ckd.dev/ckd_banner.jpg" />
        <meta
          property="twitter:title"
          content={`Examples: ${example.frontmatter.title}`}
        />
        <meta
          property="twitter:image"
          content="https://ckd.dev/ckd_banner.jpg"
        />
      </Head>

      <div className="container">
        <h2>
          <Link href="/">
            <a>Ckd React Examples</a>
          </Link>
        </h2>
        <select
          value={example.id}
          onChange={(e) => {
            router.push(`/examples/${e.target.value}`);
          }}
        >
          <optgroup label="Components">
            {examples
              .filter((e) => e.frontmatter.type === "component")
              .map((e) => (
                <option key={e.id} value={e.id}>
                  {e.frontmatter.title}
                </option>
              ))}
          </optgroup>
          <optgroup label="Hooks">
            {examples
              .filter((e) => e.frontmatter.type === "hook")
              .map((e) => (
                <option key={e.id} value={e.id}>
                  {e.frontmatter.title}
                </option>
              ))}
          </optgroup>
        </select>
        <MDXRemote {...example.mdxSource} />
      </div>

      <div>
        <h3 className="example-label container">Source code</h3>
        <div className="example-code">
          <pre
            className="container"
            dangerouslySetInnerHTML={{ __html: example.tsxHTML }}
          />
        </div>
      </div>

      <div className="container">
        {example.frontmatter.signInRequired && (
          <>
            <p>
              <CkdSignIn /> <em>*sign in required</em>
            </p>
          </>
        )}
        <h3 className="example-label">Try it</h3>
        <ExampleComponent />
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const examples = await Example.list();
  return {
    paths: examples.map(Example.toPath),
    fallback: false,
  };
}

export const getStaticProps = async (req: {
  params: { example: ExampleId[] };
}): Promise<{ props: ExamplePageProps }> => {
  // const recipes = await loadThingIds()
  // if (!req.params.recipe) {
  //   return { props: { recipes, frontMatter: {} } }
  // }
  // const { mdxString, frontMatter } = await loadThing(req.params.recipe)
  // const mdxSource = await serialize(mdxString, { scope: frontMatter })

  const examples = await Example.list();
  const example = examples.find((e) => e.props.id === req.params.example[0]);
  if (!example) {
    throw new Error(`${req.params.example[0]} not found in examples`);
  }

  return {
    props: {
      example: {
        ...example.props,
        mdxSource: example.mdxSource,
        tsxHTML: example.tsxHTML,
      },
      examples: examples.map((e) => e.props),
    },
  };
};
