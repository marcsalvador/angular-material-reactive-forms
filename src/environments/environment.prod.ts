declare const require: any;

export const environment = {
  production: true,
  appCode: "en-us",
  isMock: false,
  mockUrl: "http://192.168.22.53:4211/assets/mockdata/",
  apiUrl: "http://angulardemo-env.eba-cyw6mvfr.us-east-2.elasticbeanstalk.com/",
  appUrl: "http://searchandpay.s3-website.us-east-2.amazonaws.com/",
  package: require('../../package.json'),
  googleBrowserKey:  '',
  paypal: {
    mode: 'production',
    sandboxClientId: 'AW35MxsELLQji9DqLDeEK0wd7O1CjeBIVdlE1xs4p0VNQtaC9h-xzDY_lZFEm-4lmxQ-C6sT9uvCbiqr',
    productionClientId: 'AW35MxsELLQji9DqLDeEK0wd7O1CjeBIVdlE1xs4p0VNQtaC9h-xzDY_lZFEm-4lmxQ-C6sT9uvCbiqr',
    currency: 'USD'
  }
};


// export const environment = {
//   production: true,
//   appCode: "en-us",
//   isMock: false,
//   mockUrl: "http://192.168.22.53:4211/assets/mockdata/",
//   apiUrl: "https://angulardemo-env.eba-cyw6mvfr.us-east-2.elasticbeanstalk.com/",
//   appUrl: "https://marcsalvador.github.io/angular-material-reactive-forms/",
//   package: require('../../package.json'),
//   googleBrowserKey:  '',
//   paypal: {
//     mode: 'production',
//     sandboxClientId: 'AW35MxsELLQji9DqLDeEK0wd7O1CjeBIVdlE1xs4p0VNQtaC9h-xzDY_lZFEm-4lmxQ-C6sT9uvCbiqr',
//     productionClientId: 'AW35MxsELLQji9DqLDeEK0wd7O1CjeBIVdlE1xs4p0VNQtaC9h-xzDY_lZFEm-4lmxQ-C6sT9uvCbiqr',
//     currency: 'USD'
//   }
// };