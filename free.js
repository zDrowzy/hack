// bot_multi.js
const mineflayer = require('mineflayer');

// CONFIGURACIÓN
const HOST = process.argv[2] || 'play.ethernal.lat';
const PORT = parseInt(process.argv[3] || '25582');
const BASE_NAME = process.argv[4] || 'ElcasLcasXZ';
const AUTH = process.argv[5] || 'offline';
const VERSION = process.argv[6] || '1.20.4';

const REG_PASS = 'reiko14';
const TARGET_PLAYER = 'zDrowzy';
const BOT_COUNT = 3;

// Ítems que queremos soltar (nombres internos de Minecraft)
const ITEMS_TO_DROP = [
  'spawner',           // spawners
  'tripwire_hook',     // ganchos
  'bamboo',            // bambú
  'blaze_rod',         // vara de blaze
  'prismarine_shard'   // fragmento de prismarina
];

function createBot(username) {
  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: username,
    auth: AUTH,
    version: VERSION,
    // skipValidation: true,
  });

  bot.on('login', () => {
    console.log(`[${username}] Logueado en ${HOST}:${PORT} (versión ${VERSION})`);
  });

  bot.on('spawn', () => {
    console.log(`[${username}] Spawn detectado. Iniciando secuencia...`);

    // Registro (1 s)
    setTimeout(() => {
      bot.chat(`/register ${REG_PASS} ${REG_PASS}`);
      console.log(`[${username}] ✔ /register enviado.`);
    }, 1000);

    // Kit inicial (5 s)
    setTimeout(() => {
      bot.chat('/kit claim Kit_Inicio');
      console.log(`[${username}] ✔ /kit claim Kit_Inicio enviado (5 s).`);
    }, 5000);

    // TPA (8 s)
    setTimeout(() => {
      bot.chat(`/tpa ${TARGET_PLAYER}`);
      console.log(`[${username}] ✔ /tpa ${TARGET_PLAYER} enviado (8 s).`);
    }, 8000);

    // Soltar todos los ítems deseados (23 s)
    setTimeout(() => {
      const itemsToToss = bot.inventory.items().filter(item =>
        ITEMS_TO_DROP.includes(item.name)
      );

      if (itemsToToss.length === 0) {
        console.log(`[${username}] ❌ No se encontraron ítems para soltar. ¿Llegó el kit?`);
        return;
      }

      console.log(`[${username}] ✔ Soltando ${itemsToToss.length} stack(s) de ítems:`);
      itemsToToss.forEach(item => {
        console.log(`[${username}]    - ${item.name} x${item.count}`);
        bot.tossStack(item, (err) => {
          if (err) console.log(`[${username}] Error al soltar ${item.name}: ${err.message}`);
          else console.log(`[${username}]    -> Soltado ${item.count} ${item.name}(s).`);
        });
      });
    }, 23000);
  });

  bot.on('error', err => console.log(`[${username}] [ERROR] ${err.message}`));
  bot.on('end', reason => console.log(`[${username}] [DESCONECTADO] ${reason}`));
  bot.on('kicked', reason => console.log(`[${username}] [KICKEADO] ${reason}`));

  return bot;
}

// Iniciar múltiples bots
console.log(`Creando ${BOT_COUNT} bots con base "${BASE_NAME}"...`);
for (let i = 1; i <= BOT_COUNT; i++) {
  const username = `${BASE_NAME}_${i}`;
  setTimeout(() => {
    console.log(`[SISTEMA] Iniciando bot ${username}...`);
    createBot(username);
  }, (i - 1) * 2000);
}
