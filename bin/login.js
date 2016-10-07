'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _communication = require('./communication.js');

var _communication2 = _interopRequireDefault(_communication);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _helpers = require('./helpers.js');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function exec(base, email, password) {
  return new Promise(function (resolve) {
    function run() {
      var answersP = email && password ? Promise.resolve({ email: email, password: password }) : prompt(email);
      answersP.then(function (answers) {
        query(base, answers.email, answers.password).then(function () {
          return resolve();
        }).catch(function () {
          _helpers2.default.UI.display('Login error, check your credentials. If you forgot your password, visit ' + base + ' to reset it.');
          run();
        });
      });
    }
    run();
  });
}

function prompt(email) {
  return _inquirer2.default.prompt([{
    type: 'input',
    name: 'email',
    message: 'Email: ',
    default: email,
    validate: function validate(email) {
      return email && email.length > 0;
    }
  }, {
    type: 'password',
    name: 'password',
    message: 'Password: '
  }]);
}

function query(base, email, password) {
  var url = base + '/login';
  var data = {
    email: email,
    password: password,
    next: 'reload'
  };
  return _communication2.default.post(url, data);
}

exports.default = exec;