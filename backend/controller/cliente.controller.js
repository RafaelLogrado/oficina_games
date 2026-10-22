const Cliente = require('../models/Cliente')

const cryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'secreto'

const cadastrar = async (req, res) => {
    const valores = req.body

    if(!valores.nome || !valores.senha || !valores.email || !valores.cpf || !valores.telefone){
        return res.status(401).json({message: "Todos os campos são obrigatórios!"})
    }
    try {
        valores.cpf = cryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()
        valores.senha = cryptoJS.AES.encrypt(valores.senha, CHAVE_SECRETA).toString()

        await Cliente.create(valores)

        return res.status(201).json({ message: 'Cliente cadastrado com sucesso!' })
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao cadastrar cliente!' })
    }
}

const listar = async (req,res) => {
    
    try{
        const dados = await Cliente.findAll()

        dados.forEach(element => {
            element.cpf = cryptoJS.AES.decrypt(element.cpf, CHAVE_SECRETA).toString(cryptoJS.enc.Utf8)

            element.senha = null
        })

        res.status(200).json(dados)
    }catch(err){
        console.error("Erro ao listar clientes!", err)
        res.status(500).json({ message: 'Erro ao listar clientes!' })
    }
}

const consultar = async (req,res) => {
    const valor = req.params.id

    try{
        const cliente = await Cliente.findByPk(valor)
        if(!cliente){
            return res.status(404).json({message: "Cliente não encontrado!"})
        }

        cliente.cpf = cryptoJS.AES.decrypt(cliente.cpf, CHAVE_SECRETA).toString(cryptoJS.enc.Utf8)
        cliente.senha = null

        res.status(200).json(cliente)
    }catch(err){
        console.error("Erro ao consultar cliente!", err)
        res.status(500).json({message: "Erro ao consultar cliente!"})
    }
}

const atualizar = async (req,res) => {
    const valor = req.params.id
    const valores = req.body

    if(!valores.nome || !valores.senha || !valores.email || !valores.cpf || !valores.telefone){
        return res.status(401).json({message: "Todos os campos são obrigatórios!"})
    }

    try{
        const cliente = await Cliente.findByPk(valor)
        if(!cliente){
            return res.status(404).json({message: "Cliente não encontrado!"})
        }

        valores.cpf = cryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()
        valores.senha = cryptoJS.AES.encrypt(valores.senha, CHAVE_SECRETA).toString()

        await cliente.update(valores)

        res.status(500).json({message: "Cliente atualizado com sucesso!"})

    }catch(err){
        console.error("Erro ao atualizar cliente!", err)
        res.status(500).json({message: "Erro ao atualizar cliente!"})
    }
}

const apagar = async (req,res) => {
    const valor = req.params.id

    try{
        const cliente = await Cliente.findByPk(valor)
        if(!cliente){
            return res.status(404).json({message: "Cliente não encontrado!"})
        }

        await cliente.destroy()

        res.status(200).json({message: "Cliente apagado com sucesso!"})
    }catch(err){
        console.error("Erro ao apagar cliente!", err)
        res.status(500).json({message: "Erro ao apagar cliente!"})
    }
}

module.exports = { cadastrar, listar, consultar, atualizar, apagar }