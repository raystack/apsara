const { readdirSync, readFileSync } = require('node:fs');
const { createRequire } = require('node:module');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const reactRoot = path.join(repoRoot, 'packages/react');
const docsRoot = path.join(repoRoot, 'apps/www/src/content/docs');

// The root workspace pins an older TypeScript than the library.
const ts = createRequire(path.join(reactRoot, 'package.json'))('typescript');

const toastManager = 'components/toast/toast-manager.ts';

/**
 * Exceptions for the docs props check.
 *
 * - `matches`: docs interface to an exported type, a compound part
 *   (`Menu.SubmenuContent`) or `<file>#<type>` under `packages/react`.
 * - `docsOnly`: docs interfaces with no component type.
 * - `inherits`: Apsara components whose props a part inherits. The part's
 *   section in index.mdx must say "Inherits all <Component> props".
 * - `internal`: component props left out of the table.
 * - `required`: props the table marks required although the type allows
 *   leaving them out.
 */
const CONFIG = {
  matches: {
    BreadcrumbItem: 'BreadcrumbItemProps',
    MenuSubContentProps: 'Menu.SubmenuContent',
    ContextMenuSubContentProps: 'ContextMenu.SubmenuContent',
    ToastManagerAddOptions: `${toastManager}#ToastAddOptions`,
    ToastManagerUpdateOptions: `${toastManager}#ToastUpdateOptions`,
    ToastManagerPromiseOptions: `${toastManager}#ToastPromiseOptions`,
    CreateToastManagerReturn: `${toastManager}#ToastManager`,
    UseToastManagerReturn: `${toastManager}#UseToastManagerReturn`,
    ViewSpec: 'components/data-view/index.ts#ViewSpec'
  },
  docsOnly: {
    ToastObject: 'Base UI type of each item in `toasts`.',
    ToastPositionerOptions:
      'Base UI `positionerProps` of an anchored toast. Apsara does not export it.',
    ThemeIconProps: 'The `icons` prop of `Theme`, documented on the Icons page.'
  },
  inherits: {
    AlertDialogBodyProps: ['Flex'],
    AlertDialogFooterProps: ['Flex'],
    AlertDialogHeaderProps: ['Flex'],
    CalendarPreviewFooterProps: ['Flex'],
    CalendarPreviewInputProps: ['Input'],
    CalendarPreviewResetProps: ['IconButton'],
    CodeBlockCollapseTriggerProps: ['Button'],
    CodeBlockCopyButtonProps: ['CopyButton'],
    CodeBlockHeaderProps: ['Flex'],
    CodeBlockLabelProps: ['Text'],
    CodeBlockLanguageSelectProps: ['Select'],
    CodeBlockLanguageSelectTriggerProps: ['Select.Trigger'],
    ColorPickerModeProps: ['Select.Trigger'],
    ColorPickerProps: ['Flex'],
    ComboboxInputProps: ['Input'],
    CommandInputProps: ['Input'],
    CopyButtonProps: ['IconButton'],
    DialogBodyProps: ['Flex'],
    DialogFooterProps: ['Flex'],
    DialogHeaderProps: ['Flex'],
    EmptyStateProps: ['Flex'],
    LinkProps: ['Text'],
    NavbarCenterProps: ['Flex'],
    NavbarEndProps: ['Flex'],
    NavbarStartProps: ['Flex'],
    PromptInputTextareaProps: ['TextArea'],
    SearchProps: ['Input'],
    SidebarTriggerProps: ['IconButton'],
    TourProgressProps: ['Text']
  },
  internal: {
    MenuRootProps: {
      inputRef: 'Menu context field. The root does not read it.',
      contentRef: 'Menu context field. The root does not read it.',
      isInitialRender: 'Menu context field. The root does not read it.'
    }
  },
  required: {
    SelectItemProps: {
      value: 'Without it the item value is the string "undefined".'
    }
  }
};

const RULES = {
  unmatched: 'docs interface matches no component type',
  unknown: 'documented prop does not exist on the component',
  deprecated: 'deprecated prop is in the table',
  optional: 'required/optional differs from the component',
  literals: 'literal values differ from the component',
  missing: 'component prop is missing from the table',
  inherits: 'inherited Apsara props need an inherits entry',
  inheritsText: 'index.mdx does not say "Inherits all <Component> props"'
};

function findFiles(dir, name) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return findFiles(full, name);
    return entry.name === name ? [full] : [];
  });
}

const INHERITS_TEXT = component =>
  new RegExp(`Inherits all \`?${component.replace('.', '\\.')}\`? props`);

function isExternal(file) {
  return file.includes(`${path.sep}node_modules${path.sep}`);
}

function isDeprecated(symbol) {
  return (symbol.declarations ?? []).some(decl =>
    ts.getJSDocTags(decl).some(tag => tag.tagName.text === 'deprecated')
  );
}

function isObjectLike(type) {
  if (type.isUnion() || type.isIntersection())
    return type.types.every(isObjectLike);
  return (type.flags & ts.TypeFlags.Object) !== 0;
}

function literalValues(checker, type) {
  const values = new Set();
  const members = type.isUnion() ? type.types : [type];
  for (const member of members) {
    if (member.isStringLiteral()) values.add(JSON.stringify(member.value));
    else if (member.flags & ts.TypeFlags.BooleanLiteral)
      values.add(checker.typeToString(member));
  }
  return values;
}

/**
 * Returns the props of one or more types. A prop is optional when any union
 * member or overload leaves it out or marks it optional.
 */
function collectProps(checker, types) {
  const members = types.flatMap(type => {
    const constraint = type.isTypeParameter()
      ? checker.getBaseConstraintOfType(type)
      : type;
    if (!constraint) return [];
    return constraint.isUnion() ? constraint.types : [constraint];
  });
  const props = new Map();
  members.forEach(member => {
    for (const symbol of checker.getPropertiesOfType(
      checker.getApparentType(member)
    )) {
      const name = symbol.getName();
      // Symbol keys are internal and cannot be written in a props table.
      if (name.startsWith('__@')) continue;
      const optional = (symbol.flags & ts.SymbolFlags.Optional) !== 0;
      const entry = props.get(name) ?? {
        symbols: [],
        optional: false,
        count: 0
      };
      entry.symbols.push(symbol);
      entry.optional ||= optional;
      entry.count += 1;
      props.set(name, entry);
    }
  });
  for (const entry of props.values()) {
    if (entry.count < members.length) entry.optional = true;
  }
  return props;
}

/** Returns the directory under `components/`, or undefined for shared code. */
function componentDir(componentsRoot, file) {
  const relative = path.relative(componentsRoot, file);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return undefined;
  return relative.split(path.sep)[0];
}

function createProgram(sourceEntry, docsFiles, tsconfigPath) {
  let options = {
    strict: true,
    noEmit: true,
    skipLibCheck: true,
    jsx: ts.JsxEmit.ReactJSX,
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler
  };
  if (tsconfigPath) {
    const { config } = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
    options = {
      ...ts.parseJsonConfigFileContent(
        config,
        ts.sys,
        path.dirname(tsconfigPath)
      ).options,
      noEmit: true,
      skipLibCheck: true
    };
  }
  options.baseUrl ??= path.dirname(sourceEntry);
  options.paths = {
    ...options.paths,
    '@raystack/apsara': [sourceEntry]
  };
  return ts.createProgram([sourceEntry, ...docsFiles], options);
}

/**
 * Compares each interface in the docs `props.ts` files with the component
 * type it documents.
 */
function checkDocsProps({ sourceEntry, docsFiles, config = {}, tsconfigPath }) {
  const program = createProgram(sourceEntry, docsFiles, tsconfigPath);
  const checker = program.getTypeChecker();
  const componentsRoot = path.join(path.dirname(sourceEntry), 'components');
  const issues = [];

  const entry = checker.getSymbolAtLocation(program.getSourceFile(sourceEntry));
  const exportsByName = new Map(
    checker.getExportsOfModule(entry).map(symbol => [symbol.getName(), symbol])
  );

  const resolve = symbol =>
    symbol.flags & ts.SymbolFlags.Alias
      ? checker.getAliasedSymbol(symbol)
      : symbol;

  // A docs name matches the first parameter of a compound part, for example
  // `CodeBlockHeaderProps` to `CodeBlock.Header`. Overloads add one type each.
  const firstParameter = (type, declaration) => {
    const signatures = type.getCallSignatures();
    const types = signatures.flatMap(signature => {
      const [param] = signature.getParameters();
      return param
        ? [checker.getTypeOfSymbolAtLocation(param, declaration)]
        : [];
    });
    if (types.length === 0) return undefined;
    return {
      types,
      file: (signatures[0].getDeclaration() ?? declaration).getSourceFile()
        .fileName
    };
  };

  const partProps = new Map();
  for (const [name, exported] of exportsByName) {
    const symbol = resolve(exported);
    if (!(symbol.flags & ts.SymbolFlags.Value) || !symbol.valueDeclaration)
      continue;
    const valueType = checker.getTypeOfSymbolAtLocation(
      symbol,
      symbol.valueDeclaration
    );
    if (valueType.getCallSignatures().length) {
      partProps.set(`${name}Props`, name);
      partProps.set(`${name}RootProps`, name);
    }
    for (const part of checker.getPropertiesOfType(valueType)) {
      const partName = part.getName();
      if (!/^[A-Z]/.test(partName)) continue;
      partProps.set(`${name}${partName}Props`, `${name}.${partName}`);
    }
  }

  const lookup = target => {
    const [modulePath, typeName] = target.split('#');
    if (typeName) {
      const module = program.getSourceFile(
        path.join(path.dirname(sourceEntry), modulePath)
      );
      const symbol =
        module &&
        checker
          .getExportsOfModule(checker.getSymbolAtLocation(module))
          .find(s => s.getName() === typeName);
      if (!symbol) return undefined;
      const resolved = resolve(symbol);
      return {
        types: [checker.getDeclaredTypeOfSymbol(resolved)],
        file: resolved.declarations[0].getSourceFile().fileName
      };
    }
    const [head, ...rest] = target.split('.');
    const exported = exportsByName.get(head);
    if (!exported) return undefined;
    let symbol = resolve(exported);
    if (rest.length === 0 && symbol.flags & ts.SymbolFlags.Type) {
      return {
        types: [checker.getDeclaredTypeOfSymbol(symbol)],
        file: symbol.declarations[0].getSourceFile().fileName
      };
    }
    if (!symbol.valueDeclaration) return undefined;
    let type = checker.getTypeOfSymbolAtLocation(
      symbol,
      symbol.valueDeclaration
    );
    for (const key of rest) {
      symbol = type.getProperty(key);
      if (!symbol) return undefined;
      type = checker.getTypeOfSymbolAtLocation(
        symbol,
        symbol.valueDeclaration ?? symbol.declarations[0]
      );
    }
    return firstParameter(
      type,
      symbol.valueDeclaration ?? symbol.declarations[0]
    );
  };

  const docsOnly = config.docsOnly ?? {};
  const matches = config.matches ?? {};
  const inherits = config.inherits ?? {};
  const internal = config.internal ?? {};

  for (const file of docsFiles) {
    const sourceFile = program.getSourceFile(file);
    const mdxPath = path.join(path.dirname(file), 'index.mdx');
    let mdx;
    try {
      mdx = readFileSync(mdxPath, 'utf8');
    } catch {
      mdx = '';
    }

    for (const statement of sourceFile.statements) {
      if (
        !ts.isInterfaceDeclaration(statement) &&
        !ts.isTypeAliasDeclaration(statement)
      )
        continue;
      const name = statement.name.text;
      const symbol = checker.getSymbolAtLocation(statement.name);
      const docsType = checker.getDeclaredTypeOfSymbol(symbol);
      const exported = statement.modifiers?.some(
        m => m.kind === ts.SyntaxKind.ExportKeyword
      );
      if (!exported) continue;
      if (ts.isTypeAliasDeclaration(statement) && !isObjectLike(docsType))
        continue;

      const { line } = sourceFile.getLineAndCharacterOfPosition(
        statement.name.getStart()
      );
      const report = (rule, prop, detail) =>
        issues.push({
          rule,
          file,
          line: line + 1,
          name,
          prop,
          detail
        });

      if (docsOnly[name]) continue;
      const real =
        (matches[name] && lookup(matches[name])) ||
        lookup(name) ||
        (partProps.has(name) && lookup(partProps.get(name)));
      if (!real) {
        report('unmatched');
        continue;
      }

      // Props the docs type inherits from React or Base UI are not in the docs file.
      const docsProps = new Map(
        [...collectProps(checker, [docsType])].filter(([, docsProp]) =>
          docsProp.symbols.some(s =>
            (s.declarations ?? []).some(
              d => !isExternal(d.getSourceFile().fileName)
            )
          )
        )
      );
      const realProps = collectProps(checker, real.types);
      const ownDir = componentDir(componentsRoot, real.file);

      for (const [prop, docsProp] of docsProps) {
        const realProp = realProps.get(prop);
        if (!realProp) {
          report('unknown', prop);
          continue;
        }
        if (realProp.symbols.some(isDeprecated)) report('deprecated', prop);
        if (
          docsProp.optional !== realProp.optional &&
          !(!docsProp.optional && config.required?.[name]?.[prop])
        ) {
          report(
            'optional',
            prop,
            `docs ${docsProp.optional ? 'optional' : 'required'}, component ${realProp.optional ? 'optional' : 'required'}`
          );
        }
        const docsValues = literalValues(
          checker,
          checker.getNonNullableType(
            checker.getTypeOfSymbol(docsProp.symbols[0])
          )
        );
        const realValues = new Set(
          realProp.symbols.flatMap(s => [
            ...literalValues(
              checker,
              checker.getNonNullableType(checker.getTypeOfSymbol(s))
            )
          ])
        );
        if (docsValues.size === 0 || realValues.size === 0) continue;
        const onlyDocs = [...docsValues].filter(v => !realValues.has(v));
        const onlyReal = [...realValues].filter(v => !docsValues.has(v));
        if (onlyDocs.length || onlyReal.length) {
          report(
            'literals',
            prop,
            [
              onlyReal.length && `component also has ${onlyReal.join(' | ')}`,
              onlyDocs.length && `docs also has ${onlyDocs.join(' | ')}`
            ]
              .filter(Boolean)
              .join('; ')
          );
        }
      }

      const inheritedProps = new Set();
      for (const component of inherits[name] ?? []) {
        const source = lookup(`${component.replace('.', '')}Props`);
        if (!source) throw new Error(`${name}: no ${component}Props export`);
        for (const prop of collectProps(checker, source.types).keys())
          inheritedProps.add(prop);
        if (!INHERITS_TEXT(component).test(sectionFor(mdx, name)))
          report('inheritsText', undefined, component);
      }

      for (const [prop, realProp] of realProps) {
        if (
          docsProps.has(prop) ||
          inheritedProps.has(prop) ||
          internal[name]?.[prop] ||
          realProp.symbols.some(isDeprecated)
        )
          continue;
        const files = realProp.symbols
          .flatMap(s => s.declarations ?? [])
          .map(d => d.getSourceFile().fileName)
          .filter(f => !isExternal(f));
        if (files.length === 0) continue;
        const dirs = files.map(f => componentDir(componentsRoot, f));
        if (dirs.some(dir => dir === undefined || dir === ownDir))
          report('missing', prop);
        else report('inherits', prop, `from components/${dirs[0]}`);
      }
    }
  }
  return issues;
}

/** Returns the index.mdx text from the heading above a table to the next heading. */
function sectionFor(mdx, name) {
  const lines = mdx.split('\n');
  const at = lines.findIndex(l => l.includes(`name="${name}"`));
  if (at === -1) return '';
  let start = at;
  while (start > 0 && !/^#{1,6} /.test(lines[start])) start -= 1;
  let end = at + 1;
  while (end < lines.length && !/^#{1,6} /.test(lines[end])) end += 1;
  return lines.slice(start, end).join('\n');
}

function formatIssues(issues) {
  return issues
    .map(issue => {
      const where = `${path.relative(repoRoot, issue.file)}:${issue.line}`;
      const subject = issue.prop ? `${issue.name}.${issue.prop}` : issue.name;
      const detail = issue.detail ? ` (${issue.detail})` : '';
      return `${where} ${subject}: ${RULES[issue.rule]}${detail}`;
    })
    .join('\n');
}

function main() {
  const issues = checkDocsProps({
    sourceEntry: path.join(reactRoot, 'index.tsx'),
    docsFiles: findFiles(docsRoot, 'props.ts'),
    tsconfigPath: path.join(reactRoot, 'tsconfig.json'),
    config: CONFIG
  });
  if (issues.length === 0) {
    console.log('Docs props tables match the components.');
    return;
  }
  console.error(formatIssues(issues));
  console.error('');
  for (const rule of Object.keys(RULES)) {
    const count = issues.filter(issue => issue.rule === rule).length;
    if (count) console.error(`${count} ${RULES[rule]}`);
  }
  process.exitCode = 1;
}

module.exports = { checkDocsProps };

if (require.main === module) main();
