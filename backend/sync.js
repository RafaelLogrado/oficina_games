const conn = require('./db/conn')
const { Cliente, Console, Agendamento } = require('./models/rel')

async function syncDatabase(){
    try{
        await conn.sync({force: true})
        console.log("Tabelas sincronizadas!")
    }catch(err){
        console.error("Erro ao sincronizar tabelas!", err)
    }finally{
        await conn.close()
        console.log("Sincronização fechada!")
    }
}

syncDatabase()