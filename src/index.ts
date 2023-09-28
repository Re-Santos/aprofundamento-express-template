import express, { Request, Response } from 'express'
import cors from 'cors'
import { accounts } from './database'
import { ACCOUNT_TYPE } from './types'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!")
})

app.get("/accounts", (req: Request, res: Response) => {
    res.send(accounts)
})

app.get ("/accounts/:id",(req:Request, res:Response)=>{
    const id = req.params.id
    //encontrando um item pelo id, dentro de java script(find=busca exatamente o que vc quer, filter=volta um array de possibilidades)
    const result = accounts.find((account)=>account.id ===id)
    res.status(200).send(result)
})

app.delete("/accounts/:id", (req:Request, res:Response)=>{
    const id = req.params.id
    const indexToDelete = accounts.findIndex((account)=> account.id ===id)
     //0,1,2,3,4, ... =>É encontrado algo
     //-1 não é encontrado
    if (indexToDelete !== -1){
        accounts.splice(indexToDelete,1)
    }else{
        console.log("não há itens para deletar")
    }
    res.status(200).send({message:"O item foi deletado com sucesso"})
})

app.put("/accounts/:id", (req:Request, res:Response)=>{
    const id = req.params.id
    const newOwnerName = req.body.ownerName as string | undefined
    const newBalance =  req.body.balance as number |undefined
    const newType = req.body.type as ACCOUNT_TYPE |undefined

    const account = accounts.find((account) => account.id === id)
    //para verificar poderia fazer um if else, mas ficaria muito longo.
    //a verificação a seguir é se newOwnerName existir substitui, caso não mantenha como está
    account.ownerName = newOwnerName || account.ownerName
    account.type = newType || account.type
    //balance é diferente, pq zero é um número, na forma anterior estaria negando a opção de ser número
    //vamos usar a função isNaN dentro de um ternário
    account.balance =  isNaN(newBalance)?account.balance : newBalance
    //mesma coisa de cima
    // if(typeof newBalance === "undefined"){
    // account.balance = account.balance
    //}else if (typeof newBalance === "number"){
    // account.balance = newBalance
    //}

    res.status(200).send({message:"o item foi alterado com sucesso"})
})