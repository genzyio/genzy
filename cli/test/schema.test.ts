import { adoptTypeJS, getAllSubtypesFrom } from '../src/utils';

describe("Schema", () => {
  it("should ", async () => {
    const schema = {
      $typeName: 'Schema',
      $isArray: false,
      lala: 'string',
      po: 'number',
      complexs: {
        $typeName: 'Complex',
        $isArray: true,
        bool: 'boolean'
      }
    };

    const subtypes = [];
    const subtypeNames = [];
    getAllSubtypesFrom(schema, subtypes, subtypeNames, adoptTypeJS);

    expect(subtypeNames).toHaveLength(2);
    expect(subtypeNames[0]).toBe('Complex');
    expect(subtypeNames[1]).toBe('Schema');

    expect(subtypes).toHaveLength(2);
    expect(subtypes[0]).toStrictEqual({ bool: 'boolean' });
    expect(subtypes[1]).toStrictEqual({ lala: 'string', po: 'number', complexs: 'Complex[]' });
  });
});
