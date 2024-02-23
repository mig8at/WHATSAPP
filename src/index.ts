import express, { Express } from "express";
import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import bodyParser from 'body-parser';
import path from 'path';
import http from 'http';
import { Server as SocketIOServer } from "socket.io";
import { addAuthorized, db, getPromptAuth, getPromptPhone, getPrompts, removeAuthorized, removePrompt, savePrompt, updatePrompt } from "./db";
import { execPrompt } from "./gpt";

const app: Express = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.static('public'));

const server = http.createServer(app);
const io = new SocketIOServer(server);
let qrcode = '';
let msg: Message;

io.on('connection', async (socket) => {
    socket.emit('qr', qrcode);
    setInterval(() => socket.emit('qr', qrcode), 1000);

    socket.emit('prompts', await getPrompts());
    socket.on('save-prompt', async prpt => socket.emit('save-prompt', await savePrompt(prpt)));
    socket.on('update-prompt', async prpt => socket.emit('update-prompt', await updatePrompt(prpt)));
    socket.on('remove-prompt', async id => socket.emit('remove-prompt', await removePrompt(id)));

});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

server.listen(3000, async () => {

    const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] },
    });

    client.on('qr', (qr) => qrcode = qr);
    client.on('message', async (message) => msg = message);
    client.on('message_create', async (m) => {
        if (typeof m.body != 'string') return;
        if (m.type !== 'chat') return;
        if (m.body.includes('·')) return;


        let propt = await getPromptPhone(m.id.remote);
        if (propt == null) propt = await getPromptAuth(m.body);

        if (propt != null && m.body.includes(propt.auth)) {
            try {
                const res = await addAuthorized(m.id.remote, propt.id!);
                client.sendMessage(m.id.remote, res);
                return;
            } catch (error) {
                const res = await removeAuthorized(m.id.remote);
                client.sendMessage(m.id.remote, res);
                return;
            }
        }

        propt = await getPromptPhone(m.id.remote);
        if (propt == null) return;


        const res = await execPrompt(propt, m.body);
        client.sendMessage(m.id.remote, res);


        // id: {
        //     fromMe: true,
        //     remote: '573143357053@c.us',
        //     id: '980DFA11E5143B76585203541C96281E',
        //     _serialized: 'true_573143357053@c.us_980DFA11E5143B76585203541C96281E'
        //   },
        //   ack: 1,
        //   hasMedia: false,
        //   body: 'Hola co',
        //   type: 'chat',
        //   timestamp: 1708618976,
        //   from: '573016992677@c.us',
        //   to: '573143357053@c.us',
        //   author: '573016992677@c.us',
        //   deviceType: 'android',
    });
    client.on('ready', () => {
        qrcode = '';
        console.log('Client is ready!');
    });
    client.on('disconnected', () => qrcode = '');


    client.initialize();
    console.log(`http://localhost:3000`);
});