const express = require('express');
const { obterContas, adicionarConta, atualizarConta, excluirConta, consultarSaldo, consultarExtrato, } = require('./controladores/contas');
const { depositar, sacar, transferir, } = require('./controladores/transacoes');

const rotas = express();


rotas.get('/contas', obterContas);
rotas.post('/contas', adicionarConta);
rotas.put('/contas/:numero_conta/usuario', atualizarConta);
rotas.delete('/contas/:numero_conta', excluirConta);
rotas.post('/transacoes/depositar', depositar);
rotas.post('/transacoes/sacar', sacar);
rotas.post('/transacoes/transferir', transferir);
rotas.get('/contas/saldo', consultarSaldo);
rotas.get('/contas/extrato', consultarExtrato);

module.exports = rotas;