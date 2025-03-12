import { Sidebar } from "@raystack/apsara/v1";
import { usePathname } from "next/navigation";

export default function SidebarItem(props: any) {
  const pathname = usePathname();
  const active = props.href === pathname;
  return <Sidebar.Item active={active} {...props} />;
}
