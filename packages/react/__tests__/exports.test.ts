// @vitest-environment node
import { resolve } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

/* Consumers import components and their types from the root entry only, so a
   props type is public only when index.tsx exports it. */

const PACKAGE_DIR = process.cwd();

const isLocal = (node: ts.Node) =>
  !node.getSourceFile().fileName.includes('/node_modules/');

function loadRootEntry() {
  const { config } = ts.readConfigFile(
    resolve(PACKAGE_DIR, 'tsconfig.json'),
    ts.sys.readFile
  );
  const { options } = ts.parseJsonConfigFileContent(
    config,
    ts.sys,
    PACKAGE_DIR
  );
  const entry = resolve(PACKAGE_DIR, 'index.tsx');
  const program = ts.createProgram([entry], { ...options, noEmit: true });
  const checker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(entry);
  const moduleSymbol = sourceFile && checker.getSymbolAtLocation(sourceFile);
  if (!sourceFile || !moduleSymbol) throw new Error('index.tsx did not load');
  /* Type-only exports are erased at runtime, so only the compiler sees a
     duplicate or a missing name. */
  const errors = ts
    .getPreEmitDiagnostics(program, sourceFile)
    .map(error => ts.flattenDiagnosticMessageText(error.messageText, '\n'));
  return { checker, errors, exports: checker.getExportsOfModule(moduleSymbol) };
}

function findUnexportedPropsTypes() {
  const { checker, errors, exports } = loadRootEntry();
  const resolveAlias = (symbol: ts.Symbol) =>
    symbol.flags & ts.SymbolFlags.Alias
      ? checker.getAliasedSymbol(symbol)
      : symbol;
  const exported = new Set(exports.map(resolveAlias));

  const localType = (node: ts.TypeReferenceNode) => {
    const symbol = checker.getSymbolAtLocation(node.typeName);
    const target = symbol && resolveAlias(symbol);
    const declaration = target?.declarations?.[0];
    if (!target || !declaration || !isLocal(declaration)) return undefined;
    if (ts.isTypeParameterDeclaration(declaration)) return undefined;
    return target;
  };
  const wrapsLocalType = (node: ts.Node): boolean =>
    (ts.isTypeReferenceNode(node) && localType(node) !== undefined) ||
    (ts.forEachChild(node, wrapsLocalType) ?? false);

  const problems = [...errors];
  const checkPart = (name: string, type: ts.Type) => {
    const declaration = type.getCallSignatures()[0]?.declaration;
    /* A Base UI part used as it is has no props type of ours. */
    if (!declaration || !isLocal(declaration)) return;
    if (!ts.isFunctionLike(declaration)) return;
    const props = declaration.parameters[0];
    if (!props) return;
    const annotation = props.type;
    if (!annotation || !ts.isTypeReferenceNode(annotation)) {
      problems.push(`${name}: give its props one named type`);
      return;
    }
    const target = localType(annotation);
    if (target && !exported.has(target)) {
      problems.push(`${name}: export ${target.getName()} from index.tsx`);
    }
    if (!target && annotation.typeArguments?.some(wrapsLocalType)) {
      problems.push(`${name}: move ${annotation.getText()} into one type`);
    }
  };

  for (const symbol of exports) {
    const component = resolveAlias(symbol);
    const declaration = component.valueDeclaration;
    if (!declaration || !isLocal(declaration)) continue;
    if (!/^[A-Z]/.test(symbol.getName())) continue;
    const type = checker.getTypeOfSymbolAtLocation(component, declaration);
    checkPart(symbol.getName(), type);
    for (const part of type.getProperties()) {
      if (!part.valueDeclaration || !/^[A-Z]/.test(part.getName())) continue;
      checkPart(
        `${symbol.getName()}.${part.getName()}`,
        checker.getTypeOfSymbolAtLocation(part, part.valueDeclaration)
      );
    }
  }
  return problems;
}

describe('package exports', () => {
  it('exports the props type of every component and part', () => {
    expect(findUnexportedPropsTypes()).toEqual([]);
  }, 120_000);
});
