import { CodeBlock } from '@raystack/apsara';
import { INSTALL_COMMAND } from './data';
import styles from './landing.module.css';

const EXAMPLE = `import '@raystack/apsara/style.css';
import { Button, Field, Flex, Input, ThemeProvider } from '@raystack/apsara';

export default function App() {
  return (
    <ThemeProvider accentColor="indigo" grayColor="slate" style="modern">
      <Flex direction="column" gap={5}>
        <Field label="Workspace name">
          <Input placeholder="Halcyon Labs" />
        </Field>
        <Button>Save changes</Button>
      </Flex>
    </ThemeProvider>
  );
}`;

const STEPS: Array<{ title: string; body: string }> = [
  {
    title: 'Install',
    body: `${INSTALL_COMMAND}. Requires React 19.`
  },
  {
    title: 'Import the stylesheet once',
    body: 'One CSS file carries every token and every component style. No runtime, no CSS-in-JS.'
  },
  {
    title: 'Wrap in ThemeProvider',
    body: 'Pick an accent, a gray and a radius style. Light and dark are handled for you.'
  },
  {
    title: 'Compose',
    body: 'Every component is a set of parts you assemble, the way the drawing above was assembled.'
  }
];

export default function CodeSection() {
  return (
    <div className={styles.code}>
      <div className={styles.codeCopy}>
        <span className={styles.label}>Usage</span>
        <h2 className={styles.sectionTitle}>Four lines from an empty file.</h2>
        <p className={styles.sectionLede}>
          Apsara ships as one package with three entry points: components, icons
          and hooks. There is no build step and no configuration file.
        </p>
        <ol className={styles.codeSteps}>
          {STEPS.map((step, index) => (
            <li key={step.title} className={styles.codeStep}>
              <span className={styles.mono}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>
                <strong>{step.title}.</strong> {step.body}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div className={styles.codeBlock}>
        <div className={styles.dim} aria-hidden>
          <span className={styles.dimTick} />
          app.tsx
          <span className={styles.dimTick} />
        </div>
        <CodeBlock collapsed={false}>
          <CodeBlock.Header>
            <CodeBlock.Label>app.tsx</CodeBlock.Label>
            <CodeBlock.CopyButton />
          </CodeBlock.Header>
          <CodeBlock.Content>
            <CodeBlock.Code language='tsx'>{EXAMPLE}</CodeBlock.Code>
          </CodeBlock.Content>
        </CodeBlock>
      </div>
    </div>
  );
}
