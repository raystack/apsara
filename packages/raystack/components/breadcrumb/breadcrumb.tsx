import { BreadcrumbItem } from './breadcrumb-item';
import { BreadcrumbEllipsis, BreadcrumbSeparator } from './breadcrumb-misc';
import { BreadcrumbRoot } from './breadcrumb-root';

export const Breadcrumb = Object.assign(BreadcrumbRoot, {
  Item: BreadcrumbItem,
  Ellipsis: BreadcrumbEllipsis,
  Separator: BreadcrumbSeparator
});
