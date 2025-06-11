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

const board = document.getElementById("gameBoard");
const contadorElement = document.getElementById("contador");
const mensajeFinal = document.getElementById("mensajeFinal");
const reiniciarBtn = document.getElementById("reiniciarBtn");
const timerElement = document.getElementById("timer");
const dificultadSelect = document.getElementById("dificultad");

const audioCorrecto = document.getElementById("audioCorrecto");
const audioIncorrecto = document.getElementById("audioIncorrecto");
const audioVictoria = document.getElementById("audioVictoria");

let movimientos = 0;
let aciertos = 0;
let firstCard = null;
let secondCard = null;
let lockBoard = false;

let tiempoRestante = 0;
let temporizador;
let cantidadPares = 0;

function iniciarTemporizador() {
  clearInterval(temporizador);
  timerElement.textContent = `Tiempo: ${tiempoRestante}s`;

  temporizador = setInterval(() => {
    tiempoRestante--;
    timerElement.textContent = `Tiempo: ${tiempoRestante}s`;

    if (tiempoRestante <= 0) {
      clearInterval(temporizador);
      lockBoard = true;
      mensajeFinal.textContent = "⏰ ¡Tiempo agotado!";
      mensajeFinal.classList.remove("mensaje-oculto");
    }
  }, 1000);
}

function iniciarJuego() {
  board.innerHTML = "";
  mensajeFinal.classList.add("mensaje-oculto");
  mensajeFinal.textContent = "🎉 ¡Has ganado!";
  movimientos = 0;
  aciertos = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  contadorElement.textContent = "Movimientos: 0";

  // Ajustar dificultad
  const dificultad = dificultadSelect.value;
  if (dificultad === "facil") {
    cantidadPares = 5;
    tiempoRestante = 60;
  } else if (dificultad === "medio") {
    cantidadPares = 10;
    tiempoRestante = 90;
  } else {
    cantidadPares = 20;
    tiempoRestante = 120;
  }

  iniciarTemporizador();

  const seleccionados = shuffle([...pairs]).slice(0, cantidadPares);

  let cards = [];
  seleccionados.forEach(pair => {
    cards.push({ id: pair.id, content: pair.pais });
    cards.push({ id: pair.id, content: pair.capital });
  });

  cards = shuffle(cards);

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
          audioCorrecto.play();
          firstCard = null;
          secondCard = null;
          lockBoard = false;

          if (aciertos === cantidadPares) {
            clearInterval(temporizador);
            mensajeFinal.classList.remove("mensaje-oculto");
            audioVictoria.play();
          }
        } else {
          audioIncorrecto.play();
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
}

// Barajar arreglo
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// Iniciar al hacer clic en botón o al cargar
reiniciarBtn.addEventListener("click", iniciarJuego);
dificultadSelect.addEventListener("change", iniciarJuego);

// Iniciar automáticamente con la dificultad por defecto
iniciarJuego();

