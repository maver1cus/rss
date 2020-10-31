import createElement from '../utils/createElement'

export default class Key {

  constructor({ mainSymbol, shift, code, type }) {
    this.code = code;
    this.type = type;
    this.char = mainSymbol;
    this.mainSymbol = mainSymbol;
    this.shift = shift;
    this.isFnKey = Boolean(mainSymbol.match(/Ctrl|arr|Alt|Shift|Tab|Back|Del|Enter|Caps|ru|en/));

    this.button = createElement('button', 'keyboard__key', this.mainSymbol, ['code', this.code], ['fn', this.isFnKey], ['type', this.type]);
  }

  getTemplate(symbol) {
    return `
        <span class="symbol">${symbol}</span>
    `;
  }
}
