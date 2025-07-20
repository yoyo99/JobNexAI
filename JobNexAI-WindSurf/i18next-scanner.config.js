module.exports = {
  input: [
    'src/**/*.{js,jsx,ts,tsx}',
  ],
  output: './',
  options: {
    debug: false,
    removeUnusedKeys: false,
    sort: true,
    func: {
      list: ['t', 'i18next.t', 'useTranslation'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    trans: {
      component: 'Trans',
      i18nKey: 'i18nKey',
      defaultsKey: 'defaults',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    lngs: ['en', 'fr', 'es', 'it', 'de'],
    defaultLng: 'fr',
    defaultNs: 'translation',
    resource: {
      loadPath: 'public/locales/{{lng}}/{{ns}}.json',
      savePath: 'public/locales/{{lng}}/{{ns}}.json',
      jsonIndent: 2,
      lineEnding: '\n',
    },
    ns: [
      'translation',
    ],
    keySeparator: '.',
    nsSeparator: ':',
  },
};
