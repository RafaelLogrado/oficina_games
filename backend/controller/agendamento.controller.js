const Agendamento = require('../models/Agendamento')
const Console = require('../models/Console')
const Cliente = require('../models/Cliente')

const cadastrar = async (req, res) => {
    const valores = req.body

    if(!valores.codCliente || !valores.codConsole || !valores.data || !valores.hora || !valores.tipoServico){
        return res.status(401).json({message: "Todos os campos são obrigatórios!"})
    }
    try {
        const cliente = Cliente.findByPk(valores.codCliente)
        if(!cliente){
            return res.status(404).json({message: "Cliente referenciado não existe!"})
        }
        
        const console = Console.findByPk(valores.codConsole)
        if(!console){
            return res.status(404).json({message: "Console referenciado não existe!"})
        }

        const novoAgendamento = await Agendamento.create(valores)
        res.status(201).json({ message: 'Agendamento cadastrado!', agendamento: novoAgendamento })
    } catch (err) {
        console.error("Erro ao cadastrar agendamento!", err)
        res.status(500).json({ message: 'Erro ao cadastrar agendamento!' })
    }
}

const atualizar = async (req,res) => {
    const valores = req.body
    const valor = req.params.id

    if(!valores.codCliente || !valores.codConsole || !valores.data || !valores.hora || !valores.tipoServico){
        return res.status(401).json({message: "Todos os campos são obrigatórios!"})
    }

    try{
        const cliente = Cliente.findByPk(valores.codCliente)
        if(!cliente){
            return res.status(404).json({message: "Cliente referenciado não existe!"})
        }
        
        const console = Console.findByPk(valores.codConsole)
        if(!console){
            return res.status(404).json({message: "Console referenciado não existe!"})
        }

        const agendamento = await Agendamento.findByPk(valor)
        if(!agendamento){
            return res.status(404).json({message: "Agendamento não encontrado!"})
        }

        await agendamento.update(valores)
        res.status(200).json({message: "Agendamento atualizado com sucesso!"})
    }catch(err){
        console.error("Erro ao atualizar agendamento!", err)
        res.status(500).json({message: "Erro ao atualizar agendamento!"})
    }
}

const listar = async (req,res) => {
    
    try{
        const dados = await Agendamento.findAll({
            order: [['data', 'ASC']]
        })

        res.status(200).json(dados)

    }catch(err){
        console.error("Erro ao listar agendamentos!", err)
        res.status(500).json({message: "Erro ao listar agendamentos!"})
    }
}

module.exports = { cadastrar, atualizar, listar }