const { faker } = require('@faker-js/faker');
import {
  BlendingModeIcon,
  BoxIcon,
  Component2Icon,
  FaceIcon,
  Half2Icon,
  InfoCircledIcon,
  Link2Icon,
  ReaderIcon,
  TargetIcon,
} from "@radix-ui/react-icons";

export type Payment = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
    created_at: string;
  };

  function createRandomData() {
    return {
      id: faker.string.uuid(),
      amount: faker.number.int(),
      status: faker.string.alpha(5),
      email: faker.internet.email(),
      created_at: faker.date.birthdate()
    };
  }

  export const getData = () => faker.helpers.multiple(createRandomData, {
    count: 25,
  });


export const navigationList = [
  {
    href: "#shield",
    leadingIcon: <InfoCircledIcon />,
    name: "Inbox",
  },
  {
    active: true,
    href: "#assets",
    leadingIcon: <BlendingModeIcon />,
    name: "Assets",
  },
  {
    leadingIcon: <BoxIcon />,
    name: "Lineage",
    disabled: true,
  },
  {
    leadingIcon: <Component2Icon />,
    name: "Appeals",
    disabled: true,
  },
  {
    leadingIcon: <TargetIcon />,
    name: "Grants",
    disabled: true,
  },
  {
    leadingIcon: <Half2Icon />,
    name: "Policies",
    disabled: true,
  },
  {
    leadingIcon: <ReaderIcon />,
    name: "Reports",
    disabled: true,
  },
  {
    leadingIcon: <FaceIcon />,
    name: "Teams",
    disabled: true,
  },
  {
    leadingIcon: <Link2Icon />,
    name: "Connections",
    disabled: true,
  },
];