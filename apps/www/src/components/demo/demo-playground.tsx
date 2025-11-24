'use client';

import { IconButton } from '@raystack/apsara';
import { RefreshCw } from 'lucide-react';
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams
} from 'next/navigation';
import { useState } from 'react';
import { LiveProvider } from 'react-live';
import Editor from '../editor';
import Preview from '../preview';
import DemoControls from './demo-controls';
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

  const updatedProps = Object.fromEntries(
    Object.entries(componentProps).filter(
      ([key, value]) => value !== controls[key]?.defaultValue
    )
  );
  const code = getCode(updatedProps, componentProps).trim();

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

  return (
    <LiveProvider code={code} scope={scope} disabled>
      <div className={styles.container} data-demo>
        <div className={styles.previewContainer}>
          <div className={styles.preview}>
            <Preview />
            <IconButton
              size={1}
              className={styles.previewReset}
              onClick={resetProps}
              aria-label='Reset to default props'
            >
              <RefreshCw size={12} />
            </IconButton>
          </div>
          <DemoControls
            controls={controls}
            componentProps={componentProps}
            onPropChange={handlePropChange}
          />
        </div>
        <Editor code={code} />
      </div>
    </LiveProvider>
  );
}
