/**
 * @file child
 * @author Cuttle Cong
 * @date 2018/9/28
 *
 */

import { stringify, parse } from 'json-buffer'
import runProcessor from './runProcessor'

module.exports = async function(parseAbleString: string, callback) {
  try {
    const [input, processor, cwd] = parse(parseAbleString)
    const output = await runProcessor(input, processor, { cwd })
    callback(null, stringify(output))
  } catch (e) {
    callback(e)
  }
}
