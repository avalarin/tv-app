function clone(client) {
  return JSON.parse(JSON.stringify(client))
}

module.exports = { clone }
