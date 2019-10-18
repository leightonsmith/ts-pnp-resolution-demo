import { find } from 'lodash'
import { flow, orderBy } from 'lodash/fp'

export const testCompiler: () => number[] | undefined = () => {

  const test = [1,2,3];
  
  const ordered = flow(orderBy(v => v, 'desc'))(test);
  return ordered;

}
