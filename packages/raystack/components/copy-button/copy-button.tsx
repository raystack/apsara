import { useCopyToClipboard } from "~/hooks/useCopyToClipboard";
import { CopyIcon } from "@radix-ui/react-icons";
import { CheckCircleFilledIcon } from "~/icons";
import { useState } from "react";
import { IconButtonProps, IconButton } from "../icon-button/icon-button";

interface CopyButtonProps extends IconButtonProps {
  text: string;
  resetTimeout?: number;
  resetIcon?: boolean;
}

export const CopyButton = ({
  text,
  resetTimeout = 1000,
  resetIcon = true,
  ...props
}: CopyButtonProps) => {
  const { copy } = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);

  async function onCopy() {
    const res = await copy(text);
    if (res) {
      setIsCopied(true);
      if (resetIcon) {
        setTimeout(() => {
          setIsCopied(false);
        }, resetTimeout);
      }
    }
  }

  return (
    <IconButton {...props} onClick={onCopy} data-test-id="copy-button">
      {isCopied ? (
        <CheckCircleFilledIcon
          color={"var(--rs-color-foreground-success-primary)"}
        />
      ) : (
        <CopyIcon />
      )}
    </IconButton>
  );
};
