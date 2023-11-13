export function flatten(array: any[]): any[] {
  return array.reduce((acc, element) => {
    acc = acc.concat(element);
    if (element.items) {
      acc = acc.concat(flatten(element.items));
      element.items = [];
    }
    return acc;
  }, []);
}
