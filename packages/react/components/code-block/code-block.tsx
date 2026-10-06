import { Select } from '../select';
import { CodeBlockCode } from './code-block-code';
import {
  CodeBlockLanguageSelect,
  CodeBlockLanguageSelectTrigger
} from './code-block-language-select';
import {
  CodeBlockCollapseTrigger,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLabel
} from './code-block-misc';
import { CodeBlockRoot } from './code-block-root';

export const CodeBlock = Object.assign(CodeBlockRoot, {
  Header: CodeBlockHeader,
  Content: CodeBlockContent,
  Label: CodeBlockLabel,
  LanguageSelect: CodeBlockLanguageSelect,
  LanguageSelectTrigger: CodeBlockLanguageSelectTrigger,
  LanguageSelectContent: Select.Content as typeof Select.Content,
  LanguageSelectItem: Select.Item as typeof Select.Item,
  CopyButton: CodeBlockCopyButton,
  Code: CodeBlockCode,
  CollapseTrigger: CodeBlockCollapseTrigger
});
