import Key           from './Key';
import createElement from '../utils/createElement'
import language from '../layouts/index'

const DEFAULT_LANGUAGE = 'ru'
const templateMain = `
  <h1 class="title">RSS Virtual Keyboard</h1>
  <h3 class="subtitle">Windows keyboard that has been made under OS Ubuntu</h3>
`

const main = createElement('main', null, templateMain)

export default class Keyboard {
  constructor(rowOrder) {
    this.rowsOrder = rowOrder;
    this.keysPressed = {};
    this.container = null;
    this.state = {
      pressCaps: false,
      pressShift: false,
      pressAlt: false,
      pressCtrl: false,
      language: localStorage.getItem('lang') ?? DEFAULT_LANGUAGE,
      shiftNum: true,
      shiftChar: true
    }
  }

  init() {
    this.keyBase = language[this.state.language];
    this.output = createElement('textarea', 'output', null,
      ['placeholder', 'Start type something...'],
      ['rows', 5],
      ['cols', 50],
      ['spellcheck', false],
      ['autocorrect', 'off']);

    this.container = createElement('div', 'keyboard', null, ['language', this.state.language])
    main.insertAdjacentElement('beforeend', this.output);
    main.insertAdjacentElement('beforeend', this.container);
    document.body.insertAdjacentElement('afterbegin', main);
    return this;
  }

  switchLanguage = () => {
    const langAbbr = Object.keys(language);
    let langIdx = langAbbr.indexOf(this.state.language);
    this.state.language = langIdx + 1 < langAbbr.length ? langAbbr[langIdx += 1] : langAbbr[langIdx -= langIdx];
    localStorage.setItem('lang', this.state.language);
  }

  render() {
    this.keyBase = language[this.state.language];
    this.keyButtons.forEach(button => {
      const keyObj = this.keyBase.find((key) => key.code === button.code);
      if (!keyObj) return;
      button.shift = keyObj.shift;
      button.mainSymbol = keyObj.mainSymbol;
      let showSymbol = 'mainSymbol';

      if (button.type === 'number' ) {
        showSymbol = this.state.shiftNum ? 'mainSymbol' : 'shift'
      }
      if (button.type === 'char') {
        showSymbol = this.state.shiftChar ? 'mainSymbol' : 'shift'
      }
      this.char = button[showSymbol];
      button.button.innerHTML = button[showSymbol];
    })
  }

  printToOutput({code, isFnKey})  {
    let cursorPos = this.output.selectionStart;
    let cursorPosEnd = this.output.selectionEnd;

    const left = this.output.value.slice(0, cursorPos);
    const right = this.output.value.slice(cursorPosEnd);


    const textHandlers = {
      Tab: () => {
        this.output.value = `${left}\t${right}`;
        cursorPos += 1;
      },
      ArrowLeft: () => {
        cursorPos = cursorPos - 1 >= 0 ? cursorPos - 1 : 0;
      },
      ArrowRight: () => {
        cursorPos += 1;
      },
      ArrowUp: () => {
        const positionFromLeft = this.output.value.slice(0, cursorPos).match(/(\n).*$(?!\1)/g) || [[1]];
        cursorPos -= positionFromLeft[0].length;
      },
      ArrowDown: () => {
        const positionFromLeft = this.output.value.slice(cursorPos).match(/^.*(\n).*(?!\1)/) || [[1]];
        cursorPos += positionFromLeft[0].length;
      },
      Enter: () => {
        this.output.value = `${left}\n${right}`;
        cursorPos += 1;
      },
      Delete: () => {
        this.output.value = `${left}${right.slice(1)}`;
      },
      Backspace: () => {
        this.output.value = `${left.slice(0, -1)}${right}`;
        cursorPos -= 1;
      },
      Space: () => {
        this.output.value = `${left} ${right}`;
        cursorPos += 1;
      },
    };
    if (textHandlers[code]) {
      textHandlers[code]()

      this.output.setSelectionRange(cursorPos, cursorPos)
    } else if (!isFnKey) {
      cursorPos += 1;
      const char = this.keyButtons.find(key => key.code === code).char
      this.output.value = `${left}${char}${right}`;
    }
    this.output.setSelectionRange(cursorPos, cursorPos)
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
      this.container.appendChild(rowElement);
    });

    document.addEventListener('keydown', this.handleEvent);
    document.addEventListener('keyup', this.handleEvent);
    this.container.onmousedown = this.preHandleEvent;
    this.container.onmouseup = this.preHandleEvent;
  }

  preHandleEvent = (e) => {
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

  handleEvent = (e) => {
    if (e.stopPropagation) e.stopPropagation();
    const {code, type} = e;
    const keyObj = this.keyButtons.find((key) => key.code === code);
      if (!keyObj) return;
    this.output.focus();

    if (type.match(/keydown|mousedown/)) {
      if (!type.match(/mouse/)) e.preventDefault();
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

      if (code.match(/Control/)) this.state.pressCtrl = true;
      if (code.match(/Alt/)) this.state.pressAlt = true;

      if (code.match(/Shift|Caps|Switch/)) this.render();

      this.printToOutput(keyObj);

      keyObj.button.classList.add('active');


    } else if (e.type.match(/keyup|mouseup/)) {
      if (code.match(/Control/)) this.state.pressCtrl = false;
      if (code.match(/Alt/)) this.state.pressAlt = false;

      if ( (code.match(/Shift/) && this.state.pressShift) ||
           (code.match(/Caps/) && this.state.pressCaps)
      ) return;

      keyObj.button.classList.remove('active');
    }
  }
}
