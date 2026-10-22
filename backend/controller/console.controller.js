const Console = require('../models/Console')
const Cliente = require('../models/Cliente')

const cryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'secreto'

const cadastrar = async (req, res) => {
    const valores = req.body

    if(!valores.codCliente || !valores.modelo || !valores.marca || !valores.numSerie){
        return res.status(401).json({message: "Todos os campos são obrigatórios!"})
    }

    try {
        const cliente = await Cliente.findByPk(valores.codCliente)
        if(!cliente){
            return res.status(404).json({message: "Cliente referenciado não encontrado!"})
        }

        valores.numSerie = cryptoJS.AES.encrypt(valores.numSerie, CHAVE_SECRETA).toString()

        const novoConsole = await Console.create(valores)
        res.status(201).json({ message: 'Console cadastrado!', console: novoConsole })
    } catch (err) {
        console.error('Erro ao cadastrar console!', err)
        res.status(500).json({ message:'Erro ao cadastrar console!'})
    }
}

const listar = async (req,res) => {
    
    try{
        const dados = await Console.findAll()

        dados.forEach(element => {
            element.numSerie = cryptoJS.AES.decrypt(element.numSerie, CHAVE_SECRETA).toString(cryptoJS.enc.Utf8)
        })

        res.json(200).json(dados)
    }catch(err){
        console.error("Erro ao listar consoles!", err)
        res.status(500).json({ message: 'Erro ao listar consoles!' })
    }
}

const consultar = async (req, res) => {
    const valor = req.params.id

    try{
        const dado = await Console.findByPk(valor)
        if(!dado){
            return res.status(404).json({message: "Console não encontrado!"})
        }

        dado.numSerie = cryptoJS.AES.decrypt(dado.numSerie, CHAVE_SECRETA).toString(cryptoJS.enc.Utf8)

        res.status(200).json(dado)
    }catch(err){
        console.error("Erro ao consultar console!", err)
        res.status(500).json({ message: 'Erro ao consultar console!' })
    }
}

module.exports = { cadastrar, listar, consultar }