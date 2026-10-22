const Cliente = require("./Cliente")
const Console = require("./Console")
const Agendamento = require("./Agendamento")

Cliente.hasMany(Console, {
    as: "consoleCliente",
    foreignKey: 'codCliente',
    onDelete: 'CASCADE'
})

Console.belongsTo(Cliente, {
    as: "clienteConsole",
    foreignKey: 'codCliente'
})


Cliente.hasMany(Agendamento, {
    as: "agendamentoCliente",
    foreignKey: 'codCliente',
    onDelete: 'CASCADE'
})

Agendamento.belongsTo(Cliente, {
    as: "clienteAgendamento",
    foreignKey: 'codCliente'
})


Console.hasMany(Agendamento, {
    as: "agendamentoConsole",
    foreignKey: 'codConsole',
    onDelete: 'CASCADE'
})

Agendamento.belongsTo(Console, {
    as: "consoleAgendamento",
    foreignKey: 'codConsole'
})

module.exports = { Cliente, Console, Agendamento }