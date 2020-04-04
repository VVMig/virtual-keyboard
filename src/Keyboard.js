export default class Keyboard {
  constructor() {
    this.layout = {
      RUS: [
        ['ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
        ['Tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '\\', 'Del'],
        ['CapsLk', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'Enter'],
        ['Shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', '▲', 'Shift'],
        ['Ctrl', 'Win', 'Alt', '', 'Alt', 'Ctrl', '◄', '▼', '►'],
      ],
      ENG: [
        ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
        ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\', 'Del'],
        ['CapsLk', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
        ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '▲', 'Shift'],
        ['Ctrl', 'Win', 'Alt', '', 'Alt', 'Ctrl', '◄', '▼', '►'],
      ],
    };
    this.keyCodesClass = [
      ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
      ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash', 'Delete'],
      ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
      ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ArrowUp', 'ShiftRight'],
      ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'ControlRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight'],
    ];
    this.specialKeys = ['Backspace', 'Tab', 'CapsLock', 'ShiftLeft', 'ShiftRight', 'Enter', 'ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'Delete', 'AltRight', 'ControlRight', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    this.capsLock = '';
    this.shiftLeft = '';
    this.shiftRight = '';
  }

  generateLayout(language) {
    const container = document.createElement('div');
    const textarea = document.createElement('textarea');
    const keyBoard = document.createElement('div');
    const control = document.createElement('div');

    container.classList.add('container');
    keyBoard.classList.add('keyboard');
    control.classList.add('control-info');
    control.innerHTML = '<h2>Switch lang: left Shift + left Alt or right Shift + right Alt</h2><h3>Made in Windows OC</h3>';

    this.layout[language].forEach((rows, i) => {
      const tmpRow = document.createElement('div');

      rows.forEach((key, j) => {
        tmpRow.append(this.createKey(key, i, j));
      });

      tmpRow.classList.add('row');
      keyBoard.append(tmpRow);
    });

    document.body.append(container);
    container.append(textarea, keyBoard, control);

    this.textarea = document.querySelector('textarea');
    this.capsLock = document.querySelector('.CapsLock');
    this.shiftLeft = document.querySelector('.ShiftLeft');
    this.shiftRight = document.querySelector('.ShiftRight');

    this.keyboardListener();
    this.mouseListener(keyBoard);
  }

  switchLang() {
    const currentLang = this.getCurrentLang();

    if (currentLang === 'RUS') {
      this.generateNewLayout('ENG');
    } else this.generateNewLayout('RUS');
  }

  generateNewLayout(language) {
    let shift = false;

    if (this.isUpperKeys()) {
      shift = true;
    }
    if (this.isCapsActive() && this.isShiftActive()) {
      shift = false;
    }

    this.keyCodesClass.forEach((e, i) => {
      e.forEach((el, j) => {
        const newKey = document.querySelector(`.${this.keyCodesClass[i][j]}`);

        if (this.canSwitch(newKey)) {
          if (shift) {
            if (newKey.innerText !== this.upperCaseForKeys(`${this.layout[language][i][j]}`)) {
              newKey.innerHTML = this.upperCaseForKeys(`${this.layout[language][i][j]}`);
            }
          } else if (newKey.innerText !== `${this.layout[language][i][j]}`) {
            newKey.innerHTML = `${this.layout[language][i][j]}`;
          }
        }
      });
    });

    localStorage.setItem('lang', `${this.getCurrentLang()}`);
  }

  keyboardListener() {
    window.addEventListener('keydown', (e) => {
      if (e.code.substr(0, 5) !== 'Arrow') {
        e.preventDefault();
      } else {
        this.textarea.focus();
        return;
      }

      if (!document.querySelector(`.${e.code}`)) {
        return;
      }

      if (e.code === 'CapsLock') {
        document.querySelector(`.${e.code}`).classList.toggle('active');
      } else document.querySelector(`.${e.code}`).classList.add('active');

      this.isShiftsAltActive();
      this.enterKey(e.code);
    });

    window.addEventListener('keyup', (e) => {
      if (document.querySelector(`.${e.code}`)) {
        if (e.code !== 'CapsLock') {
          document.querySelector(`.${e.code}`).classList.remove('active');
        }

        this.generateNewLayout(this.getCurrentLang());
      }
    });
  }

  mouseListener(keyBoard) {
    keyBoard.addEventListener('mousedown', (e) => {
      if (e.target.classList[0] === 'key') {
        if (e.target.classList[1] === 'CapsLock') {
          e.target.classList.toggle('active');
        } else e.target.classList.add('active');

        this.textarea.focus();
        this.isShiftsAltActive();
        this.enterKey(e.target.classList[1]);

        e.target.addEventListener('mouseout', () => {
          if (e.target.classList[1] !== 'CapsLock') {
            e.target.classList.remove('active');
          }

          this.generateNewLayout(this.getCurrentLang());
        });
      }
    });

    keyBoard.addEventListener('mouseup', (e) => {
      if (e.target.classList[1] !== 'CapsLock') {
        e.target.classList.remove('active');
      }

      this.generateNewLayout(this.getCurrentLang());
    });
  }

  createKey(key, i, j) {
    const fragment = document.createDocumentFragment();
    const keyContainer = document.createElement('div');

    keyContainer.classList.add('key', `${this.keyCodesClass[i][j]}`);
    keyContainer.innerHTML = key;

    fragment.append(keyContainer);
    return fragment;
  }

  isShiftActive() {
    if (this.shiftLeft.classList[2] === 'active'
    || this.shiftRight.classList[2] === 'active') {
      return true;
    }
    return false;
  }

  isCapsActive() {
    if (this.capsLock.classList[2] === 'active') {
      return true;
    }
    return false;
  }

  getCurrentLang() {
    let currentLang = document.querySelectorAll('.row')[1].children[1].innerText;

    if (currentLang.toLowerCase() === this.layout.ENG[1][1]) {
      currentLang = 'ENG';
    } else currentLang = 'RUS';

    return currentLang;
  }

  isShiftsAltActive() {
    const altLeft = document.querySelector('.AltLeft');
    const altRight = document.querySelector('.AltRight');

    if ((altLeft.classList[2] === 'active' && this.shiftLeft.classList[2] === 'active')
    || (altRight.classList[2] === 'active' && this.shiftRight.classList[2] === 'active')) {
      this.switchLang();
    }

    if (this.isUpperKeys()) {
      this.generateNewLayout(this.getCurrentLang());
    }
  }

  isUpperKeys() {
    if (this.shiftRight.classList[2] === 'active'
    || this.shiftLeft.classList[2] === 'active'
    || this.capsLock.classList[2] === 'active') {
      return true;
    }
    return false;
  }

  enterKey(code) {
    const key = document.querySelector(`.${code}`);
    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    const selectedEnt = this.textarea.value.slice(start, end);
    const selectedTab = this.textarea.value.slice(start, end);
    const e = this;

    switch (key.classList[1]) {
      case 'Enter':
        this.textarea.setRangeText(`\n${selectedEnt}`, start, end, 'end');
        break;
      case 'Space':
        this.textarea.setRangeText(' ', start, end, 'end');
        break;
      case 'Tab':
        this.textarea.setRangeText(`\t${selectedTab}`, start, end, 'end');
        break;
      case 'Backspace':
        if (start === 0 && end === 0) break;
        this.textarea.setRangeText('', start === end ? start - 1 : start, end, 'end');
        break;
      case 'Delete':
        this.textarea.setRangeText('', start, end === start ? end + 1 : end, 'end');
        break;
      case 'ArrowLeft':
        this.textarea.selectionStart -= 1;
        this.textarea.selectionEnd = this.textarea.selectionStart;
        break;
      case 'ArrowRight':
        this.textarea.selectionStart += 1;
        this.textarea.selectionEnd = this.textarea.selectionStart;
        break;
      case 'ArrowUp':
        this.textarea.selectionStart = 0;
        this.textarea.selectionEnd = this.textarea.selectionStart;
        break;
      case 'ArrowDown':
        this.textarea.selectionStart = this.textarea.value.length;
        this.textarea.selectionEnd = this.textarea.selectionStart;
        break;
      default:
        if (this.canSwitch(key)) {
          this.textarea.setRangeText(key.innerText, start, end, 'end');
        }
    }
    setTimeout((() => e.textarea.focus()), 1);
  }

  canSwitch(key) {
    let pass = true;

    this.specialKeys.forEach((e) => {
      if (key.classList[1] === e) pass = false;
    });

    return pass;
  }

  upperCaseForKeys(keyText) {
    if (this.getCurrentLang() === 'ENG') {
      switch (keyText) {
        case '2':
          return '@';
        case '3':
          return '#';
        case '4':
          return '$';
        case '6':
          return '^';
        case '7':
          return '&';
        case '[':
          return '{';
        case ']':
          return '}';
        case "'":
          return '"';
        case ',':
          return '<';
        case '.':
          return '>';
        case '/':
          return '?';
        case '`':
          return '~';
        case ';':
          return ':';
        default:
          break;
      }
    } else {
      switch (keyText) {
        case '2':
          return '"';
        case '3':
          return '№';
        case '4':
          return ';';
        case '6':
          return ':';
        case '7':
          return '?';
        case '.':
          return ',';
        default:
          break;
      }
    }
    switch (keyText) {
      case '1':
        return '!';
      case '5':
        return '%';
      case '8':
        return '*';
      case '9':
        return '(';
      case '0':
        return ')';
      case '\\':
        return '|';
      case '-':
        return '_';
      case '=':
        return '+';
      default:
        return keyText.toUpperCase();
    }
  }
}
