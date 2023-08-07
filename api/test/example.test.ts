import { describe, expect, it, beforeEach, afterEach } from "@jest/globals";

describe("Test example", () => {
  
  beforeEach(async () => {
    // Do some logic before each test
  });

  afterEach(async () => {
    // Do some logic after each test
  });

  describe("Math tests", () => {
    it("Add two numbers", async () => {
      // Act
      const number1 = 2;
      const number2 = 3;

      // Act
      const sum = number1 + number2;

      // Assert

      expect(sum).toBe(5);
    });
  });

});
