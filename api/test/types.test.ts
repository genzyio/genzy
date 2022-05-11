import { Nimble } from "nimbly-client";
import { BASIC_TYPES } from "../../shared/constants";
import { boolean, number, string, type } from "../../shared/decorators";

class Test1Service {
  async get() {}
}

class Test2Service {
  async get(
    @string one: string,
    @number two: number,
    @boolean three: boolean
  ) {}
}

class Example {
  @string test: string;
  @boolean bool: boolean;
  @number num: number;
}

class Model {
  @string test: string;
  @boolean bool: boolean;
  @number num: number;
  @type(Example) type: Example;
}


describe("Types", () => {
  it("should be undefined", async () => {
    const { test1Service } = new Nimble().of(Test1Service).services();

    expect(test1Service.$nimbly_config?.types).toBe(undefined);
  });

  it("should have param string", async () => {
    const { test2Service } = new Nimble().of(Test2Service).services();

    expect(test2Service.$nimbly_config?.types).not.toBeUndefined();
    expect(test2Service.$nimbly_config?.types.get).toContainEqual({
      index: 0,
      type: BASIC_TYPES.string,
    });
    expect(test2Service.$nimbly_config?.types.get).toContainEqual({
      index: 1,
      type: BASIC_TYPES.number,
    });
    expect(test2Service.$nimbly_config?.types.get).toContainEqual({
      index: 2,
      type: BASIC_TYPES.boolean,
    });
  });

  it("should support property in model", async () => {
    const model: any = new Model();

    expect(model.$nimbly_config?.types).not.toBe(undefined);
    expect(model.$nimbly_config?.types.test).toBe(BASIC_TYPES.string);
    expect(model.$nimbly_config?.types.bool).toBe(BASIC_TYPES.boolean);
    expect(model.$nimbly_config?.types.num).toBe(BASIC_TYPES.number);
  });

  it("should support type decorator", async () => {
    const model: any = new Model();
    const example: any = new Example();

    expect(model.$nimbly_config?.types).not.toBe(undefined);
    expect(model.$nimbly_config?.types.type).toStrictEqual(example.$nimbly_config.types);
  });
});
