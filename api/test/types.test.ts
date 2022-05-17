import { Nimble } from "nimbly-client";
import { BASIC_TYPES } from "../../shared/constants";
import { arrayOf, boolean, number, string, type } from "../../shared/decorators";

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

class Test3Service {
  async get(
    @string one: string,
    @number two: number,
    @boolean three: boolean,
    @type(Example) body: Example
  ) {}
}

class Test4Service {
  async get(
    @string one: string,
    @number two: number,
    @boolean three: boolean,
    @arrayOf(Example) body: Example[]
  ) {}
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
      isArray: false
    });
    expect(test2Service.$nimbly_config?.types.get).toContainEqual({
      index: 1,
      type: BASIC_TYPES.number,
      isArray: false
    });
    expect(test2Service.$nimbly_config?.types.get).toContainEqual({
      index: 2,
      type: BASIC_TYPES.boolean,
      isArray: false
    });
  });

  it("should support property in model", async () => {
    const model: any = new Model();

    expect(model.$nimbly_config?.types).not.toBe(undefined);
    expect(model.$nimbly_config?.types.test).toBe(BASIC_TYPES.string);
    expect(model.$nimbly_config?.types.bool).toBe(BASIC_TYPES.boolean);
    expect(model.$nimbly_config?.types.num).toBe(BASIC_TYPES.number);
  });

  it("should add meta info with @type", async () => {
    const model: any = new Model();

    expect(model.$nimbly_config?.types).not.toBe(undefined);
    expect(model.$nimbly_config?.types.type).not.toBe(undefined);
    expect(model.$nimbly_config?.types.type.$isArray).toBe(false);
    expect(model.$nimbly_config?.types.type.$typeName).toBe("Example");
  });

  it("should support type decorator", async () => {
    const model: any = new Model();
    const example: any = new Example();

    expect(model.$nimbly_config?.types).not.toBe(undefined);
    expect(model.$nimbly_config?.types.type).toStrictEqual({...example.$nimbly_config.types, $isArray: false, $typeName: 'Example'});
  });

  it("should support type decorator in the list of params", async () => {
    const { test3Service } = new Nimble().of(Test3Service).services();

    expect(test3Service.$nimbly_config?.types).not.toBeUndefined();
    expect(test3Service.$nimbly_config?.types.get).toContainEqual({
      index: 0,
      type: BASIC_TYPES.string,
      isArray: false
    });
    expect(test3Service.$nimbly_config?.types.get).toContainEqual({
      index: 1,
      type: BASIC_TYPES.number,
      isArray: false
    });
    expect(test3Service.$nimbly_config?.types.get).toContainEqual({
      index: 2,
      type: BASIC_TYPES.boolean,
      isArray: false
    });
    expect(test3Service.$nimbly_config?.types.get).toContainEqual({
      index: 3,
      type: {...(new Example() as any).$nimbly_config?.types, $isArray: false, $typeName: 'Example'},
      isArray: false
    });
  });

  it("should support array decorator in the list of params", async () => {
    const { test4Service } = new Nimble().of(Test4Service).services();

    expect(test4Service.$nimbly_config?.types).not.toBeUndefined();
    expect(test4Service.$nimbly_config?.types.get).toContainEqual({
      index: 0,
      type: BASIC_TYPES.string,
      isArray: false
    });
    expect(test4Service.$nimbly_config?.types.get).toContainEqual({
      index: 1,
      type: BASIC_TYPES.number,
      isArray: false
    });
    expect(test4Service.$nimbly_config?.types.get).toContainEqual({
      index: 2,
      type: BASIC_TYPES.boolean,
      isArray: false
    });
    expect(test4Service.$nimbly_config?.types.get).toContainEqual({
      index: 3,
      type: {
        ...(new Example() as any).$nimbly_config?.types,
        $isArray: true,
        $typeName: 'Example'
      },
      isArray: true
    });
  });
});
