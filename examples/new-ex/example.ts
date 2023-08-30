import {
  Body,
  boolean,
  Controller,
  Delete,
  Get,
  int,
  optional_test,
  Path,
  Post,
  Put,
  Query,
  Returns,
  ReturnsArrayOf,
  string,
  type,
} from "../../shared/decorators";

class Example {
  @string
  name: string;
  @int
  age: number;
  @optional_test(true)
  pera: number;
}

class TestClass {
  @optional_test(true)
  pera: number;
}

@Controller("/examples")
export class ExampleService {
  @Get()
  @ReturnsArrayOf(Example)
  async getAll(
    @Query("pageNumber") @int pageNumber: number,
    @Query("pageSize") @int pageSize: number,
  ): Promise<Example[]> {
    return [];
  }
  @Get()
  @ReturnsArrayOf(TestClass)
  async getAllTest(
    @Query("pageNumber") @int pageNumber: number,
    @Query("pageSize") @int pageSize: number,
  ): Promise<TestClass[]> {
    return [];
  }

  // @Get("/:id")
  // @Returns(Example)
  // async getById(
  //   @Query("includeDetails") @boolean includeDetails: boolean,
  //   @Path("id") @string id: string,
  // ): Promise<Example> {
  //   return;
  // }
  // @Post()
  // @Returns(Example)
  // async add(@Body() @type(Example) example: Example): Promise<Example> {
  //   return example;
  // }
  // @Put("/:id")
  // @Returns(Example)
  // async update(
  //   @Path("id") @string id: string,
  //   @Body() @type(Example) example: Example,
  // ): Promise<Example> {
  //   return example;
  // }
  // @Delete("/:id")
  // @Returns(Example)
  // async delete(@Path("id") @string id: string): Promise<Example> {
  //   return;
  // }
}
