

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
      model: "gpt-3.5-turbo-0125",
      auth: '==+==',
      prompt: `Give me the translation of the following message.\nIf it is in English, will you give me the Spanish translation?\nIf it is in Spanish, you will give me the English translation. and only the translation. don't answer questions. the message is:`
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

    this.socket.on('save-prompt', data => {
      this.prompts.push(data);
      this.prompt = { ...this.prompts[this.prompts.length - 1] };
    });

    this.socket.on('update-prompt', prompt => {
      this.prompts = this.prompts.map(p => p.id === prompt.id ? prompt : p);
      this.prompt = { ...prompt };
    });

    this.socket.on('remove-prompt', id => {
      this.prompts = this.prompts.filter(p => p.id !== id);
      this.prompt = { ...this.example };
    });

    this.reload()
  },
  methods: {
    savePrompt() {
      this.socket.emit('save-prompt', this.prompt);
    },

    updatePrompt(prompt) {
      this.socket.emit('update-prompt', prompt);
    },

    removePrompt(id) {
      this.socket.emit('remove-prompt', id);
    },

    reload() {
      M.AutoInit();

    }

  }
});