import Shit from './src/Shit.js'
import './src/assets/css/index.css'

let s = new Shit()

let rootEl = document.getElementById('app');
let p = document.createElement('P');
p.innerText = 'Hello World ' + s.name;
p.className = 'next';
// p.setAttribute('class', 'next')
console.log(s.getName())
rootEl.appendChild(p);
