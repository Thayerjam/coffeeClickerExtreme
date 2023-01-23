/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

let counter = [
  [-1],
  [-1],
  [-1],
  [-1],
  [-1],
  [-1],
  [-1],
  [-1],
  [-1],
  [-1],
  [-1],
  [-1],
];
let producerPrices = [[], [], [], [], [], [], [], [], [], [], [], []];
let interval;

function addCoffeeGrinder(event) {
  if (event.target.style.backgroundColor !== "green") {
    event.target.style.backgroundColor = "green";
    event.target.innerText = "Coffee Grinder: Purchased";
    totalCPSFactor += 1;
  }
}

function levelUpCursor(event) {
  if (event.target.style.backgroundColor !== "green") {
    event.target.style.backgroundColor = "green";
    event.target.innerText = "Cursor Level Up: Purchased";
    bonusClickValue = 99;
  }
}

function caffTheCursor(event) {
  if (event.target.style.backgroundColor !== "green") {
    event.target.style.backgroundColor = "green";
    event.target.innerText = "Caffeinate Cursor: Purchased";
    setInterval(
      () =>
        (totalClickValue =
          1 + bonusClickValue + Math.floor(data.totalCPS / 15)),
      100
    );
  }
}

// Extra Credit - moving the coffee cup on click
function moveCoffeeCup() {
  document.querySelector("#big_coffee").style.fontSize = "127px";
}

function moveCoffeeCupBack() {
  document.querySelector("#big_coffee").style.fontSize = "128px";
}

function updateCoffeeView(coffeeQty) {
  // The commented out line below properly adds commas to the counter but breaks tests
  // document.querySelector('#coffee_counter').innerText = coffeeQty.toLocaleString();
  document.querySelector("#coffee_counter").innerText = coffeeQty;
}

let bonusClickValue = 0;
let totalClickValue = 1 + bonusClickValue;
let totalCPSFactor = 1;

function clickCoffee(data) {
  data.coffee += totalClickValue;
  updateCoffeeView(data.coffee);
  renderProducers(data);
  moveCoffeeCup();
  setTimeout(moveCoffeeCupBack, 90);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  return producers.forEach((producer) =>
    coffeeCount >= producer.price / 2 ? (producer.unlocked = true) : null
  );
}

function getUnlockedProducers(data) {
  return data.producers.filter((producer) => producer.unlocked);
}

function makeDisplayNameFromId(id) {
  return id
    .split("_")
    .map((value) => value[0].toUpperCase() + value.slice(1))
    .join(" ");
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement("div");
  containerDiv.className = "producer";
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <div id="buySellButtons">
      <button type="button" id="buy_${producer.id}">Buy</button>
      <button type="button" id="sell_${producer.id}">Sell</button>
    </div>
  </div>
  <div class="producer-column producer-stats">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  /*${
    producerPrices[returnProducerNumber(producer, data)][
      counter[returnProducerNumber(producer, data)]
    ]
      ? ": " +
        producerPrices[returnProducerNumber(producer, data)][
          counter[returnProducerNumber(producer, data)]
        ]
      : ""
  } */
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  const container = document.querySelector("#producer_container");
  unlockProducers(data.producers, data.coffee);
  getUnlockedProducers(data);
  deleteAllChildNodes(container);
  for (let value of getUnlockedProducers(data)) {
    container.append(makeProducerDiv(value));
  }
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  return data.producers.find((producer) => producer.id === producerId);
}

function canAffordProducer(data, producerId) {
  return data.coffee >= getProducerById(data, producerId).price;
}

function updateCPSView(cps) {
  document.querySelector("#cps").innerText = cps * totalCPSFactor;
}

function updatePrice(oldPrice) {
  return Math.floor(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  let producerInQuestion = getProducerById(data, producerId);
  if (canAffordProducer(data, producerId)) {
    producerInQuestion.qty += 1;
    data.coffee -= producerInQuestion.price;
    storePreviousPrice(producerInQuestion, producerInQuestion.price, data);
    producerInQuestion.price = updatePrice(producerInQuestion.price);
    data.totalCPS += producerInQuestion.cps;
    return true;
  }
  return false;
}

function returnProducerNumber(producerObject, data) {
  let output = 0;
  for (producer of data.producers) {
    if (producerObject.id === producer.id) {
      break;
    }
    output += 1;
  }
  return output;
}

function storePreviousPrice(producerObject, oldPrice, data) {
  let producerNumber = returnProducerNumber(producerObject, data);
  counter[producerNumber][0] = counter[producerNumber][0] + 1;
  producerPrices[producerNumber][counter[producerNumber]] = oldPrice;
}

function buyButtonClick(event, data) {
  if (event.target.tagName !== "BUTTON") {
    return false;
  }
  let producerId = event.target.id.slice(4);
  if (!canAffordProducer(data, producerId)) {
    window.alert("Not enough coffee");
  } else {
    attemptToBuyProducer(data, producerId);
    renderProducers(data);
    updateCoffeeView(data.coffee);
    updateCPSView(data.totalCPS);
  }
}

function sellButtonClick(event, data) {
  if (event.target.tagName !== "BUTTON") {
    return false;
  }
  let producerId = event.target.id.slice(5);
  let producerObject = getProducerById(data, producerId);
  if (producerObject.qty < 1) {
    window.alert("Cannot sell: Qty 0");
  } else {
    data.coffee += Math.floor(
      producerPrices[returnProducerNumber(producerObject, data)][
        counter[returnProducerNumber(producerObject, data)][0]
      ] / 2
    );
    data.totalCPS -= producerObject.cps;
    producerObject.qty -= 1;
    producerObject.price =
      producerPrices[returnProducerNumber(producerObject, data)][
        counter[returnProducerNumber(producerObject, data)][0]
      ];
    counter[returnProducerNumber(producerObject, data)][0] -= 1;
    renderProducers(data);
    updateCoffeeView(data.coffee);
    updateCPSView(data.totalCPS);
  }
}

function tick(data) {
  data.coffee += data.totalCPS * totalCPSFactor;
  updateCoffeeView(data.coffee);
  updateCPSView(data.totalCPS);
  renderProducers(data);
}

function saveData(data) {
  localStorage.setItem("savedGameData", JSON.stringify(data));
}

function restartGame() {
  localStorage.clear();
  window.location.reload();
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === "undefined") {
  // Get starting data from the window object
  // (This comes from data.js)

  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById("big_coffee");
  bigCoffee.addEventListener("click", () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById("producer_container");
  producerContainer.addEventListener("click", (event) => {
    if (event.target.id.slice(0, 3) === "buy") {
      buyButtonClick(event, data);
    } else if (event.target.id.slice(0, 4) === "sell") {
      sellButtonClick(event, data);
    }
  });

  // Add event listener for restart game button
  const restartGameButton = document.querySelector("#restartGame");
  restartGameButton.addEventListener("click", restartGame);

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
  setInterval(() => saveData(data), 1000);
}

// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}
