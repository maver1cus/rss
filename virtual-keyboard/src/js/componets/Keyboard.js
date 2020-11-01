import Key           from './Key';
import createElement from '../utils/createElement'
import language from '../layouts/index'

const DEFAULT_LANGUAGE = 'ru'
const templateMain = `
  <h1 class="title">RSS Virtual Keyboard</h1>
  <h3 class="subtitle">Windows keyboard that has been made under OS Ubuntu</h3>
  <div>
    <audio data-key="ru" src="../../assets/sounds/ru.mp3"></audio>
    <audio data-key="en" src="../../assets/sounds/en.mp3"></audio>
    <audio data-key="backspace" src="../../assets/sounds/backspace.mp3"></audio>
    <audio data-key="del" src="../../assets/sounds/del.mp3"></audio>
    <audio data-key="shift" src="../../assets/sounds/shift.mp3"></audio>
    <audio data-key="capslock" src="../../assets/sounds/capslock.mp3"></audio>
    <audio data-key="enter" src="../../assets/sounds/enter.mp3"></audio>
  </div>
`

const main = createElement('main', null, templateMain)

export default class Keyboard {
  constructor(rowOrder) {
    this.rowsOrder = rowOrder;
    this.clipboard = '';
    this.keyboardElement = null;
    this.positionCursorInStart = true;
    this.state = {
      pressCaps: false,
      pressShift: false,
      pressAlt: false,
      pressCtrl: false,
      pressMic: false,
      pressVolume: false,
      language: localStorage.getItem('lang') ?? DEFAULT_LANGUAGE,
      shiftNum: true,
      shiftChar: true
    }
  }

  init = () => {
    this.keyBase = language[this.state.language];
    this.output = createElement('textarea', 'output', null,
      ['placeholder', 'Start type something...'],
      ['rows', 5],
      ['cols', 50],
      ['spellcheck', false],
      ['autocorrect', 'off']);

    this.keyboardElement = createElement('div', 'keyboard hide', null, ['language', this.state.language])
    main.insertAdjacentElement('beforeend', this.output);
    main.insertAdjacentElement('beforeend', this.keyboardElement);
    main.insertAdjacentHTML('beforeend', `<button class="open">открыть клавиатуру</button>`);
    this.output.addEventListener('click', () => {
      this.keyboardElement.classList.remove('hide');
    })
    document.body.insertAdjacentElement('afterbegin', main);
    this.initMic();
    return this;
  }

  switchLanguage = () => {
    const langAbbr = Object.keys(language);
    let langIdx = langAbbr.indexOf(this.state.language);
    this.state.language = langIdx + 1 < langAbbr.length ? langAbbr[langIdx += 1] : langAbbr[langIdx -= langIdx];
    localStorage.setItem('lang', this.state.language);

    this.recognition.lang = this.state.language === 'ru' ? 'ru-Ru' : 'en-US';

  }

  playSound = code => {
    let playSound = this.state.language === 'ru' ? 'ru' : 'en';
    if (code.match(/Shift/)) playSound = 'shift';
    if (code.match(/Enter/)) playSound = 'enter';
    if (code.match(/Caps/)) playSound = 'capslock';
    if (code.match(/Backspace/)) playSound = 'backspace';
    if (code.match(/Del/)) playSound = 'del';
    const audio = document.querySelector(`audio[data-key="${playSound}"]`);
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
  }

  initMic = () => {
    this.recognition = null;
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    this.recognition.interimResults = true;
    this.recognition.lang = this.state.language === 'ru' ? 'ru-Ru' : 'en-US';

    this.recognition.addEventListener('result', e => {
      const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

      const poopScript = transcript.replace(/poop|poo|shit|dump/gi, '💩') + ' ';
      if (e.results[0].isFinal) {
        let cursorPos = this.output.selectionStart;
        let cursorPosEnd = this.output.selectionEnd;

        const left = this.output.value.slice(0, cursorPos);
        const right = this.output.value.slice(cursorPosEnd);
        this.output.value = `${left}${poopScript}${right}`;
        cursorPos += poopScript.length;
        this.output.setSelectionRange(cursorPos, cursorPos)
      }
    });

    this.recognition.addEventListener('end', () => {
      if (this.state.pressMic) this.recognition.start();
    });
  }

  startMic = () => {
    this.initMic();
    this.recognition.start();
  }

  stopMic = () => {
    this.recognition.removeEventListener('end', this.startMic);
    this.recognition.stop();
    this.recognition = null;
  }

  render = () => {
    this.keyBase = language[this.state.language];
    this.keyButtons.forEach(button => {
      const keyObj = this.keyBase.find((key) => key.code === button.code);
      if (!keyObj) return;
      button.shift = keyObj.shift;
      button.mainSymbol = keyObj.mainSymbol;
      let showSymbol = 'mainSymbol';

      if (button.type === 'number' ) {
        showSymbol = this.state.shiftNum ? 'mainSymbol' : 'shift';
      }
      if (button.type === 'char') {
        showSymbol = this.state.shiftChar ? 'mainSymbol' : 'shift'
      }

      button.char = button[showSymbol];
      button.button.innerHTML = button[showSymbol];
    })
  }

  printToOutput = ({code, isFnKey}) => {
    let cursorPosStart = this.output.selectionStart;
    let cursorPosEnd = this.output.selectionEnd;
    const left = this.output.value.slice(0, cursorPosStart);
    const right = this.output.value.slice(cursorPosEnd);
    const selection = this.output.value.slice(cursorPosStart, cursorPosEnd);
    const textHandlers = {
      Tab: () => {
        this.output.value = `${left}\t${right}`;
        cursorPosStart += 1;
        cursorPosEnd = cursorPosStart;
      },
      ArrowLeft: () => {
        if (this.state.pressShift) {
          if (this.positionCursorInStart) {
            cursorPosStart = cursorPosStart - 1 >= 0 ? cursorPosStart - 1 : 0;
            if (cursorPosStart > cursorPosEnd) {
              [cursorPosStart, cursorPosEnd] = [cursorPosEnd, cursorPosStart]
              this.positionCursorInStart = false;
            }
          } else {
            cursorPosEnd -=1;
            if (cursorPosStart > cursorPosEnd) {
              [cursorPosStart, cursorPosEnd] = [cursorPosEnd, cursorPosStart]
              this.positionCursorInStart = true;
            }
          }
        } else {
          cursorPosStart = cursorPosStart - 1 >= 0 ? cursorPosStart - 1 : 0;
          cursorPosEnd = cursorPosStart;
        }

      },
      ArrowRight: () => {
        if (this.state.pressShift) {
          if (this.positionCursorInStart) {
            cursorPosStart += 1;
            if (cursorPosStart > cursorPosEnd) {
              [cursorPosStart, cursorPosEnd] = [cursorPosEnd, cursorPosStart]
              this.positionCursorInStart = false;
            }
          } else {
            cursorPosEnd += 1;
          }

        } else {
          cursorPosStart += 1;
          cursorPosEnd = cursorPosStart;
        }


      },
      ArrowUp: () => {
        const positionFromLeft = this.output.value.slice(0, cursorPosStart).match(/(\n).*$(?!\1)/g) || [[1]];
        cursorPosStart -= positionFromLeft[0].length;
        cursorPosEnd = cursorPosStart
      },
      ArrowDown: () => {
        const positionFromLeft = this.output.value.slice(cursorPosStart).match(/^.*(\n).*(?!\1)/) || [[1]];
        cursorPosStart += positionFromLeft[0].length;
        cursorPosEnd = cursorPosStart;
      },
      Enter: () => {
        this.output.value = `${left}\n${right}`;
        cursorPosStart += 1;
        cursorPosEnd = cursorPosStart;
        console.log('sdadsa')
      },
      Delete: () => {
        this.output.value = `${left}${right.slice(1)}`;
      },
      Backspace: () => {
        this.output.value = `${left.slice(0, -1)}${right}`;
        cursorPosStart -= 1
        cursorPosEnd = cursorPosStart;
      },
      Space: () => {
        this.output.value = `${left} ${right}`;
        cursorPosStart += 1;
        cursorPosEnd = cursorPosStart;
      },
    };
    if (textHandlers[code]) {
      textHandlers[code]()
      this.output.setSelectionRange(cursorPosStart, cursorPosEnd)
    } else if (!isFnKey) {
      if (this.state.pressCtrl  && code === 'KeyC') {
        this.clipboard = selection;
      } else if (this.state.pressCtrl && code === 'KeyX') {
        this.clipboard = selection;
        this.output.value = `${left}${right}`;
        cursorPosEnd = cursorPosStart;
      } else if ((this.state.pressCtrl  && code === 'KeyV')) {
        this.output.value = `${left}${this.clipboard}${right}`;
        cursorPosStart = cursorPosStart + this.clipboard.length;
        cursorPosEnd = cursorPosStart;
      } else if (this.state.pressCtrl  && code === 'KeyA') {
        cursorPosStart = 0;
        cursorPosEnd = this.output.value.length;
      } else {
        cursorPosStart += 1;
        const char = this.keyButtons.find(key => key.code === code).char
        this.output.value = `${left}${char}${right}`;
        cursorPosEnd = cursorPosStart;
      }
    }
    this.output.setSelectionRange(cursorPosStart, cursorPosEnd)
  }

  generateLayout = () => {
    this.keyButtons = [];
    this.rowsOrder.forEach((row, i) => {
      const rowElement = createElement('div', 'keyboard__row', null, ['row', i + 1]);
      row.forEach((code) => {
        const keyObj = this.keyBase.find((key) => key.code === code);
        if (keyObj) {
          const keyButton = new Key(keyObj);
          this.keyButtons.push(keyButton);
          rowElement.appendChild(keyButton.button);
        }
      });
      this.keyboardElement.appendChild(rowElement);
    });

    document.addEventListener('keydown', this.handleEvent);
    document.addEventListener('keyup', this.handleEvent);
    this.keyboardElement.onmousedown = this.preHandleEvent;
    this.keyboardElement.onmouseup = this.preHandleEvent;
    document.querySelector('.open').addEventListener('click', () => this.keyboardElement.classList.remove('hide'))
  }

  preHandleEvent = e => {
    e.stopPropagation();
    const keyDiv = e.target.closest('.keyboard__key');
    if (!keyDiv) return;
    const { dataset: { code } } = keyDiv;
    keyDiv.addEventListener('mouseleave', this.resetButtonState);
    this.handleEvent({ code, type: e.type, target: e.target });
    keyDiv.addEventListener('mouseleave', () => {
      this.handleEvent({ code, type: 'keyup', target: e.target });
    });
  }

  handleEvent = e => {
    if (e.stopPropagation) e.stopPropagation();
    const {code, type} = e;
    const keyObj = this.keyButtons.find((key) => key.code === code);
      if (!keyObj) return;
    this.output.focus();

    if (type.match(/keydown|mousedown/)) {
      if (!type.match(/mouse/)) e.preventDefault();
      if (code.match(/Close/)) this.keyboardElement.classList.add('hide')
      if (code.match(/Switch/)) this.switchLanguage();
      if (code.match(/Shift/)) {
        this.state.pressShift = !this.state.pressShift
        this.state.shiftNum = !this.state.shiftNum;
        this.state.shiftChar = !this.state.shiftChar;
      }
      if (code.match(/Caps/)) {
        this.state.pressCaps = !this.state.pressCaps
        this.state.shiftChar = !this.state.shiftChar;
      }
      if (code.match(/Mic/)) {
        this.state.pressMic = !this.state.pressMic
        if (this.state.pressMic) {
          this.startMic();
        } else {
          this.stopMic();
        }
      }
      if (code.match(/Volume/)) this.state.pressVolume = !this.state.pressVolume;
      if (code.match(/Control/)) this.state.pressCtrl = true;
      if (code.match(/Alt/)) this.state.pressAlt = true;
      if (code.match(/Shift|Caps|Switch/)) this.render();
      if (this.state.pressVolume) this.playSound(code);
      this.printToOutput(keyObj);
      keyObj.button.classList.add('active');

    } else if (e.type.match(/keyup|mouseup/)) {
      if (code.match(/Control/)) this.state.pressCtrl = false;
      if (code.match(/Alt/)) this.state.pressAlt = false;

      if ( (code.match(/Shift/) && this.state.pressShift) ||
           (code.match(/Caps/) && this.state.pressCaps) ||
           (code.match(/Mic/) && this.state.pressMic) ||
           (code.match(/Volume/) && this.state.pressVolume)
      ) return;

      keyObj.button.classList.remove('active');
    }
  }
}
