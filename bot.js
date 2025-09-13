const TelegramBot = require('node-telegram-bot-api');
const mercadopago = require('mercadopago');

// Token do seu bot do Telegram
const TELEGRAM_TOKEN = '6384139837:AAEwJgkYwXJZyJvGZyZJZyJvGZyZJZyJvGZy'; // substitua por seu token real se for diferente

// Token de produção do Mercado Pago
const MP_TOKEN = 'APP_USR-2300733662844142-091318-212a401f56e2524c527340593cddb019-206527225';

// Configura o Mercado Pago
mercadopago.configure({
  access_token: MP_TOKEN
});

// Cria o bot do Telegram
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Quando alguém enviar /pix, o bot responde com o link de pagamento
bot.onText(/\/pix/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const response = await mercadopago.preferences.create({
      items: [
        {
          title: 'Inscrição Torneio Standard',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: 9.90
        }
      ],
      back_urls: {
        success: 'https://bolados-tcg-bot.up.railway.app/sucesso',
        failure: 'https://bolados-tcg-bot.up.railway.app/erro',
        pending: 'https://bolados-tcg-bot.up.railway.app/pendente'
      },
      auto_return: 'approved'
    });

    bot.sendMessage(chatId, `💰 Link de pagamento:\n${response.body.init_point}`);
  } catch (error) {
    bot.sendMessage(chatId, '❌ Erro ao gerar pagamento. Tente novamente.');
    console.error(error);
  }
});
