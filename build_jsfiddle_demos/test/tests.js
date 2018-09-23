const assert = require("assert");
const chai = require("chai");
const expect = chai.expect;

describe("smoke test - assert", function() {
  it("checks equality assert", function() {
    assert.equal(true, true);
  });

  it("checks equality - expect", function() {
    expect(true).to.be.true;
  });
});

