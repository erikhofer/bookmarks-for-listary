const express = require('express')
const Fuse = require('fuse.js')
const fs = require('fs')

const app = express()
const port = 3000

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

const bookmarks = JSON.parse(fs.readFileSync('example/bookmarks.json', 'utf8'))

const fuse = new Fuse(bookmarks, fuseOptions);

app.get('/', (req, res) => {
  res.send('Bookmarks for Listary')
})

app.get('/suggest', (req, res) => {
  const query = req.query.q
  const result = fuse.search(query)
  res.json([query, result.map(r => r.item.name)])
})

app.get('/open', (req, res) => {
  const query = req.query.q
  const result = fuse.search(query)
  if (result.length === 0) {
    res.status(404).send('Not found')
    return
  }
  res.redirect(result[0].item.url)
})

app.listen(port, () => {
  console.log(`Bookmarks for Listary started on port ${port}`)
})

