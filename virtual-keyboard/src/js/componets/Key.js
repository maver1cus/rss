import createElement from '../utils/createElement'

export default class Key {

  constructor({ mainSymbol, shift, code, type }) {
    this.code = code;
    this.type = type;
    this.char = mainSymbol;
    this.mainSymbol = mainSymbol;
    this.shift = shift;
    this.isFnKey = type === 'functional';

    this.button = createElement('button', 'keyboard__key', this.mainSymbol, ['code', this.code], ['fn', this.isFnKey], ['type', this.type]);
  }

  getTemplate(symbol) {
    return `
        <span class="symbol">${symbol}</span>
    `;
  }
}
