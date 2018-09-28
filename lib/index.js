'use strict'
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i]
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]
        }
        return t
      }
    return __assign.apply(this, arguments)
  }
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value)
            }).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __generator =
  (this && this.__generator) ||
  function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
          if (t[0] & 1) throw t[1]
          return t[1]
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function() {
          return this
        }),
      g
    )
    function verb(n) {
      return function(v) {
        return step([n, v])
      }
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.')
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t
          if (((y = 0), t)) op = [op[0] & 2, t.value]
          switch (op[0]) {
            case 0:
            case 1:
              t = op
              break
            case 4:
              _.label++
              return { value: op[1], done: false }
            case 5:
              _.label++
              y = op[1]
              op = [0]
              continue
            case 7:
              op = _.ops.pop()
              _.trys.pop()
              continue
            default:
              if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                _ = 0
                continue
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1]
                break
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1]
                t = op
                break
              }
              if (t && _.label < t[2]) {
                _.label = t[2]
                _.ops.push(op)
                break
              }
              if (t[2]) _.ops.pop()
              _.trys.pop()
              continue
          }
          op = body.call(thisArg, _)
        } catch (e) {
          op = [6, e]
          y = 0
        } finally {
          f = t = 0
        }
      if (op[0] & 5) throw op[1]
      return { value: op[0] ? op[1] : void 0, done: true }
    }
  }
Object.defineProperty(exports, '__esModule', { value: true })
/**
 * The framework for transform anything
 * @author imcuttle
 */
var reduce = require('p-reduce')
var pify = require('pify')
var farm = require('@moyuyc/worker-farm')
var isEmp = require('lodash.isempty')
var VError = require('verror')
var cosconfig = require('cosmiconfig')
var json_buffer_1 = require('json-buffer')
var path_1 = require('path')
var runProcessor_1 = require('./runProcessor')
var fillWhenUndefined_1 = require('./fillWhenUndefined')
exports.explorer = cosconfig(require('../package.json').name)
function tranz(input, processors, opts) {
  if (processors === void 0) {
    processors = []
  }
  if (opts === void 0) {
    opts = {}
  }
  return __awaiter(this, void 0, void 0, function() {
    var processorCwd, _a, config, filepath, isEmpty, tConfig, run, runner, output
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          opts = __assign({ userc: true, cwd: process.cwd() }, opts)
          processorCwd = opts.cwd
          if (!opts.userc) return [3 /*break*/, 2]
          return [4 /*yield*/, exports.explorer.search(processorCwd)]
        case 1:
          ;(_a = _b.sent() || {}), (config = _a.config), (filepath = _a.filepath), (isEmpty = _a.isEmpty)
          if (!isEmpty && config) {
            tConfig = __assign({}, config)
            if (isEmp(processors)) {
              processorCwd = path_1.dirname(filepath)
              processors = tConfig.processors || []
            }
            delete tConfig.processors
            delete tConfig.userc
            delete tConfig.cwd
            opts = __assign({}, tConfig, opts)
          }
          _b.label = 2
        case 2:
          fillWhenUndefined_1.default(opts, { parallel: false })
          run = function(input, processor) {
            return runProcessor_1.default(input, processor, { cwd: processorCwd })
          }
          if (opts.parallel) {
            runner = farm(require.resolve('./child'))
            run = function(input, processor) {
              if (
                typeof processor === 'function' ||
                (Array.isArray(processor) &&
                  processor.some(function(x) {
                    return typeof x === 'function'
                  }))
              ) {
                throw new VError(
                  {
                    name: 'TranzError'
                  },
                  'Expected `processor` to be of type `string | [string, any]`, got `Function` or `Function[]` when parallel is enabled'
                )
              }
              return pify(runner)(json_buffer_1.stringify([input, processor, processorCwd])).then(function(string) {
                return json_buffer_1.parse(string)
              })
            }
          }
          return [
            4 /*yield*/,
            reduce(
              processors,
              function(input, processor) {
                return __awaiter(this, void 0, void 0, function() {
                  return __generator(this, function(_a) {
                    switch (_a.label) {
                      case 0:
                        return [4 /*yield*/, run(input, processor)]
                      case 1:
                        return [2 /*return*/, _a.sent()]
                    }
                  })
                })
              },
              input
            )
          ]
        case 3:
          output = _b.sent()
          if (opts.parallel) {
            farm.end(runner)
          }
          return [2 /*return*/, output]
      }
    })
  })
}
exports.default = tranz
//# sourceMappingURL=index.js.map
