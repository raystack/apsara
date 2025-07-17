import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  ColorInformation,
  ColorPresentation,
  CompletionItem,
  CompletionItemKind,
  Diagnostic,
  DiagnosticSeverity,
  DocumentDiagnosticReportKind,
  Hover,
  InitializeResult,
  ProposedFeatures,
  TextDocumentPositionParams,
  TextDocumentSyncKind,
  TextDocuments,
  createConnection
} from 'vscode-languageserver/node';
import {
  VSCodeColorToColor,
  colorToVSCodeColor,
  getPatternMatch,
  getTokenName,
  getTokenValueFromName
} from './lib/utils';
import tokens from './tokens';

type TokenGroupType = keyof typeof tokens;

type TokenGroupPatternsType = {
  [T in TokenGroupType]: RegExp;
};
type GroupedCompletionItemsType = {
  [T in TokenGroupType]: CompletionItem[];
};

const tokenGroupPatterns: TokenGroupPatternsType = {
  color:
    /color|background|shadow|border[^-radius]|column-rule|filter|opacity|outline|text-decoration|caret-color|accent-color|border-(top|right|bottom|left)-color|background-color|border-color|outline-color|text-decoration-color|column-rule-color/,
  space:
    /margin|padding|gap|top|left|right|bottom|inset|margin-(top|right|bottom|left|block|inline)|margin-(block|inline)-(start|end)|padding-(top|right|bottom|left|block|inline)|padding-(block|inline)-(start|end)|row-gap|column-gap|inset-(block|inline)|inset-(block|inline)-(start|end)/,
  'font-size': /font-size|font(?!-)/,
  'font-weight': /font-weight|font(?!-)/,
  'line-height': /line-height|font(?!-)/,
  'letter-spacing': /letter-spacing|font(?!-)/,
  font: /font-family|font(?!-)/,
  radius:
    /border-radius|border-(top|bottom)-(left|right)-radius|border-(start|end)-(start|end)-radius/,
  shadow: /shadow|box-shadow|text-shadow|drop-shadow|filter/,
  blur: /blur|backdrop-filter|filter/
};
const settings = { maxNumberOfProblems: 1000 };

async function validateDocument(
  textDocument: TextDocument
): Promise<Diagnostic[]> {
  const text = textDocument.getText();
  const diagnostics: Diagnostic[] = [];
  let problems = 0;

  // Regex to match CSS property-value pairs
  const cssPropertyRegex = /([a-zA-Z-]+)\s*:\s*([^;}\n]+)/g;
  let match: RegExpExecArray | null;

  while (
    (match = cssPropertyRegex.exec(text)) &&
    problems < settings.maxNumberOfProblems
  ) {
    const [fullMatch, property, value] = match;
    const trimmedValue = value.trim();

    // Check if this property matches any of our token group patterns
    let matchedTokenGroup: string | null = null;
    for (const [tokenGroupName, tokenGroupPattern] of Object.entries(
      tokenGroupPatterns
    )) {
      if (tokenGroupPattern.test(property)) {
        matchedTokenGroup = tokenGroupName;
        break;
      }
    }

    // If property matches a token group and value is not using var(--rs-*) pattern
    if (matchedTokenGroup && !trimmedValue.includes('var(--rs-')) {
      problems++;

      // Find the actual position of the value in the text
      const colonIndex = fullMatch.indexOf(':');
      const valueStartInMatch = fullMatch
        .substring(colonIndex + 1)
        .search(/\S/); // First non-whitespace after colon
      const actualValueStart = match.index + colonIndex + 1 + valueStartInMatch;

      const diagnostic: Diagnostic = {
        severity: DiagnosticSeverity.Warning,
        range: {
          start: textDocument.positionAt(actualValueStart),
          end: textDocument.positionAt(actualValueStart + trimmedValue.length)
        },
        message: `Consider using Apsara ${matchedTokenGroup} tokens instead of '${trimmedValue}'. Use var(--rs-${matchedTokenGroup}-*) pattern.`,
        source: 'Apsara for VS Code'
      };
      diagnostics.push(diagnostic);
    }
  }

  return diagnostics;
}

// Grouped VS Code `CompletionItem`s for Apsara tokens
const groupedCompletionItems = Object.fromEntries(
  Object.entries(tokens).map(([tokenGroupName, tokenGroupItems]) => {
    const completionItems: CompletionItem[] = Object.entries(
      tokenGroupItems
    ).map(([tokenName, tokenValue]): CompletionItem => {
      const generatedTokenName = getTokenName(tokenGroupName, tokenName);
      return {
        label: generatedTokenName,
        detail: tokenValue,
        filterText: generatedTokenName,
        kind:
          tokenGroupName === 'color'
            ? CompletionItemKind.Color
            : CompletionItemKind.Constant
      };
    });

    return [tokenGroupName, completionItems];
  })
) as GroupedCompletionItemsType;

// All VS Code `CompletionItem`s for Apsara tokens
const allCompletionItems: CompletionItem[] = Object.values(
  groupedCompletionItems
).flat();

// Create a connection for the server, using Node's IPC as a transport and all proposed LSP features
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize(params => {
  const triggerCharacters = params.initializationOptions?.triggerCharacters || [
    '--'
  ];

  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      // Tell the client that this server supports code completion.
      completionProvider: {
        triggerCharacters
      },
      // Tell the client that this server supports hover.
      hoverProvider: true,
      // Tell the client that this server supports color information.
      colorProvider: true,
      // Tell the client that this server supports diagnostics.
      diagnosticProvider: {
        interFileDependencies: false,
        workspaceDiagnostics: false
      }
    }
  };
  return result;
});

// This handler provides the list of token completion items.
connection.onCompletion(
  (textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
    const doc = documents.get(textDocumentPosition.textDocument.uri);
    let matchedCompletionItems: CompletionItem[] = [];

    // if the doc can't be found, return nothing
    if (!doc) return [];

    const currentText = doc.getText({
      start: { line: textDocumentPosition.position.line, character: 0 },
      end: { line: textDocumentPosition.position.line, character: 1000 }
    });

    // if the current text is empty or doesn't include a colon or =, return nothing
    if (
      currentText.trim().length === 0 ||
      !(currentText.includes(':') || currentText.includes('='))
    )
      return [];

    const cursor = textDocumentPosition.position.character;

    // Look for complete var(...) wrappers
    const completeVarMatch = getPatternMatch(
      /var\s*\(([^)]*)\)/g,
      currentText,
      cursor
    );

    // Look for incomplete var(... wrappers
    const incompleteVarMatch = getPatternMatch(
      /var\s*\(([^)]*)/g,
      currentText,
      cursor
    );

    // Look for token patterns: -- followed by word characters, or just --
    const tokenMatch = getPatternMatch(
      /--[a-zA-Z0-9-_]*/g,
      currentText,
      cursor
    );

    for (const [tokenGroupName, pattern] of Object.entries(
      tokenGroupPatterns
    )) {
      if (!pattern.test(currentText)) continue;

      const currentCompletionItems =
        groupedCompletionItems[tokenGroupName as TokenGroupType];

      matchedCompletionItems = matchedCompletionItems.concat(
        currentCompletionItems
      );
    }

    const completionItems = matchedCompletionItems.length
      ? matchedCompletionItems
      : allCompletionItems;

    return completionItems.map(item => ({
      ...item,
      textEdit: {
        range: {
          start: {
            line: textDocumentPosition.position.line,
            character: tokenMatch.start
          },
          end: {
            line: textDocumentPosition.position.line,
            character: tokenMatch.end
          }
        },
        newText: completeVarMatch.match
          ? item.label
          : incompleteVarMatch.match
            ? `${item.label})`
            : `var(${item.label})`
      }
    }));
  }
);

// This handler provides the hover information for the token.
connection.onHover(
  (textDocumentPosition: TextDocumentPositionParams): Hover => {
    const doc = documents.get(textDocumentPosition.textDocument.uri);

    // if the doc can't be found, return nothing
    if (!doc) {
      return { contents: [] };
    }

    const currentText = doc.getText({
      start: { line: textDocumentPosition.position.line, character: 0 },
      end: { line: textDocumentPosition.position.line, character: 1000 }
    });

    const cursorPosition = textDocumentPosition.position.character;

    // Look for token match at the cursor position
    const tokenMatch = getPatternMatch(
      /--[a-zA-Z0-9-_]*/g,
      currentText,
      cursorPosition
    );

    if (!tokenMatch.match) {
      return { contents: [] };
    }

    const result = allCompletionItems.find(
      token => token.label === tokenMatch.match
    );

    if (result === undefined) {
      return {
        contents: []
      };
    }

    return {
      contents: [
        {
          language: 'css',
          value: `${result.label}: ${result.detail}`
        }
      ]
    };
  }
);

// This handler provides color information for the document.
connection.onDocumentColor((params): ColorInformation[] => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) {
    return [];
  }

  const text = doc.getText();
  const colorInformations: ColorInformation[] = [];

  // Match var(--rs-color-*) patterns
  const varRegex = /var\s*\(\s*(--rs-color-[a-zA-Z0-9-_]+)\s*\)/g;
  let match;

  while ((match = varRegex.exec(text)) !== null) {
    const tokenName = match[1];
    const colorHex = getTokenValueFromName(tokenName);
    const colorValue = colorToVSCodeColor(colorHex);

    if (colorValue) {
      const startPos = doc.positionAt(match.index);
      const endPos = doc.positionAt(match.index + match[0].length);

      colorInformations.push({
        range: { start: startPos, end: endPos },
        color: colorValue
      });
    }
  }

  return colorInformations;
});

// This handler provides color presentations for the color picker.
connection.onColorPresentation((params): ColorPresentation[] => {
  const { color } = params;

  // Convert VS Code Color to hex format
  const colorHex = VSCodeColorToColor(color);

  const presentations: ColorPresentation[] = [];

  presentations.push({
    label: colorHex,
    textEdit: {
      range: params.range,
      newText: colorHex
    }
  });

  return presentations;
});

connection.languages.diagnostics.on(async params => {
  const document = documents.get(params.textDocument.uri);

  //Don't validate if the document is not found
  return {
    kind: DocumentDiagnosticReportKind.Full,
    items: document ? await validateDocument(document) : []
  };
});

// Listen for document changes to trigger diagnostics
documents.onDidChangeContent(async change => {
  // Validate the document and send diagnostics
  const diagnostics = await validateDocument(change.document);
  console.log('onDidChangeContent diagnostics', diagnostics);
  connection.sendDiagnostics({
    uri: change.document.uri,
    diagnostics
  });
});

// Also validate when document is opened
documents.onDidOpen(async change => {
  const diagnostics = await validateDocument(change.document);
  console.log('onDidOpen diagnostics', diagnostics);
  connection.sendDiagnostics({
    uri: change.document.uri,
    diagnostics
  });
});

// Make the text document manager listen on the connection for open, change and close text document events
documents.listen(connection);

// Listen on the connection for any events
connection.listen();
