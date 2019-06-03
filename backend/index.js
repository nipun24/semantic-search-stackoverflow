const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const PORT = 3001

app.post('/', (req, res) => {
    console.log(req.body)
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))