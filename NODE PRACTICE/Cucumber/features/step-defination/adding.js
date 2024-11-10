const {Given,When,Then} = require('@cucumber/cucumber');
const {expect} = require('chai');
const sinon = require('chai');

Given('Numbers are provided', function () {
    sum1 = 8;
    sum2 = 10;
    return console.log("two numbers are "+sum1+" and "+sum2);
  });

  When('Sum up both numbers here', function () {
   sum = sum1+sum2;
    return console.log("two numbers are added");
  });

  Then('Display sum of the Numbers', function () {
   
    return console.log("sum of the two numbers are "+sum);
  });
