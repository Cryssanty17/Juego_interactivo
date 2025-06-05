const pairs = [
  { id: 'mx', pais: 'México', capital: 'Ciudad de México' },
  { id: 'fr', pais: 'Francia', capital: 'París' },
  { id: 'jp', pais: 'Japón', capital: 'Tokio' },
  { id: 'br', pais: 'Brasil', capital: 'Brasilia' },
  { id: 'us', pais: 'Estados Unidos', capital: 'Washington D.C.' },
  { id: 'ar', pais: 'Argentina', capital: 'Buenos Aires' },
  { id: 'ca', pais: 'Canadá', capital: 'Ottawa' },
  { id: 'es', pais: 'España', capital: 'Madrid' },
  { id: 'it', pais: 'Italia', capital: 'Roma' },
  { id: 'uk', pais: 'Reino Unido', capital: 'Londres' },
  { id: 'de', pais: 'Alemania', capital: 'Berlín' },
  { id: 'ru', pais: 'Rusia', capital: 'Moscú' },
  { id: 'in', pais: 'India', capital: 'Nueva Delhi' },
  { id: 'cn', pais: 'China', capital: 'Pekín' },
  { id: 'au', pais: 'Australia', capital: 'Canberra' },
  { id: 'pt', pais: 'Portugal', capital: 'Lisboa' },
  { id: 'se', pais: 'Suecia', capital: 'Estocolmo' },
  { id: 'kr', pais: 'Corea del Sur', capital: 'Seúl' },
  { id: 'za', pais: 'Sudáfrica', capital: 'Pretoria' },
  { id: 'eg', pais: 'Egipto', capital: 'El Cairo' },
];

let cards = [];

pairs.forEach(pair => {
  cards.push({ id: pair.id, content: pair.pais });
  cards.push({ id: pair.id, content: pair.capital });
});

cards = shuffle(cards);

const board = document.getElementById("gameBoard");
const contadorElement = document.getElementById("contador");
const mensajeFinal = document.getElementById("mensajeFinal");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let movimientos = 0;
let aciertos = 0;

cards.forEach(data => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.id = data.id;

  const cardInner = document.createElement("div");
  cardInner.classList.add("card-inner");

  const front = document.createElement("div");
  front.classList.add("card-front");
  front.textContent = "?";

  const back = document.createElement("div");
  back.classList.add("card-back");
  back.textContent = data.content;

  cardInner.appendChild(front);
  cardInner.appendChild(back);
  card.appendChild(cardInner);
  board.appendChild(card);

  card.addEventListener("click", () => {
    if (lockBoard || card.classList.contains("flipped")) return;

    card.classList.add("flipped");

    if (!firstCard) {
      firstCard = card;
    } else {
      secondCard = card;
      lockBoard = true;
      movimientos++;
      contadorElement.textContent = `Movimientos: ${movimientos}`;

      const id1 = firstCard.dataset.id;
      const id2 = secondCard.dataset.id;

      if (id1 === id2) {
        aciertos++;
        firstCard = null;
        secondCard = null;
        lockBoard = false;

        if (aciertos === pairs.length) {
          mensajeFinal.classList.remove("mensaje-oculto");
        }
      } else {
        setTimeout(() => {
          firstCard.classList.remove("flipped");
          secondCard.classList.remove("flipped");
          firstCard = null;
          secondCard = null;
          lockBoard = false;
        }, 1000);
      }
    }
  });
});

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
