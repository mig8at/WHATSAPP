
// sqlite3.verbose();
// const db = new sqlite3.Database('./bots.sqlite3');

// const openai = new OpenAI({ apiKey: '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' });

// db.run(`
//       CREATE TABLE IF NOT EXISTS bots (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT NOT NULL,
//         phone TEXT NOT NULL UNIQUE,
//         photo TEXT NOT NULL,
//         qr TEXT DEFAULT NULL
//       )
//     `, (err) => {
//     if (err) {
//         console.error('Error al crear la tabla bots', err);
//     } else {
//         console.log('Tabla bots creada o ya existente.');
//     }
// });


// const app: Express = express();
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json())
// app.use(express.static('public'));

// app.use(verifyToken);
// const server = http.createServer(app);

// const io = new SocketIOServer(server);


// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, './public/index.html'));
// });


// app.post('/:both/:id/audio', upload.single('audio'), (req, res) => {
//     try {
//         if (!req.file) {
//             res.status(400).send('No file uploaded.');
//             return;
//         }
//         const bot = Bot(req.params.both as any);
//         const audioBase64 = req.file.buffer.toString('base64');
//         const media = new MessageMedia('audio/mp3', audioBase64);
//         bot.sendMessage(req.params.id as any, media, { sendAudioAsVoice: true });
//         res.send('ok');
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

// app.post("/:both/:id/text", (req: Request, res: Response) => {
//     try {
//         const bot = Bot(req.params.both as any);
//         console.log(req.body)
//         const text = req.body.text;
//         bot.sendMessage(req.params.id as any, text);
//         res.send('ok');
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

// const port = process.env.PORT || 3000

// io.on('connection', (socket) => {
//     console.log('Nuevo cliente conectado');

//     db.all('SELECT * FROM bots', (err, bots) => {
//         if (err) {
//             socket.emit('error', 'Error al obtener los bots');
//         } else {
//             socket.emit('bots', bots);
//         }
//     });



//     socket.on('add-boot', (phone: string) => {
//         console.log('Añadiendo bot', phone);


//         const client = new Client({
//             authStrategy: new LocalAuth({ clientId: `bot-${phone}`, dataPath: './auth' }),
//             puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] },
//         });



//         client.on('qr', (qr) => socket.emit('qr', qr));

//


//
//

//         client.on('ready', async () => {
//             const contact = await client.getContactById(`${phone}@c.us`);
//             const photo = await client.getProfilePicUrl(contact.id._serialized);
//             const name = contact.name || contact.pushname;

//             db.run('INSERT INTO bots (name, phone, photo) VALUES (?,?,?)', [name, phone, photo], (err) => {
//                 if (err) socket.emit('error', 'Error al crear el bot');
//                 else socket.emit('bot-added', { name, phone, photo });
//             });
//         });
//         client.initialize();
//     });


//     socket.on('disconnect', () => {
//         console.log('Cliente desconectado');
//     });
// });

// const valids = (phone: any) => {
//     console.log(phone);
//     switch (phone) {
//         case '12365145058@c.us': return true; //nata
//         case '573143357053@c.us': return true;
//         case '573228219997@c.us': return true;
//         case '573202881313@c.us': return true;
//         default: return false;
//     }
// }

// server.listen(port, async () => {
//     db.all('SELECT * FROM bots', (err, bots) => {
//         bots.forEach((bot: any) => {
//
//
//
//

//
//
//
//
//

//             client.on('message_create', async (m) => {
//                 if (typeof m.body != 'string') return;
//                 if (m.type !== 'chat') return;
//                 if (!valids(m.id.remote)) return;

//                 console.log(!m.body.includes('·'));

//                 if (!m.body.includes('·')) {
//                     
//                     
//                     
//                     
//                     
//                     
//                     
//                     
//                     
//                     

//                     

//                     
//                     
//                     
//                     
//                 }

//             });

//             client.on('message', async (m) => {
//                 if (typeof m.body != 'string') return;
//                 if (m.type !== 'chat') return;
//                 if (!valids(m.id.remote)) return;
//                 if (!m.body.includes('·')) return;

//                 const completion = await openai.chat.completions.create({
//                     messages: [{
//                         "role": "system",
//                         "content": `translate incoming messages. designed to output JSON`
//                     },
//                     { "role": "user", "content": `${m.body}. respond in this format  { msg: "en|es <- depending on the language of the message",english, spanish }` }
//                     ],
//                     model: "gpt-3.5-turbo-0125",
//                     response_format: { type: "json_object" },
//                 });

//                 const { msg, english, spanish } = JSON.parse(completion.choices[0].message.content ?? '{}') as { msg: string, english: string, spanish: string };

//                 console.log(msg, english, spanish);
//                 if (msg == 'es')
//                     client.sendMessage(m.id.remote, english + '·');
//                 else
//                     client.sendMessage(m.id.remote, spanish + '·');
//             });

//             client.on('ready', async () => {
//                 console.log(`bot-${bot.phone} ready`);
//                 db.run('UPDATE bots SET qr = NULL WHERE phone = ?', [bot.phone], (err) => {
//                     if (err) console.error(`Error al actualizar la qr del bot-${bot.phone}`, err);
//                 });
//             });


//             client.initialize();

//         });
//     });
//     console.log(`http://localhost:${port}`);
// });


// (async () => {
//     const completion = await openai.chat.completions.create({
//         messages: [{
//             "role": "system",
//             "content": `translate incoming messages. designed to output JSON`
//         },
//         { "role": "user", "content": `hola miguel. respond in this format  { msg: "en|es <- depending on the language of the message",english, spanish }` }
//         ],
//         model: "gpt-3.5-turbo-0125",
//         response_format: { type: "json_object" },
//     });

//     const { msg, english, spanish } = JSON.parse(completion.choices[0].message.content ?? '{}') as { msg: string, english: string, spanish: string };

//     if (msg !== 'es')

//     console.log(msg, english, spanish);

// })()


// <!DOCTYPE html>
// <html>

// <head>
//     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
//     <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
//     <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
//     <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
//     <script src="https://cdn.jsdelivr.net/npm/qrcodejs/qrcode.min.js"></script>
//     <script src="https://cdn.socket.io/4.0.0/socket.io.min.js"></script>


//     <style>
//         html,
//         body,
//         #app {
//             height: 100vh;
//         }

//         .btn-add {
//             position: fixed;
//             bottom: 25px;
//             right: 25px;
//         }


//         .qrcode {
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             padding: 2rem;
//             background-color: white;
//             border-radius: 10px;
//             width: 300px;
//             height: 300px;
//         }

//         .cont-qr {
//             display: flex;
//             justify-content: center;
//             align-items: center;
//         }

//         .new-bot {
//             display: grid;
//             grid-template-columns: 1fr 1fr;
//             align-items: center;
//             gap: 2rem;
//             padding: 2rem;
//         }

//         .cont-tel {
//             display: flex;
//             flex-direction: column;
//             gap: 1rem;
//         }

//         .collapsible li.disabled .collapsible-body {
//             display: none !important;
//         }
//     </style>
// </head>

// <body>


//     <div id="app">
//         <nav>
//             <div class="nav-wrapper teal">
//                 <a href="#" class="brand-logo">&nbsp; &nbsp; Whatsapp</a>
//                 <ul id="nav-mobile" class="right hide-on-med-and-down">

//                 </ul>
//             </div>
//         </nav>
//         <div class="container">

//             <ul class="collapsible popout">
//                 <li :class="phone.length == 12 && !bots.find(x=> x.phone == phone)?'': 'disabled'">
//                     <div class="collapsible-header">
//                         <div style="display: flex; flex-direction: column; margin-left: 1rem;">
//                             <span class="title">
//                                 <div class="input-field">
//                                     <i class="material-icons prefix">phone</i>
//                                     <input id="icon_telephone" type="tel" class="validate" v-model="phone">
//                                     <label for="icon_telephone">Telephone</label>
//                                 </div>
//                             </span>
//                         </div>
//                     </div>
//                     <div class="collapsible-body">
//                         <div v-if="phone.length == 12 && !bots.find(x=> x.phone == phone)" class="cont-qr">
//                             <div class="z-depth-2 qrcode" id="qrcode">
//                                 <a class="waves-effect waves-light btn" @click="addBoot()">AGREGAR BOT</a>
//                             </div>
//                         </div>

//                     </div>
//                 </li>


//                 <li v-for="bot in bots">
//                     <div class="collapsible-header">
//                         <img :src="bot.photo" alt="" class="circle" width="50">
//                         <div style="display: flex; flex-direction: column; margin-left: 1rem;">
//                             <span class="title">{{ bot.phone }}</span>
//                             <span>{{ bot.name }}</span>
//                         </div>
//                         <div style="align-self: center; width: 100%; display: flex; justify-content: end;">
//                             <div v-if="bot.qr != null"
//                                 style="width: 30px; height: 30px; border-radius: 50%; background-color: #F44336 ;">
//                             </div>
//                             <div v-else
//                                 style="width: 30px; height: 30px; border-radius: 50%; background-color: #2196F3;">
//                             </div>
//                         </div>
//                     </div>
//                     <div class="collapsible-body">
//                         <div v-if="bot.qr != null" class="cont-qr">
//                             <div class="z-depth-2 qrcode">
//                                 <qr-code :text="bot.qr"></qr-code>
//                             </div>
//                         </div>
//                     </div>
//                 </li>
//             </ul>
//         </div>

//     </div>

//     <script src="/index.js"></script>
// </body>

// </html>















// document.addEventListener('DOMContentLoaded', function () {
//     var elems = document.querySelectorAll('.modal');
//     var instances = M.Modal.init(elems, {});
//   });
  
//   document.addEventListener('DOMContentLoaded', function () {
//     var elems = document.querySelectorAll('.collapsible');
//     var instances = M.Collapsible.init(elems, {});
//   });
  
//   Vue.component('qr-code', {
//     props: ['text'],
//     mounted: function () {
//       new QRCode(this.$el, {
//         text: this.text,
//         width: 270,
//         height: 270
//       });
//     },
//     template: '<div></div>'
//   });
  
//   new Vue({
//     el: '#app',
//     data: {
//       socket: null,
//       phone: '573016992677',
//       qr: null
//     },
//     mounted() {
  
//       this.socket = io('http://localhost:3000');
  
//       this.socket.on('bots', (data) => {
//         this.bots = data
//         console.log('bots', this.bots);
//       });
  
//       this.socket.on('bot-added', (data) => {
//         this.bots.push(data);
//         document.getElementById('qrcode').innerHTML = '';
//       });
  
//       this.socket.on('qr', (text) => {
//         var typeNumber = 20;
//         var errorCorrectionLevel = 'H';
//         var qr = qrcode(typeNumber, errorCorrectionLevel);
//         qr.addData(text);
//         qr.make();
//         document.getElementById('qrcode').innerHTML = qr.createImgTag();
//       });
  
//       this.socket.on('disconnect', () => {
//         console.log('Desconectado del servidor');
//       });
  
  
  
//       this.socket.on('connect', () => {
//         console.log('Conectado al servidor');
//       });
//     },
//     methods: {
  
//       addBoot() {
//         console.log('Añadiendo boot', this.socket);
//         document.getElementById('qrcode').innerHTML = `<div class="preloader-wrapper small active">
//               <div class="spinner-layer spinner-green-only">
//                 <div class="circle-clipper left">
//                   <div class="circle"></div>
//                 </div><div class="gap-patch">
//                   <div class="circle"></div>
//                 </div><div class="circle-clipper right">
//                   <div class="circle"></div>
//                 </div>
//               </div>
//             </div>`;
//         this.socket.emit('add-boot', '573016992677');
//       },
  
//     }
//   });