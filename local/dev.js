const Assert = require('assert')
const Seneca = require('seneca')
const SenecaSearchMem = require('../search-mini')


async function run() {
  const seneca = Seneca()


  seneca.use(SenecaSearchMem, {
    search: {
      fields: ['name', 'extra'], // <~~ query-able fields

      storeFields: ['name', 'extra'], // <~~ return-able fields

      searchOptions: {}
    }
  })


  const docs = [
    { id: '1001', name: 'bob' },
    { id: '1002', name: 'foo', extra: 'bob' }
  ]

  for (const doc of docs) {
    const added = await seneca.post('sys:search,cmd:add', { doc })
    Assert(added.ok)
  }


  console.dir(await seneca.post('sys:search,cmd:search',
    { query: 'bob' }), { depth: 32 })


  const removed = await seneca.post('sys:search,cmd:remove',
    { id: '1002' })

  Assert(removed.ok)


  console.dir(await seneca.post('sys:search,cmd:search',
    { query: 'bob' }), { depth: 32 })


  return
}


run()
