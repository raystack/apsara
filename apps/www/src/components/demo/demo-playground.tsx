'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { Dialog, Flex, IconButton } from '@raystack/apsara';
import { ResetIcon } from '@raystack/apsara/icons';
import { cx } from 'class-variance-authority';
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams
} from 'next/navigation';
import { useMemo, useState } from 'react';
import { LiveProvider } from 'react-live';
import Editor from '../editor';
import Preview from '../preview';
import { useDemoContext } from './demo-context';
import DemoControls from './demo-controls';
import DemoPreview from './demo-preview';
import DemoTitle from './demo-title';
import styles from './styles.module.css';
import {
  ComponentPropsType,
  ControlsType,
  DemoPlaygroundProps,
  PropChangeHandlerType
} from './types';

const getInitialProps = (
  controls: ControlsType,
  searchParams?: ReadonlyURLSearchParams
) => {
  const initialProps: ComponentPropsType = {};

  Object.keys(controls).forEach(key => {
    const { type, initialValue, defaultValue } = controls[key];
    const value =
      (searchParams && searchParams.get(key)) ?? initialValue ?? defaultValue;

    initialProps[key] = type === 'checkbox' ? value === 'true' : value;
  });
  return initialProps;
};

const getUpdatedProps = (
  componentProps: ComponentPropsType,
  controls: ControlsType
) => {
  return Object.fromEntries(
    Object.entries(componentProps).filter(
      ([key, value]) => value !== controls[key]?.defaultValue
    )
  );
};
export default function DemoPlayground({
  scope,
  controls,
  getCode
}: DemoPlaygroundProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [componentProps, setComponentProps] = useState(() =>
    getInitialProps(controls, searchParams)
  );

  const code = useMemo(() => {
    const updatedProps = getUpdatedProps(componentProps, controls);
    return getCode(updatedProps, componentProps).trim();
  }, [componentProps, controls, getCode]);

  const previewCode = useMemo(() => {
    const props = getInitialProps(controls);
    const updatedProps = getUpdatedProps(props, controls);
    return getCode(updatedProps, props).trim();
  }, []);

  const handlePropChange: PropChangeHandlerType = (prop, value) => {
    const updatedComponentProps = { ...componentProps, [prop]: value };
    const params = new URLSearchParams();

    setComponentProps({ ...componentProps, [prop]: value });

    Object.entries(updatedComponentProps).forEach(([key, val]) => {
      const { defaultValue, initialValue, type } = controls[key];

      if (val !== defaultValue && val !== initialValue) {
        params.set(key, String(val));
      }
    });
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const resetProps = () => {
    router.push(`?`, { scroll: false });
    setComponentProps(getInitialProps(controls));
  };
  const { openPlayground, setOpenPlayground } = useDemoContext();

  return (
    <>
      <DemoPreview type='code' code={previewCode} scope={scope} />
      <Dialog open={openPlayground} onOpenChange={setOpenPlayground}>
        <Dialog.Content
          className={styles.playgroundDialog}
          showCloseButton={false}
          showNestedAnimation={false}
        >
          <Dialog.Header className={styles.playgroundHeader}>
            <DemoTitle className={styles.playgroundTitle} />
            <Flex gap={3} align='center'>
              <IconButton
                size={2}
                onClick={resetProps}
                aria-label='Reset to default props'
              >
                <ResetIcon />
              </IconButton>
              <IconButton
                size={2}
                onClick={() => setOpenPlayground(false)}
                aria-label='Close playground'
              >
                <Cross2Icon />
              </IconButton>
            </Flex>
          </Dialog.Header>
          <LiveProvider code={code} scope={scope} disabled>
            <div
              className={cx(styles.container, styles.playgroundContent)}
              data-demo
            >
              <div
                className={cx(
                  styles.previewContainer,
                  styles.playgroundPreviewContainer
                )}
              >
                <div className={cx(styles.preview, styles.playgroundPreview)}>
                  <Preview className={styles.playgroundPreviewContent} />
                </div>
                <DemoControls
                  controls={controls}
                  componentProps={componentProps}
                  onPropChange={handlePropChange}
                  className={styles.playgroundControls}
                />
              </div>
              <Editor
                code={code}
                className={styles.playgroundEditor}
                maxLines={undefined}
              />
            </div>
          </LiveProvider>
        </Dialog.Content>
      </Dialog>
    </>
  );
}
