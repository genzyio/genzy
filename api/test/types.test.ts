import { Nimble } from "nimbly-client";
import { BASIC_TYPES } from "../../shared/constants";
import { arrayOf, boolean, int, string, type } from "../../shared/decorators";

class Test1Service {
  async get() {}
}

class Test2Service {
  async get(
    @string one: string,
    @int two: number,
    @boolean three: boolean
  ) {}
}

class Example {
  @string test: string;
  @boolean bool: boolean;
  @int num: number;
}

class Model {
  @string test: string;
  @boolean bool: boolean;
  @int num: number;
  @type(Example) type: Example;
}

class Test3Service {
  async get(
    @string one: string,
    @int two: number,
    @boolean three: boolean,
    @type(Example) body: Example
  ) {}
}

class Test4Service {
  async get(
    @string one: string,
    @int two: number,
    @boolean three: boolean,
    @arrayOf(Example) body: Example[]
  ) {}
}


describe("Types", () => {
  it("should be undefined", async () => {
    const { test1Service } = new Nimble().addLocalService(Test1Service).getAllServices();

    expect(test1Service.$nimbly_config?.types).toBe(undefined);
  });

  it("should have param string", async () => {
    const { test2Service } = new Nimble().addLocalService(Test2Service).getAllServices();

    expect(test2Service.$nimbly_config?.get).not.toBeUndefined();
    expect(test2Service.$nimbly_config.get.params[0].type).toBe(BASIC_TYPES.string);
    expect(test2Service.$nimbly_config.get.params[1].type).toBe(BASIC_TYPES.int);
    expect(test2Service.$nimbly_config.get.params[2].type).toBe(BASIC_TYPES.boolean);
  });

  it("should support property in model", async () => {
    const model: any = new Model();

    expect(model.$nimbly_config?.types).not.toBe(undefined);
    expect(model.$nimbly_config?.types.test).toBe(BASIC_TYPES.string);
    expect(model.$nimbly_config?.types.bool).toBe(BASIC_TYPES.boolean);
    expect(model.$nimbly_config?.types.num).toBe(BASIC_TYPES.int);
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

  it("should support type decorator in the list addLocalService params", async () => {
    const { test3Service } = new Nimble().addLocalService(Test3Service).getAllServices();

    expect(test3Service.$nimbly_config?.get).not.toBeUndefined();
    expect(test3Service.$nimbly_config.get.params[0].type).toBe(BASIC_TYPES.string);
    expect(test3Service.$nimbly_config.get.params[1].type).toBe(BASIC_TYPES.int);
    expect(test3Service.$nimbly_config.get.params[2].type).toBe(BASIC_TYPES.boolean);
    expect(test3Service.$nimbly_config.get.params[3].type)
      .toStrictEqual({...(new Example() as any).$nimbly_config?.types, $isArray: false, $typeName: 'Example'});
  });

  it("should support array decorator in the list addLocalService params", async () => {
    const { test4Service } = new Nimble().addLocalService(Test4Service).getAllServices();

    expect(test4Service.$nimbly_config?.get).not.toBeUndefined();
    expect(test4Service.$nimbly_config.get.params[0].type).toBe(BASIC_TYPES.string);
    expect(test4Service.$nimbly_config.get.params[1].type).toBe(BASIC_TYPES.int);
    expect(test4Service.$nimbly_config.get.params[2].type).toBe(BASIC_TYPES.boolean);
    expect(test4Service.$nimbly_config.get.params[3].type)
      .toStrictEqual({
        ...(new Example() as any).$nimbly_config?.types,
        $isArray: true,
        $typeName: 'Example'
      });
  });
});
