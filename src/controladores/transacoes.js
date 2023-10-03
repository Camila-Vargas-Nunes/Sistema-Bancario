const bancodedados = require('../dados/bancodedados');
const moment = require('moment');

const now = new Date();
const momentDate = moment(now);
const formatDate = momentDate.format('YYYY-MM-DD HH:mm:ss');

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || !valor) {
        return res.status(400).json({ mensagem: 'O número da conta e o valor são obrigatórios!' });
    }

    const conta = bancodedados.contas.find((c) => c.numero == numero_conta);


    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada.' });
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'O valor do depósito deve ser maior que zero.' });
    }
    conta.saldo += valor;

    const deposito = {
        data: formatDate,
        numero_conta: numero_conta,
        valor: valor,
    };

    bancodedados.depositos.push(deposito);

    res.status(201).json(deposito);
}

// inicia o saque 
const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || valor === undefined || !senha) {
        return res.status(400).json({ mensagem: 'O número da conta, valor e senha são obrigatórios!' });
    }
    const conta = bancodedados.contas.find((c) => c.numero == numero_conta);

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada.' });
    }
    if (senha !== conta.usuario.senha) {
        return res.status(404).json({ mensagem: 'senha incorreta.' })
    }

    if (valor <= 0 || valor > conta.saldo) {
        return res.status(400).json({ mensagem: 'O valor não pode ser menor que zero ou maior que saldo disponivel.' });
    }
    conta.saldo -= valor;

    const saque = {
        data: formatDate,
        numero_conta: numero_conta,
        valor: valor,
    };

    bancodedados.saques.push(saque);

    res.status(201).json(saque);
}

// inidia a transferecia 

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || valor === undefined || !senha) {
        return res.status(400).json({ mensagem: 'O número da conta origem, numero conta destino , valor e senha são obrigatórios!' });
    }

    const conta_origem = bancodedados.contas.find((c) => c.numero == numero_conta_origem);
    const conta_destino = bancodedados.contas.find((c) => c.numero == numero_conta_destino);


    if (!conta_origem) {
        return res.status(404).json({ mensagem: 'Conta de origem não encontrada.' });
    }

    if (!conta_destino) {
        return res.status(404).json({ mensagem: 'Conta de destino não encontrada.' });
    }

    if (senha !== conta_origem.usuario.senha) {
        return res.status(404).json({ mensagem: 'senha incorreta.' })
    }


    if (valor <= 0 || valor > conta_origem.saldo) {
        return res.status(400).json({ mensagem: 'O valor não pode ser menor que zero ou maior que saldo disponivel.' });
    }
    conta_origem.saldo -= valor;
    conta_destino.saldo += valor;

    const transfere = {
        data: formatDate,
        numero_conta_origem: numero_conta_origem,
        numero_conta_destino: numero_conta_destino,
        valor: valor,
    };

    bancodedados.transferencias.push(transfere);

    res.status(201).json(transfere);
}

module.exports = {
    depositar,
    sacar,
    transferir,
}
