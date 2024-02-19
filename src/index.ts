import express, { Express, Request, Response } from "express";
import { MessageMedia } from 'whatsapp-web.js';
import { Bot, chandler, joey, monica, phoebe, rachel, ross } from "./bots";
import bodyParser from 'body-parser';
import { upload, verifyToken } from "./functions";





const app: Express = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(verifyToken);


app.post('/:both/:id/audio', upload.single('audio'), (req, res) => {
    try {
        if (!req.file) {
            res.status(400).send('No file uploaded.');
            return;
        }
        const bot = Bot(req.params.both as any);
        const audioBase64 = req.file.buffer.toString('base64');
        const media = new MessageMedia('audio/mp3', audioBase64);
        bot.sendMessage(req.params.id as any, media, { sendAudioAsVoice: true });
        res.send('ok');
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post("/:both/:id/text", (req: Request, res: Response) => {
    try {
        const bot = Bot(req.params.both as any);
        console.log(req.body)
        const text = req.body.text;
        bot.sendMessage(req.params.id as any, text);
        res.send('ok');
    } catch (error) {
        res.status(500).send(error);
    }
});

const port = process.env.PORT || 3000
app.listen(port, async () => {
    await Promise.all([
        phoebe.initialize(),
        chandler.initialize(),
        ross.initialize(),
        rachel.initialize(),
        monica.initialize(),
        joey.initialize()
    ])
    console.log(`http://localhost:${port}`);
});