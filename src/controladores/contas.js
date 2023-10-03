let bancodedados = require('../dados/bancodedados');

const obterContas = (req, res) => {
    const { senha } = req.query;

    if (senha !== 'Cubos123Bank') {
        return res.status(401).json({ mensagem: 'A senha do banco informada é inválida!' });
    }

    return res.json(bancodedados);
}

// adicionar conta - post 
const adicionarConta = async (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    if (!nome) {
        return res.status(400).json({ mensagem: 'O nome deve ser informado.' });
    }

    if (!cpf) {
        return res.status(400).json({ mensagem: 'O cpf deve ser informado.' });
    }

    if (!data_nascimento) {
        return res.status(400).json({ mensagem: 'A data de nascimento deve ser informada.' });
    }

    if (!telefone) {
        return res.status(400).json({ mensagem: 'O telefone deve ser informado.' });
    }

    if (!email) {
        return res.status(400).json({ mensagem: 'O email deve ser informado.' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha deve ser informada.' });
    }

    const contaExistente = bancodedados.contas.find((conta) => conta.cpf === cpf || conta.email === email);
    if (contaExistente) {
        return res.status(400).json({ mensagem: 'Já existe uma conta com o CPF ou email informado.' });
    }
    // gerar um numero unico e somar mais 1
    let numeroMaxConta = 0;
    for (const conta of bancodedados.contas) {
        if (conta.numero > numeroMaxConta) {
            numeroMaxConta = conta.numero;
        }
    }
    const numero_conta = numeroMaxConta + 1;

    const novaConta = {
        numero: numero_conta,
        saldo: 0,
        usuario: {
            numero_conta,
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    };

    bancodedados.contas.push(novaConta);

    return res.status(201).json({ message: 'Conta adicionada com sucesso.' });
}
// atualizar conta - put 
const atualizarConta = (req, res) => {
    const { numero_conta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    const conta = bancodedados.contas.find((c) => c.numero == numero_conta);
    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada.' });
    }

    if (!nome) {
        return res.status(400).json({ mensagem: 'O nome deve ser informado.' });
    }

    if (!cpf) {
        return res.status(400).json({ mensagem: 'O cpf deve ser informado.' });
    }

    if (!data_nascimento) {
        return res.status(400).json({ mensagem: 'A data de nascimento deve ser informada.' });
    }

    if (!telefone) {
        return res.status(400).json({ mensagem: 'O telefone deve ser informado.' });
    }

    if (!email) {
        return res.status(400).json({ mensagem: 'O email deve ser informado.' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha deve ser informada.' });
    }

    const contaDiferente = bancodedados.contas.filter((c) => c.numero != numero_conta);
    const cpfJaExiste = contaDiferente.some((conta) => conta.cpf === cpf);
    const emailJaExiste = contaDiferente.some((conta) => conta.email === email);

    console.log(cpfJaExiste, emailJaExiste);

    if (cpfJaExiste || emailJaExiste) {
        return res.status(400).json({ mensagem: 'Já existe uma conta com o CPF ou email informado.' });
    }

    conta.nome = nome;
    conta.cpf = cpf;
    conta.data_nascimento = data_nascimento;
    conta.telefone = telefone;
    conta.email = email;
    conta.senha = senha;

    return res.status(203).json({ message: 'Conta atualizada com sucesso.' });
}

//excluir conta
const excluirConta = (req, res) => {
    const { numero_conta } = req.params;

    const conta = bancodedados.contas.find((conta) => {
        return conta.numero == numero_conta;
    });

    if (!conta) {
        return res.status(404).json({ mensagem: 'A conta não foi encontrada.' });
    }

    const novoArrayContas = bancodedados.contas.filter((conta) => conta.numero != numero_conta);

    bancodedados.contas = novoArrayContas;

    return res.status(201).send({ message: `Conta ${numero_conta} excluída com sucesso.` });
}

//consultar saldo
function consultarSaldo(req, res) {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: 'O número da conta e a senha são obrigatórios!' });
    }

    const conta = bancodedados.contas.find((c) => c.numero === Number(numero_conta));

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' });
    }

    if (senha !== conta.usuario.senha) {
        return res.status(404).json({ mensagem: 'senha incorreta.' })
    }

    res.status(201).json({ saldo: conta.saldo });
}

function consultarExtrato(req, res) {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: 'O número da conta e a senha são obrigatórios!' });
    }

    const conta = bancodedados.contas.find((c) => c.numero === Number(numero_conta));

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' });
    }

    if (senha !== conta.usuario.senha) {
        return res.status(404).json({ mensagem: 'senha incorreta.' })
    }

    const dadoDeposito = bancodedados.depositos.filter((deposito) => deposito.numero_conta == numero_conta);

    const dadoSaque = bancodedados.saques.filter((saque) => saque.numero_conta == numero_conta);

    const dadoTransferenciaEnviada = bancodedados.transferencias.filter((transferencia) => transferencia.numero_conta_origem == numero_conta);

    const dadoTransferenciaRecebida = bancodedados.transferencias.filter((transferencia) => transferencia.numero_conta_destino == numero_conta);

    const extrato = {
        depositos: dadoDeposito,
        saques: dadoSaque,
        transferenciasEnviadas: dadoTransferenciaEnviada,
        transferenciasRecebidas: dadoTransferenciaRecebida,
    };

    res.status(201).json({ extrato });
}

module.exports = {
    obterContas,
    adicionarConta,
    atualizarConta,
    excluirConta,
    consultarSaldo,
    consultarExtrato
}
