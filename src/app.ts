import config from "./config"
import express from "express"
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen( () => {
  console.log(`Example app listening on port ${config.port}`)
})