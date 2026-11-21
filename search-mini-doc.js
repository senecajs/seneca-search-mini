module.exports = {
  describe_search_add: {
    desc:
      'add a doc to your minisearch',
    examples: {
      '("sys:search,cmd:add", {id: 1, ...})': 'Describe actions matching at least `a:1,b:2`.'
    },
    reply_desc: {
    },
    validate: {},
  }
}
