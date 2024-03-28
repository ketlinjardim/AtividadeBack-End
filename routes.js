import express from "express";
import sql from 'mssql'
import { sqlConfig } from "./server.js";

const pool = new sql.ConnectionPool(sqlConfig);
await pool.connect();
const routes = express.Router();

routes.get('/', async (req, res) => {
    try {
      const { recordset } = await pool.query`select * from chamados`;
      return res.status(200).json(recordset);
    } catch {
      return res.status(501).json('Erro ao buscar os chamados');
    }
  });


routes.get('/chamado/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        const { recordset } = await pool.query`SELECT * FROM chamados WHERE id = ${id}`;
        return res.json(recordset[0]);//recordset para retornar um unico valor
    } catch {
      
        return res.status(500).json('Erro ao buscar o chamado');
    }
});



routes.post('/chamado/novo', async (req, res) => {
    try {
      const {nome, descricao, data } = req.body;
      await pool.query`insert into chamados values (${nome}, ${descricao}, ${data})`;
      return res.status(200).json('Chamado cadastrado com sucesso');
    } catch(error) {
        console.log(error)
      return res.status(501).json('Erro ao cadastrar o chamado');
    }
  });


export default routes



