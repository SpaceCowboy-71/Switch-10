// Define and initialize variables
const colors = ["BlueViolet", "LightPink"];
const bg_color = "transparent";
var board = document.getElementById("board");
var boardState = initBoardState();
var winState = initWinState();
var boardStateHistory = [];
var focusMode = false;

// Initialize interface
addHistory();
initBoard();
toggleUndoButton(false);

function initBoardState() {
  var boardState = [];
  for (var i = 0; i < 11; i++) {
    if (i < 5) {
      boardState[i] = colors[0];
    } else if (i > 5) {
      boardState[i] = colors[1];
    } else {
      boardState[i] = bg_color;
    }
  }
  return boardState;
}

function initWinState() {
  var winState = [];
  for (var i = 0; i < 11; i++) {
    if (i < 5) {
      winState[i] = colors[1];
    } else if (i > 5) {
      winState[i] = colors[0];
    } else {
      winState[i] = bg_color;
    }
  }
  return winState;
}

function initBoard() {
  for (var i = 0; i < 11; i++) {
    var slot = document.createElement("button");
    slot.id = "slot-" + i;
    slot.className = "btn btn-outline-light slot";
    slot.onclick = function () {
      clickSlot(this);
    };
    board.appendChild(slot);
  }
  updateBoard();
}

function updateBoard() {
  //console.log(boardState);
  for (var i = 0; i < 11; i++) {
    var slot = document.getElementById("slot-" + i);
    slot.style.backgroundColor = boardState[i];
  }
  checkWin();
}

function clickSlot(slot) {
  moveToken(slot);
}

function moveToken(slot) {
  // Use regex to get the number from the id <slot-#>
  var slotId = parseInt(slot.id.replace(/\D/g, ""));
  var slotColor = boardState[slotId];
  var direction = slotColor == colors[0] ? 1 : -1;
  var nextSlot = slotId + direction;
  //console.log("next slot: " + nextSlot);
  if (boardState[nextSlot] == bg_color) {
    boardState[nextSlot] = slotColor;
    boardState[slotId] = bg_color;
    updateBoard();
    addHistory();
  } else {
    var nextNextSlot = nextSlot + direction;
    //console.log("next next slot: " + nextNextSlot);
    if (boardState[nextNextSlot] == bg_color) {
      boardState[nextNextSlot] = slotColor;
      boardState[slotId] = bg_color;
      updateBoard();
      addHistory();
    }
  }
}

function addHistory() {
  boardStateHistory.push(boardState.slice());
  console.log(boardStateHistory);
  toggleUndoButton(true);
}

function undo() {
  if (boardStateHistory.length > 1) {
    boardStateHistory.pop();
    console.log(boardStateHistory);
    boardState = boardStateHistory[boardStateHistory.length - 1].slice();
    updateBoard();
  }
  if (boardStateHistory.length == 1) {
    toggleUndoButton(false);
  }
}

function restart() {
  // location.reload()
  boardState = initBoardState();
  boardStateHistory = [];

  addHistory();
  updateBoard();
  toggleUndoButton(false);
}

function toggleUndoButton(enable) {
  if (enable) {
    document.getElementById("btn-undo").disabled = false;
  } else {
    document.getElementById("btn-undo").disabled = true;
  }
}

// Focus mode - change styling by adding/removing classes
function toggleFocus() {
  var textBox = document.getElementById("text-box");
  if (focusMode) {
    focusMode = false;
    textBox.style.display = "block";
    document.getElementById("btn-focus").classList.remove("btn-light");
    document.getElementById("btn-focus").classList.add("btn-outline-light");
    for (var i = 0; i < 11; i++) {
      var slot = document.getElementById("slot-" + i);
      slot.classList.remove("slot-focus");
      slot.classList.add("slot");
    }
    document.getElementById("container").classList.remove("container-focus");
    document.getElementById("container").classList.add("container");
  } else {
    focusMode = true;
    textBox.style.display = "none";
    document.getElementById("btn-focus").classList.remove("btn-outline-light");
    document.getElementById("btn-focus").classList.add("btn-light");
    for (var i = 0; i < 11; i++) {
      var slot = document.getElementById("slot-" + i);
      slot.classList.remove("slot");
      slot.classList.add("slot-focus");
    }
    document.getElementById("container").classList.remove("container");
    document.getElementById("container").classList.add("container-focus");
  }
}

function checkWin() {
  if (JSON.stringify(boardState) == JSON.stringify(winState)) {
    var myModal = new bootstrap.Modal(document.getElementById("win-modal"));
    myModal.toggle();
  }
}
