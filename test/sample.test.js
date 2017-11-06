process.env.NODE_ENV = 'test';

const sinon = require('sinon');
const chai = require('chai');
const should = chai.should();

describe('Sample Test', () => {
  it('should pass', (done) => {
    const sum = 1 + 2;
    sum.should.eql(3);
    sum.should.not.eql(4);
    done();
  });
});

function greaterThanTwenty(num) {
  if (num > 20) return true;
  return false;
}

describe('Sample Sinon Stub', () => {
  it('should pass', (done) => {
    const greaterThanTwenty = sinon.stub().returns('something');
    greaterThanTwenty(0).should.eql('something');
    greaterThanTwenty(0).should.not.eql(false);
    done();
  });
});

function Person(givenName, familyName) {
  this.givenName = givenName;
  this.familyName = familyName;
}

Person.prototype.getFullName = function() {
  return `${this.givenName} ${this.familyName}`;
};

describe('Sample Sinon Stub Take 2', () => {
  it('should pass', (done) => {
    const name = new Person('Michael', 'Herman');
    name.getFullName().should.eql('Michael Herman');
    sinon.stub(Person.prototype, 'getFullName').returns('John Doe');
    name.getFullName().should.eql('John Doe');
    done();
  });
});
