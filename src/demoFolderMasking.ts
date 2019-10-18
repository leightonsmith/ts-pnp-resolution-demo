import { sortBy } from 'lodash'
import { find } from 'lodash/fp'

export const testCompiler: () => number | undefined = () => {

  const test = [1,2,3];
  const found = find(v => v === 1, test);
  return found;

}
