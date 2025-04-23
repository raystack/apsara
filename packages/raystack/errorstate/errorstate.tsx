import {
  ExclamationTriangleIcon,
  FileIcon,
  FileTextIcon,
} from "@radix-ui/react-icons";
import { VariantProps, cva } from "class-variance-authority";
import { HTMLAttributes, PropsWithChildren } from "react";
import { Body } from "../body";
import { Flex } from "../flex";
import { Headline } from "../headline";
import styles from "./errorstate.module.css";

type Status =
  | "404"
  | "NOT_FOUND"
  | "UNDER_MAINTENANCE"
  | "SOMETHING_WENT_WRONG"
  | string;

const getIcon = (status: string = "") => {
  switch (status) {
    case "400":
      return <FileTextIcon width={80} height={80} />;
    case "NOT_FOUND":
      return <FileIcon width={80} height={80} />;
    case "UNDER_MAINTENANCE":
      return <ExclamationTriangleIcon width={80} height={80} />;
    case "SOMETHING_WENT_WRONG":
      return <ExclamationTriangleIcon width={80} height={80} />;
    default:
      return <ExclamationTriangleIcon width={80} height={80} />;
  }
};

const getMessage = (
  status: string = "System is facing some issue with your request, please try again later"
) => {
  switch (status) {
    case "400":
      return "Sorry, the page you are looking for doesn’t exist or has been moved.";
    case "NOT_FOUND":
      return "Sorry, the resource you are looking for doesn’t exist or has been deleted.";
    case "UNDER_MAINTENANCE":
      return "The page you are looking for is under maintenance and will be back soon.";
    case "SOMETHING_WENT_WRONG":
      return "System is facing some issue with your request, please try again later";
    default:
      return status;
  }
};

const getHeadline = (status: string = "Something gone wrong") => {
  switch (status) {
    case "400":
      return "404 error";
    case "NOT_FOUND":
      return "Resource not found";
    case "UNDER_MAINTENANCE":
      return "Under maintenance";
    case "SOMETHING_WENT_WRONG":
      return "Something gone wrong";
    default:
      return status;
  }
};

const errorstate = cva(styles.errorstate);
type ErrorStateProps = PropsWithChildren<VariantProps<typeof errorstate>> &
  HTMLAttributes<HTMLElement> & {
    icon?: React.ReactElement;
    status?: Status;
    message?: string;
  };

/**
 * @deprecated Use EmptyState from '@raystack/apsara/v1' instead.
 */
export function ErrorState({
  children,
  className,
  status,
  icon,
  message,
  ...props
}: ErrorStateProps) {
  return (
    <Flex justify="center" style={{ width: "100%", height: "100%" }}>
      <Flex
        direction="column"
        gap="large"
        align="center"
        justify="center"
        className={errorstate({ className })}
        style={{ textAlign: "center", maxWidth: "400px" }}
        {...props}
      >
        {icon ? icon : getIcon(status)}
        <Flex direction="column" gap="medium">
          <Headline size="large">{getHeadline(status)}</Headline>
          <Body size="large">{message ? message : getMessage(status)}</Body>
        </Flex>
      </Flex>
    </Flex>
  );
}
