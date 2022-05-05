import { ServiceMetaInfo } from '../../shared/types';
import { fileContentFrom } from '../src/generator';

describe('File Content Generation', () => {
  it('should generate an empty class', async () => {
    const meta = {
      name: 'Test',
      routes: []
    };
    const content = fileContentFrom(meta);
    expect(content).toContain(`export class ${meta.name} {`);
  });

  it('should generate a class with a method', async () => {
    const methodName = 'testSomething';
    const meta: ServiceMetaInfo = {
      name: 'Test',
      routes: [
        {
          httpMethod: 'GET',
          methodName,
          path: '/asdf'
        }
      ]
    };
    const content = fileContentFrom(meta);
    expect(content).toContain(`async ${methodName}() {}`);
  });

  it('should generate a method with params', async () => {
    const methodName = 'testSomething';
    const meta: ServiceMetaInfo = {
      name: 'Test',
      routes: [
        {
          httpMethod: 'GET',
          methodName,
          path: '/asdf',
          pathParams: ['groupId', 'id']
        }
      ]
    };
    const content = fileContentFrom(meta);
    expect(content).toContain(`async ${methodName}(groupId: any, id: any) {}`);
  });
});