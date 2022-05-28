import { getPathParamTypes } from '../../shared/functions';
import { QueryParamDefinition, Type } from '../../shared/types';


describe('Utils', () => {

  it('should return correct path param types', async () => {
    const pathParams = ["test", "test2"];
    const queryParamDefinitions: QueryParamDefinition[] = [ { index: 0, name: 'lala' }, { index: 2, name: 'asd'} ];
    const methodParamTypes: Type[] = [ 'string', 'boolean', 'int', 'string' ];
    const pathParamTypes = getPathParamTypes(pathParams, queryParamDefinitions, methodParamTypes);
    expect(pathParamTypes).toStrictEqual(['boolean', 'string']);
  });
  
});