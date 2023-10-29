import { GenzyContainer } from "../src";
import { BASIC_TYPES, GenericType } from "../../shared/constants";
import {
  Controller,
  Returns,
  arrayOf,
  boolean,
  int,
  string,
  type,
  intArray,
  stringArray,
} from "../../shared/decorators";
import type { BasicType } from "../../shared/types";

class Test1Service {
  async get() {}
}

class Test2Service {
  async get(
    @string() one: string,
    @intArray({ optional: true }) two: number,
    @boolean() three: boolean
  ) {}
}

class Example {
  @string() test: string;
  @stringArray() tests: string[];
  @boolean() bool: boolean;
  @int() num: number;
}

class Model {
  @string() test: string;
  @boolean() bool: boolean;
  @int() num: number;
  @intArray() nums: number[];
  @type(Example) type: Example;
}

class Test3Service {
  async get(
    @string() one: string,
    @int() two: number,
    @boolean() three: boolean,
    @type(Example) body: Example
  ) {}
}

class Test4Service {
  async get(
    @string() one: string,
    @int() two: number,
    @boolean() three: boolean,
    @arrayOf(Example) body: Example[]
  ) {}
}

@Controller("/test-5", Example)
class Test5Service {
  @Returns(GenericType)
  async get(
    @string() one: string,
    @int() two: number,
    @boolean() three: boolean,
    @arrayOf(GenericType) body: Example[],
    @type(GenericType) test: Example
  ) {}
}

function getBasicNonArrayType(
  type: BasicType["type"],
  optional = false,
  array = false
): BasicType {
  return {
    type,
    $isOptional: optional,
    $isArray: array,
  };
}

describe("Types", () => {
  it("should be undefined", async () => {
    const { test1Service } = new GenzyContainer()
      .addLocalService(Test1Service)
      .getAllServices();

    expect(test1Service.$genzy_config?.types).toBe(undefined);
  });

  it("should have param string", async () => {
    const { test2Service } = new GenzyContainer()
      .addLocalService(Test2Service)
      .getAllServices();

    expect(test2Service.$genzy_config?.actions?.get).not.toBeUndefined();
    expect(test2Service.$genzy_config.actions.get.params[0].type).toStrictEqual(
      getBasicNonArrayType(BASIC_TYPES.string)
    );
    expect(test2Service.$genzy_config.actions.get.params[1].type).toStrictEqual(
      getBasicNonArrayType(BASIC_TYPES.int, true, true)
    );
    expect(test2Service.$genzy_config.actions.get.params[2].type).toStrictEqual(
      getBasicNonArrayType(BASIC_TYPES.boolean)
    );
  });

  it("should support property in model", async () => {
    const model: any = new Model();

    expect(model.$genzy_config?.types).not.toBe(undefined);
    expect(model.$genzy_config?.types.test).toStrictEqual(
      getBasicNonArrayType(BASIC_TYPES.string)
    );
    expect(model.$genzy_config?.types.bool).toStrictEqual(
      getBasicNonArrayType(BASIC_TYPES.boolean)
    );
    expect(model.$genzy_config?.types.num).toStrictEqual(
      getBasicNonArrayType(BASIC_TYPES.int)
    );
    expect(model.$genzy_config?.types.nums).toStrictEqual(
      getBasicNonArrayType(BASIC_TYPES.int, false, true)
    );
  });

  it("should add meta info with @type", async () => {
    const model: any = new Model();

    expect(model.$genzy_config?.types).not.toBe(undefined);
    expect(model.$genzy_config?.types.type).not.toBe(undefined);
    expect(model.$genzy_config?.types.type.$isArray).toBe(false);
    expect(model.$genzy_config?.types.type.$typeName).toBe("Example");
  });

  it("should support type decorator", async () => {
    const model: any = new Model();
    const example: any = new Example();

    expect(model.$genzy_config?.types).not.toBe(undefined);
    expect(model.$genzy_config?.types.type).toStrictEqual({
      ...example.$genzy_config.types,
      $isArray: false,
      $typeName: "Example",
    });
  });

  it("should support type decorator in the list addLocalService params", async () => {
    const { test3Service } = new GenzyContainer()
      .addLocalService(Test3Service)
      .getAllServices();

    expect(test3Service.$genzy_config?.actions?.get).not.toBeUndefined();
    expect(test3Service.$genzy_config.actions.get.params[0].type).toStrictEqual(
      getBasicNonArrayType(BASIC_TYPES.string)
    );
    expect(test3Service.$genzy_config.actions.get.params[1].type).toStrictEqual(
      getBasicNonArrayType(BASIC_TYPES.int)
    );
    expect(test3Service.$genzy_config.actions.get.params[2].type).toStrictEqual(
      getBasicNonArrayType(BASIC_TYPES.boolean)
    );
    expect(test3Service.$genzy_config.actions.get.params[3].type).toStrictEqual(
      {
        $isOptional: false,
        $isArray: false,
        $typeName: "Example",
      }
    );
    expect(test3Service.$genzy_config.types.Example).toStrictEqual({
      ...(new Example() as any).$genzy_config?.types,
    });
  });

  it("should support array decorator in the list addLocalService params", async () => {
    const { test4Service } = new GenzyContainer()
      .addLocalService(Test4Service)
      .getAllServices();

    expect(test4Service.$genzy_config?.actions?.get).not.toBeUndefined();
    expect(test4Service.$genzy_config.actions.get.params[0].type).toStrictEqual(
      getBasicNonArrayType(BASIC_TYPES.string)
    );
    expect(test4Service.$genzy_config.actions.get.params[1].type).toStrictEqual(
      getBasicNonArrayType(BASIC_TYPES.int)
    );
    expect(test4Service.$genzy_config.actions.get.params[2].type).toStrictEqual(
      getBasicNonArrayType(BASIC_TYPES.boolean)
    );
    expect(test4Service.$genzy_config.actions.get.params[3].type).toStrictEqual(
      {
        $isOptional: false,
        $isArray: true,
        $typeName: "Example",
      }
    );
    expect(test4Service.$genzy_config.types.Example).toStrictEqual({
      ...(new Example() as any).$genzy_config?.types,
    });
  });

  it("should support root type decorator in @Controller", async () => {
    const { test5Service } = new GenzyContainer()
      .addLocalService(Test5Service)
      .getAllServices();

    expect(test5Service.$genzy_config?.actions?.get).not.toBeUndefined();
    expect(test5Service.$genzy_config.actions.get.params[0].type).toStrictEqual(
      getBasicNonArrayType(BASIC_TYPES.string)
    );
    expect(test5Service.$genzy_config.actions.get.params[1].type).toStrictEqual(
      getBasicNonArrayType(BASIC_TYPES.int)
    );
    expect(test5Service.$genzy_config.actions.get.params[2].type).toStrictEqual(
      getBasicNonArrayType(BASIC_TYPES.boolean)
    );
    expect(test5Service.$genzy_config.actions.get.params[3].type).toStrictEqual(
      {
        $isOptional: false,
        $isArray: true,
        $typeName: "Example",
      }
    );
    expect(test5Service.$genzy_config.actions.get.params[4].type).toStrictEqual(
      {
        $isOptional: false,
        $isArray: false,
        $typeName: "Example",
      }
    );
    expect(test5Service.$genzy_config.actions.get.result).toStrictEqual({
      $isArray: false,
      $typeName: "Example",
    });
    expect(test5Service.$genzy_config.types.Example).toStrictEqual({
      ...(new Example() as any).$genzy_config?.types,
    });
  });
});
