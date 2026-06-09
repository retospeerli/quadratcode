const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const sizeEl = document.getElementById('size');
const plainEl = document.getElementById('plain');
const cipherInputEl = document.getElementById('cipherInput');
const cipherOutEl = document.getElementById('cipherOut');
const plainOutEl = document.getElementById('plainOut');
const squareEl = document.getElementById('square');
const gridHintEl = document.getElementById('gridHint');

function normalize(text) {
  return text
    .toUpperCase()
    .replace(/Ä/g, 'AE')
    .replace(/Ö/g, 'OE')
    .replace(/Ü/g, 'UE')
    .replace(/ẞ/g, 'SS')
    .replace(/[^A-Z]/g, '');
}

function groupFive(text) {
  return text.match(/.{1,5}/g)?.join(' ') || '';
}

function randomLetter() {
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

function makeEmptyGrid(size) {
  return Array.from({ length: size }, () => Array(size).fill(''));
}

function drawGrid(grid, originalLength = grid.length * grid.length) {
  const size = grid.length;
  squareEl.innerHTML = '';
  squareEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  let count = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      if (count >= originalLength) cell.classList.add('filler');
      cell.textContent = grid[r][c];
      squareEl.appendChild(cell);
      count++;
    }
  }
}

function encrypt() {
  const size = Number(sizeEl.value);
  const capacity = size * size;
  let plain = normalize(plainEl.value);

  if (!plain) {
    alert('Schreibe zuerst eine Botschaft.');
    return;
  }

  if (plain.length > capacity) {
    alert(`Diese Botschaft ist zu lang für ein ${size}x${size}-Quadrat. Maximal möglich sind ${capacity} Buchstaben.`);
    return;
  }

  const originalLength = plain.length;
  while (plain.length < capacity) plain += randomLetter();

  const grid = makeEmptyGrid(size);
  let i = 0;

  // Klartext senkrecht in Spalten eintragen
  for (let c = 0; c < size; c++) {
    for (let r = 0; r < size; r++) {
      grid[r][c] = plain[i++];
    }
  }

  // Geheimtext waagerecht zeilenweise ablesen
  let cipher = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      cipher += grid[r][c];
    }
  }

  cipherOutEl.textContent = groupFive(cipher);
  cipherInputEl.value = groupFive(cipher);
  plainOutEl.textContent = '';
  gridHintEl.textContent = 'Die schwarzen Buchstaben gehören zur Botschaft. Graue Buchstaben sind zufällige Füllbuchstaben.';
  drawGrid(grid, originalLength);
}

function decrypt() {
  const size = Number(sizeEl.value);
  const capacity = size * size;
  const cipher = normalize(cipherInputEl.value);

  if (!cipher) {
    alert('Füge zuerst einen Geheimtext ein.');
    return;
  }

  if (cipher.length !== capacity) {
    alert(`Für ein ${size}x${size}-Quadrat muss der Geheimtext genau ${capacity} Buchstaben haben. Aktuell sind es ${cipher.length}.`);
    return;
  }

  const grid = makeEmptyGrid(size);
  let i = 0;

  // Geheimtext waagerecht in Zeilen schreiben
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      grid[r][c] = cipher[i++];
    }
  }

  // Klartext senkrecht in Spalten lesen
  let plain = '';
  for (let c = 0; c < size; c++) {
    for (let r = 0; r < size; r++) {
      plain += grid[r][c];
    }
  }

  plainOutEl.textContent = plain;
  cipherOutEl.textContent = groupFive(cipher);
  gridHintEl.textContent = 'Zum Entschlüsseln wird der Geheimtext waagerecht eingetragen. Lies nun senkrecht in den Spalten.';
  drawGrid(grid);
}

document.getElementById('encryptBtn').addEventListener('click', encrypt);
document.getElementById('decryptBtn').addEventListener('click', decrypt);
document.getElementById('copyCipher').addEventListener('click', async () => {
  const text = cipherOutEl.textContent.trim();
  if (!text) return;
  await navigator.clipboard.writeText(text);
});

sizeEl.addEventListener('change', () => {
  squareEl.innerHTML = '';
  cipherOutEl.textContent = '';
  plainOutEl.textContent = '';
});

encrypt();
