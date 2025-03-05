const express = require('express')
const Fuse = require('fuse.js')
const fs = require('fs')
var yargs = require('yargs/yargs')

const options = yargs(process.argv.slice(2))
	.usage('Usage: $0 --json [path to json]')
	.default({ port: 8080 })
	.demandOption(['json'])
	.parse()

const app = express()

const fuseOptions = {
	// isCaseSensitive: false,
	// includeScore: false,
	// ignoreDiacritics: false,
	// shouldSort: true,
	// includeMatches: false,
	// findAllMatches: false,
	// minMatchCharLength: 1,
	// location: 0,
	// threshold: 0.6,
	// distance: 100,
	// useExtendedSearch: false,
	// ignoreLocation: false,
	// ignoreFieldNorm: false,
	// fieldNormWeight: 1,
	keys: [
		"name",
		"url",
    "tags"
	]
}

console.log(`Loading bookmarks from ${options.json}`)
const bookmarks = JSON.parse(fs.readFileSync(options.json, 'utf8'))

const fuse = new Fuse(bookmarks, fuseOptions);

app.get('/', (req, res) => {
  res.send('Bookmarks for Listary')
})

app.get('/suggest', (req, res) => {
  const query = req.query.q
  const result = fuse.search(query, { limit: 5 })
  res.json([query, result.map(r => r.item.name)])
})

app.get('/open', (req, res) => {
  const query = req.query.q
  const result = fuse.search(query, { limit: 1 })
  if (result.length === 0) {
    res.status(404).send('Not found')
    return
  }
  res.redirect(result[0].item.url)
})

app.listen(options.port, () => {
  console.log(`Bookmarks for Listary started on port ${options.port}`)
})

