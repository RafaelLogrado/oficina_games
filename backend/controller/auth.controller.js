const Cliente = require('../models/Cliente')

const cryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'secreto'

const login = async (req,res) => {
    const valores = req.body

    if(!valores.email || !valores.senha){
        return res.status(401).json({message: "Preencha os campos"})
    }

    try{
        const cliente = await Cliente.findOne({where: {email: valores.email}})
        if(!cliente){
            return res.status(404).json({message: "Cliente não encontrado / Email incorreto!"})
        }

        const senhaBD = cryptoJS.AES.decrypt(cliente.senha, CHAVE_SECRETA).toString(cryptoJS.enc.Utf8)

        if(senhaBD !== valores.senha){
            return res.status(401).json({message: "Senha incorreta!"})
        }

        const noventaMin = 3600000 * 1.5 // 1,5 horas

        const payload = {
            codCliente: cliente.codCliente,
            nome: cliente.nome,
            expiraEm: Date.now() + noventaMin
        }

        

        const token = cryptoJS.AES.encrypt(JSON.stringify(payload), CHAVE_SECRETA).toString()

        res.status(200).json({
            message: "Login realizado com sucesso!",
            nome: cliente.nome,
            token: token
        })

    }catch(err){
        console.error("Erro ao autenticar usuário", err)
        res.status(500).json({message: "Erro ao autenticar usuário"})
    }
}

module.exports = { login }