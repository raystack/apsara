import StyleDictionary from 'style-dictionary';

StyleDictionary.registerTransform({
  name: 'size/px',
  type: 'value',
  matcher: (token) => {
    return (token.unit === 'pixel' || token.type === 'dimension') && token.value !== 0;
  },
  transformer: (token) => {
    return `${token.value}px`;
  }
});

StyleDictionary.registerTransform({
  name: 'size/percent',
  type: 'value',
  matcher: (token) => {
    return token.unit === 'percent' && token.value !== 0;
  },
  transformer: (token) => {
    return `${token.value}%`;
  }
});

StyleDictionary.registerTransformGroup({
  name: 'custom/css',
  transforms: StyleDictionary.transformGroup['css'].concat([
    'size/px',
    'size/percent'
  ])
});

export default {
  source: ['tokens.json'],
  platforms: {
    css: {
      transformGroup: 'custom/css',
      buildPath: 'build/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          filter: (token) => token.filePath.indexOf('appearance') === -1,
          options: {
            outputReferences: true
          }
        },
        {
          destination: 'variables-dark.css',
          format: 'css/variables',
          filter: (token) => token.filePath.indexOf('appearance') !== -1 && token.path[1] === 'dark',
          options: {
            outputReferences: true,
            selector: 'html[data-theme="dark"]'
          }
        }
      ]
    }
  }
};
