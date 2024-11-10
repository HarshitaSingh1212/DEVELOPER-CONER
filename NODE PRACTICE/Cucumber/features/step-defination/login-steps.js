const {Given,When,Then,After} = require('@cucumber/cucumber');
const { expect } = require('chai');
const sinon = require('sinon');
const fs = require('fs');
const {myPage} = require('../../login');

let tempResult;

Given('the database file does not exist', function () {
  tempResult= sinon.createSandbox();
  tempResult
.stub(fs, 'existsSync').returns(false);
});

Given('the database file exists', function () {
  tempResult= sinon.createSandbox();
  tempResult
.stub(fs, 'existsSync').returns(true);
});

When('I sign up with username {string} and password {string}', function (username, password) {
  this.result = myPage('signup', username, password);
});

When('I login with username {string} and password {string}', function (username, password) {
  this.result = myPage('login', username, password);
});

Then('I should receive {string}', function (expectedResult) {
  expect(this.result).to.equal(expectedResult);
});

After(function () {
  tempResult.restore();
});
