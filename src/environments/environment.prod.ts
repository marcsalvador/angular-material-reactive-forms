declare const require: any;

export const environment = {
  production: false,
  appCode: "en-us",
  apiUrl: "https://marcsalvador.github.io/angular-material-reactive-forms/assets/mockdata/",
  appUrl: "https://marcsalvador.github.io/angular-material-reactive-forms/",
  package: require('../../package.json'),
  googleBrowserKey: '[]',
  paypal: {
    mode: 'production',
    sandboxClientId: 'AW35MxsELLQji9DqLDeEK0wd7O1CjeBIVdlE1xs4p0VNQtaC9h-xzDY_lZFEm-4lmxQ-C6sT9uvCbiqr',
    productionClientId: 'AW35MxsELLQji9DqLDeEK0wd7O1CjeBIVdlE1xs4p0VNQtaC9h-xzDY_lZFEm-4lmxQ-C6sT9uvCbiqr',
    currency: 'USD'
  }
};
