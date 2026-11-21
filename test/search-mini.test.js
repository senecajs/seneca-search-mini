const Seneca = require('seneca')
const Shared = require('./search-test')

const PluginValidator = require('seneca-plugin-validator')
const { Maintain } = require('@seneca/maintain')

const SearchMem = require('../search-mini')



test('validate', PluginValidator(SearchMem, module))

test('maintain', async () => {
  const exclude = []

  // check_default proves the default branch is main by looking for
  // [branch "main"] in .git/config. Only a branch checkout records that
  // section: a pull_request build checks out the merge ref, and the
  // publish build checks out a tag as a detached HEAD. Neither says
  // anything about what the default branch is, so skip rather than fail.
  if ('pull_request' === process.env.GITHUB_EVENT_NAME ||
      'tag' === process.env.GITHUB_REF_TYPE) {
    exclude.push('check_default')
  }

  // url_pkgjson locates package.json by comparing process.cwd() + '/package.json'
  // against a path found with Filehound. On Windows those are the same file
  // spelt with different separators, so the url is never read.
  if ('win32' === process.platform) {
    exclude.push('url_pkgjson')
  }

  await Maintain({ exclude })
})

describe('Compliance tests', () => {
  const seneca = make_seneca()

  beforeAll(done => {
    seneca.ready(done)
  })

  Shared.supports_add({ seneca })

  Shared.supports_search({ seneca })

  Shared.supports_remove({ seneca })

  Shared.remove({ seneca })

  Shared.add({ seneca })

  Shared.search({ seneca })
})


describe('Invalid messages', () => {
  const seneca = make_seneca()

  beforeAll(done => {
    seneca.ready(done)
  })

  test('add without doc', async () => {
    expect(await seneca.post('sys:search,cmd:add', {})).toEqual({
      ok: false,
      why: 'invalid-field',
      details: { path: ['doc'], why_exactly: 'required' }
    })
  })

  test('add without doc.id', async () => {
    expect(
      await seneca.post('sys:search,cmd:add', { doc: { lorem: 'lorem' } })
    ).toEqual({
      ok: false,
      why: 'invalid-field',
      details: { path: ['doc', 'id'], why_exactly: 'required' }
    })
  })

  test('search without query', async () => {
    expect(await seneca.post('sys:search,cmd:search', {})).toEqual({
      ok: false,
      why: 'invalid-field',
      details: { path: ['query'], why_exactly: 'required' }
    })
  })

  test('remove without id', async () => {
    expect(await seneca.post('sys:search,cmd:remove', {})).toEqual({
      ok: false,
      why: 'invalid-field',
      details: { path: ['id'], why_exactly: 'required' }
    })
  })

  test('add_all without docs', async () => {
    expect(await seneca.post('sys:search,cmd:add_all', {})).toEqual({
      ok: false,
      why: 'invalid-docs-argument',
      details: { path: ['docs'], why_exactly: 'required' }
    })
  })
})


test('search option is required', async () => {
  // A plugin that cannot load stops Seneca. debug.undead keeps this
  // instance alive, so that the error reaches the error handler.
  const errs = []
  const seneca = Seneca({ log: 'silent', debug: { undead: true } })
  seneca.error(err => errs.push(err))
  seneca.use(SearchMem)
  await seneca.ready()

  expect(errs.map(err => err.code)).toEqual(['invalid_search'])
  expect(seneca.has('sys:search,cmd:add')).toBe(false)
})


function make_seneca() {
  const si = Seneca({ log: 'test' })

  si.use(SearchMem, {
    search: {
      fields: ['lorem', 'ipsum'],
      storeFields: ['lorem', 'ipsum']
    }
  })

  return si
}
