/* eslint-disable linebreak-style */
import Keyboard from './Keyboard';

window.onload = () => {
  const keyboard = new Keyboard();
  keyboard.generateLayout(localStorage.getItem('lang') || 'RUS');
};
