import { theme } from "@odpf/apsara";

const makeCodeTheme = () => ({
  plain: {
    backgroundColor: theme.colors.gray1,
    color: theme.colors.grass11,
    fontWeight: '400',
    fontStyle: 'normal',
    fontFamily: theme.fonts.mono,
    fontSize: '.875rem',
    textRendering: 'geometricPrecision',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata', 'punctuation'],
      style: {
        color: 'theme.palette.accents_3',
        opacity: 0.5,
      },
    },
    {
      types: ['namespace'],
      style: {
        opacity: 1,
      },
    },
    {
      types: ['tag', 'operator', 'number'],
      style: {
        color: theme.colors.amber1,
      },
    },
    {
      types: ['property', 'function'],
      style: {
        color: theme.colors.green10,
      },
    },
    {
      types: ['tag-id', 'selector', 'atrule-id'],
      style: {
        color: '#eeebff',
      },
    },
    {
      types: ['attr-name'],
      style: {
        color: theme.colors.red10,
      },
    },
    {
      types: [
        'boolean',
        'string',
        'entity',
        'url',
        'attr-value',
        'keyword',
        'control',
        'directive',
        'unit',
        'statement',
        'regex',
        'at-rule',
        'placeholder',
        'variable',
      ],
      style: {
        color: theme.colors.purple10,
      },
    },
    {
      types: ['deleted'],
      style: {
        textDecorationLine: 'line-through',
      },
    },
    {
      types: ['language-javascript', 'script'],
      style: {
        color: theme.colors.green10,
      },
    },
    {
      types: ['inserted'],
      style: {
        textDecorationLine: 'underline',
      },
    },
    {
      types: ['italic'],
      style: {
        fontStyle: 'italic',
      },
    },
    {
      types: ['important', 'bold'],
      style: {
        fontWeight: 'bold',
      },
    },
    {
      types: ['important'],
      style: {
        color: '#c4b9fe',
      },
    },
  ],
})

export default makeCodeTheme