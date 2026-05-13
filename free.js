const mineflayer = require('mineflayer');

// CONFIG
const HOST = process.argv[2] || 'play.ethernal.lat';
const PORT = parseInt(process.argv[3] || '25582');
const BASE_NAME = process.argv[4] || 'ElcasLcasXZ';
const AUTH = process.argv[5] || 'offline';
const VERSION = process.argv[6] || '1.20.4';

const PASSWORD = 'reiko14';
const BOT_COUNT = 3;

// Items a tirar
const ITEMS_TO_DROP = [
  'spawner',
  'tripwire_hook',
  'bamboo',
  'blaze_rod'
];

function createBot(username) {
  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username,
    auth: AUTH,
    version: VERSION
  });

  bot.on('login', () => {
    console.log(`[${username}] Conectado.`);
  });

  bot.on('spawn', () => {
    console.log(`[${username}] Spawn detectado.`);

    // 0s -> REGISTER
    bot.chat(`/register ${PASSWORD} ${PASSWORD}`);
    console.log(`[${username}] ✔ Register enviado`);

    // +2s -> LOGIN
    setTimeout(() => {
      bot.chat(`/login ${PASSWORD}`);
      console.log(`[${username}] ✔ Login enviado`);
    }, 2000);

    // +4s -> KIT
    setTimeout(() => {
      bot.chat('/kit claim Kit_Inicio');
      console.log(`[${username}] ✔ Kit enviado`);
    }, 4000);

    // +7s -> TIRAR ITEMS
    setTimeout(() => {
      const items = bot.inventory.items().filter(item =>
        ITEMS_TO_DROP.includes(item.name)
      );

      if (items.length === 0) {
        console.log(`[${username}] ❌ No hay items para tirar`);
        return;
      }

      console.log(`[${username}] ✔ Tirando items...`);

      items.forEach(item => {
        bot.tossStack(item, err => {
          if (err) {
            console.log(`[${username}] Error soltando ${item.name}: ${err.message}`);
          } else {
            console.log(`[${username}] ✔ Soltado ${item.name} x${item.count}`);
          }
        });
      });
    }, 7000);
  });

  bot.on('error', err => {
    console.log(`[${username}] ERROR: ${err.message}`);
  });

  bot.on('end', reason => {
    console.log(`[${username}] DESCONECTADO: ${reason}`);
  });

  bot.on('kicked', reason => {
    console.log(`[${username}] KICKEADO: ${reason}`);
  });
}

// Crear bots
console.log(`Iniciando ${BOT_COUNT} bots...`);

for (let i = 1; i <= BOT_COUNT; i++) {
  const username = `${BASE_NAME}_${i}`;

  setTimeout(() => {
    createBot(username);
  }, i * 2000);
}
