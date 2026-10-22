const express = require('express')
const app = express()
const cors = require('cors')

const PORT = 3000
const hostname = 'localhost'
const conn = require('./db/conn')

require('./models/rel')

// Os controllers e middleware foram separados em um arquivo para cada.
const authController = require('./controller/auth.controller')
const clienteController = require('./controller/cliente.controller')
const consoleController = require('./controller/console.controller')
const agendamentoController = require('./controller/agendamento.controller')

const authMiddleware = require('./middleware/auth.middleware')

// ---------- Middleware ----------

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

// ---------- Rotas ----------

app.get('/', (req, res) => {
    res.status(200).json({ message: 'API PixelFix Rodando!' })
})

app.post('/cliente', clienteController.cadastrar)
app.post('/login', authController.login)


// Rotas privadas
app.use(authMiddleware)

app.get('/clientes', clienteController.listar)
app.get('/cliente/:id', clienteController.consultar)
app.put('/cliente/:id', clienteController.atualizar)
app.delete('/cliente/:id', clienteController.apagar)

app.post('/console', consoleController.cadastrar)
app.get('/console/:id', consoleController.consultar)
app.get('/consoles', consoleController.listar)

app.post('/agendamento', agendamentoController.cadastrar)
app.put('/agendamento/:id', agendamentoController.atualizar)
app.get('/agendamentos', agendamentoController.listar)

// ---------- Server ----------
conn.sync()
.then(() => {
    app.listen(PORT, hostname, () => {
        console.log(`Servidor rodando em http://${hostname}:${PORT}`)
    })
})
.catch((err) => {
    console.error('Erro ao conectar com o banco de dados!', err)
})