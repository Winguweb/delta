require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken');
const WebSocket = require("ws");


const app = express()
const port = 3001

const webSocketPort = 8080;
const wss = new WebSocket.Server({port: webSocketPort});
console.log(`[WebSocket] Starting WebSocket server on localhost:${webSocketPort}`);

app.use(express.json());

app.post('/onUpdate', authenticate, (req, res) => {
  res.send(`deviceId: ${req.body.deviceId} latitude: ${req.body.latitude} longitude: ${req.body.longitude}`);

  console.log(`${wss.clients.size}`);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(req.body));
    }
  });
})

app.post('/auth', (req, res) => {
  const {body} = req
  const {privateKey} = body

  if (privateKey && privateKey === process.env.PRIVATE_KEY) {
    const token = jwt.sign(
      {id: 'DeltaApp'},
      process.env.SECRET,
      {
        expiresIn: 60 * 60 * 24
      }
    )
    res.send({token})
  } else {
    res.status(401).json({
      error: 'Invalid credentials'
    })
  }
})

function authenticate(req, res, next) {
  const authorization = req.get('authorization')
  let token = ''

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  }
  try {
    jwt.verify(token, process.env.SECRET)
  } catch (e) {
    return res.status(401).json({error: 'token missing or invalid'})
  }

  next()
}


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

wss.on("connection", (ws, request) => {
  console.log('[WebSocket] has connected');
});