

Vue.component('qr-code', {
  props: ['text'],
  watch: {
    text: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$el.innerHTML = '';
        new QRCode(this.$el, {
          text: newVal,
          width: 270,
          height: 270
        });
      }
    }
  },
  mounted: function () {
    new QRCode(this.$el, {
      text: this.text,
      width: 270,
      height: 270
    });
  },
  template: '<div></div>'
});

new Vue({
  el: '#app',
  data: {
    socket: null,
    qr: '',
    example: {
      name: 'New Prompt',
      auth: '==+==',
      prompt: 'Translate incoming messages. [text]. respond in this format  { msg: "en|es <- depending on the language of the message",english, spanish } designed to output JSON'
    },
    prompt: {},
    prompts: []
  },
  mounted() {
    this.prompt = { ...this.example };
    this.socket = io();
    this.socket.on('qr', data => this.qr = data);
    this.socket.on('staus', data => console.log(data));
    this.socket.on('disconnect', () => this.qr = '');
    this.socket.on('connect', () => console.log('Conectado al servidor'));
    this.socket.on('prompts', data => this.prompts = data);
    this.socket.on('new-prompt', data => {
      this.prompts.push(data);
      this.prompt = { ...this.prompts[this.prompts.length - 1] };
    });
    this.socket.on('remove-prompt', id => {
      this.prompts = this.prompts.filter(p => p.id !== id);
      this.prompt = { ...this.example };
    });
    this.socket.on('update-prompt', prompt => {
      this.prompts = this.prompts.map(p => p.id === prompt.id ? prompt : p);
      this.prompt = { ...prompt };
    });

    this.reload()
  },
  methods: {

    removePrompt(id) {
      this.socket.emit('remove-prompt', id);
    },

    updatePrompt(prompt) {
      this.socket.emit('update-prompt', prompt);
    },

    savePrompt() {
      this.socket.emit('save-prompt', this.prompt);
    },

    reload() {
      M.AutoInit();

    }

  }
});