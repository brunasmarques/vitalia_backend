import express from "express"
import cors from "cors"
import mysql from "mysql2"
import dotenv from "dotenv"

dotenv.config()

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = process.env

const app = express()
const port = 3333

app.use(cors())
app.use(express.json())

const database = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  connectionLimit: 10
})

app.get("/", (req, res) => {
  res.send("Backend online!")
})

app.post("/cadastrar", (req, res) => {
  const { name, email, password } = req.body

  const insertCommand = `
    INSERT INTO vitalia_usuarios (name, email, password)
    VALUES (?, ?, ?)
  `

  database.query(insertCommand, [name, email, password], (error) => {
    if (error) {
      console.log(error)
      return res.status(500).json({ error: "Erro ao cadastrar usuário" })
    }
    res.status(201).json({ message: "Usuário cadastrado com sucesso!" })
  })
})

app.post("/login", (req, res) => {
  const { email, password } = req.body

  const selectCommand = `
    SELECT * FROM vitalia_usuarios
    WHERE email = ? AND password = ?
  `

  database.query(selectCommand, [email, password], (error, results) => {
    if (error) {
      console.log(error)
      return res.status(500).json({ error: "Erro ao fazer login" })
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "E-mail ou senha incorretos" })
    }

    res.status(200).json({ message: "Login realizado com sucesso!" })
  })
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})
