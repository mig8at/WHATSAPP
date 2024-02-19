import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const initClient = (id: string): Client => {
    const client = new Client({
        authStrategy: new LocalAuth({ clientId: id }),
        puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] },
    });

    client.on('qr', (qr) => {
        qrcode.generate(qr, { small: true });
    });

    client.on('message', async (message) => {
        if (message.body === '!ping') {
            await message.reply('pong');
        }
    });


    client.on('ready', async () => {
        console.log(`${id} is ready!`);
    });

    client.on('auth_failure', () => {
        console.log(`${id} auth failure`);
    });

    client.on('authenticated', data => {
        //console.error(`${id} authenticated`);
    });

    return client;
}

export const phoebe = initClient('phoebe');
export const chandler = initClient('chandler');
export const ross = initClient('ross');
export const rachel = initClient('rachel');
export const joey = initClient('joey');
export const monica = initClient('monica');


export const Bot = (u: 'phoebe' | 'chandler' | 'ross' | 'rachel' | 'joey' | 'monica'): Client => {
    if (u === 'phoebe') return phoebe;
    if (u === 'chandler') return chandler;
    if (u === 'ross') return ross;
    if (u === 'rachel') return rachel;
    if (u === 'joey') return joey;
    if (u === 'monica') return monica;
    return phoebe;
}