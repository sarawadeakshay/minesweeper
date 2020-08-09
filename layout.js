class Cell {
  constructor(rowIdx, cellIdx) {
    this.rowIdx = rowIdx;
    this.cellIdx = cellIdx;
    this.isMine = false;
    this.cellDiv = null;
  }

  // add a new cell to the selected row
  addCell() {
    const rowDiv = document.getElementsByClassName(`row-${this.rowIdx}`)[0];
    const cellDiv = document.createElement('div');
    cellDiv.className = `cell-div`;
    cellDiv.addEventListener('click', this.onClick);
    cellDiv.innerHTML ='<span class="cell-hide">0</span>'
    // cellDiv.innerText = 0;
    this.cellDiv = cellDiv;
    rowDiv.append(cellDiv);
  };

  // add a mine to the cell
  setMine() {
    this.cellDiv.isMine = true;
    this.cellDiv.getElementsByTagName('span')[0].innerText = 'M';
    // this.cellDiv.innerText = 'M';
    this.cellDiv.classList.add('mine');
  }

  // cell on click
  onClick = () => {
    // console.log('clicked on: ', this.rowIdx, this.cellIdx);
    const cellSpan = this.cellDiv.getElementsByTagName('span')[0];
    if (this.cellDiv.isMine) {
      cellSpan.classList.remove('cell-hide');
      alert('Game Over!')
    }
  }
}


class Layout {
  width = 30;
  height = 30;
  cellInstanceArr = []
  mineIdxArr = []
  maxIdx = -1;
  constructor(totalRows, totalCols, totalMines) {
    this.totalRows = totalRows;
    this.totalCols = totalCols;
    this.totalMines = totalMines;
    this.maxIdx = (this.totalRows * this.totalCols) - 1; //  10*10 => 100-1 => 99
  }

  // draw the board/layout of cells
  drawBoard() {
    const mainDiv = document.getElementsByClassName('main-div')[0];
    for (let rowCnt=0; rowCnt<this.totalRows; rowCnt++) {
      const rowDiv = document.createElement('div');
      rowDiv.className = `row-${rowCnt} row-div`;
      mainDiv.append(rowDiv);
      for (let colCnt=0; colCnt<this.totalCols; colCnt++) {
        const objCell = new Cell(rowCnt, this.cellInstanceArr.length);
        objCell.addCell();
        this.cellInstanceArr.push(objCell);
      }
    }
  }

  // plot random mines in the layout
  plotMines() {
    while (this.mineIdxArr.length < this.totalMines) {
      const randIdx = Math.floor(Math.random() * this.maxIdx);
      if (!this.mineIdxArr.includes(randIdx)) {
        this.cellInstanceArr[randIdx].setMine();
        this.mineIdxArr.push(randIdx);
      }
    }
  }

  // plot the adjacent mine count for every cell
  plotNumbers() {
    this.mineIdxArr.forEach(mineIdx => {
      // plot left and right cells
      this.plotNeighbourCells(mineIdx);

      // plot cell in the upper row
      this.plotUpperCells(mineIdx);

      // plot cells in the below row
      this.plotBelowCells(mineIdx);
    });
  }

  plotNeighbourCells(mineIdx) {
    // if left cell's row is same as mineCellRow and left cell does not contain a mine,
    // add 1 to its existing cnt
    const mineCellRow = Math.floor(mineIdx/this.totalRows);
    if (mineIdx > 0) {
      const leftCellRow = Math.floor((mineIdx - 1)/this.totalRows);
      const leftCellDiv = this.cellInstanceArr[mineIdx - 1].cellDiv;
      if (mineCellRow === leftCellRow && !leftCellDiv.isMine) {
        const leftCellSpan = leftCellDiv.getElementsByTagName('span')[0];
        leftCellSpan.innerText = +leftCellSpan.innerText + 1;
        // leftCellDiv.innerText = +leftCellDiv.innerText + 1;
      }
    }
    
    // if right cell's row is same as mineCellRow and right cell does not contain a mine,
    // add 1 to its existing cnt
    const rightCellRow = Math.floor((mineIdx + 1)/this.totalRows);
    const rightCellDiv = this.cellInstanceArr[mineIdx + 1].cellDiv;
    if (mineCellRow === rightCellRow && !rightCellDiv.isMine) {
      const rightCellSpan = rightCellDiv.getElementsByTagName('span')[0];
      rightCellSpan.innerText = +rightCellSpan.innerText + 1;
      // rightCellDiv.innerText = +rightCellDiv.innerText + 1;
    }
  }

  plotUpperCells(mineIdx) {
    const upperCellIdx = mineIdx - this.totalRows;
    if (upperCellIdx > 0) {
      const upperCellRow = Math.floor(upperCellIdx/this.totalRows);
      const upperCellDiv = this.cellInstanceArr[upperCellIdx].cellDiv;
      if (!upperCellDiv.isMine) {
        const upperCellSpan = upperCellDiv.getElementsByTagName('span')[0];
        upperCellSpan.innerText = +upperCellSpan.innerText + 1;
        // upperCellDiv.innerText = +upperCellDiv.innerText + 1;
      }

      // check left cell to the upper row cell
      const upperLeftCellRow = Math.floor((upperCellIdx - 1)/this.totalRows);
      const upperLeftCellDiv = this.cellInstanceArr[upperCellIdx - 1].cellDiv;
      if (upperCellRow === upperLeftCellRow && !upperLeftCellDiv.isMine) {
        const upperLeftCellSpan = upperLeftCellDiv.getElementsByTagName('span')[0];
        upperLeftCellSpan.innerText = +upperLeftCellSpan.innerText + 1;
        // upperLeftCellDiv.innerText = +upperLeftCellDiv.innerText + 1;
      }

      // check right cell to the upper row cell
      const upperRightCellRow = Math.floor((upperCellIdx + 1)/this.totalRows);
      const upperRightCellDiv = this.cellInstanceArr[upperCellIdx + 1].cellDiv;
      if (upperCellRow === upperRightCellRow && !upperRightCellDiv.isMine) {
        const upperRightCellSpan = upperRightCellDiv.getElementsByTagName('span')[0];
        upperRightCellSpan.innerText = +upperRightCellSpan.innerText + 1;
        // upperRightCellDiv.innerText = +upperRightCellDiv.innerText + 1;
      }
    }
  }

  plotBelowCells(mineIdx) {
    const belowCellIdx = mineIdx + this.totalRows;
    if (belowCellIdx <= this.maxIdx) {
      const belowCellRow = Math.floor(belowCellIdx/this.totalRows);
      const belowCellDiv = this.cellInstanceArr[belowCellIdx].cellDiv;
      if (!belowCellDiv.isMine) {
        const belowCellSpan = belowCellDiv.getElementsByTagName('span')[0];
        belowCellSpan.innerText = +belowCellSpan.innerText + 1;
        // belowCellDiv.innerText = +belowCellDiv.innerText + 1;
      }

      // check left cell to the upper row cell
      const belowLeftCellRow = Math.floor((belowCellIdx - 1)/this.totalRows);
      const belowLeftCellDiv = this.cellInstanceArr[belowCellIdx - 1].cellDiv;
      if (belowCellRow === belowLeftCellRow && !belowLeftCellDiv.isMine) {
        const belowLeftCellSpan = belowLeftCellDiv.getElementsByTagName('span')[0];
        belowLeftCellSpan.innerText = +belowLeftCellSpan.innerText + 1;
        // belowLeftCellDiv.innerText = +belowLeftCellDiv.innerText + 1;
      }

      // check right cell to the upper row cell
      if (belowCellIdx + 1 <= this.maxIdx) {
        const belowRightCellRow = Math.floor((belowCellIdx + 1)/this.totalRows);
        const belowRightCellDiv = this.cellInstanceArr[belowCellIdx + 1].cellDiv;
        if (belowCellRow === belowRightCellRow && !belowRightCellDiv.isMine) {
          const belowRightCellSpan = belowRightCellDiv.getElementsByTagName('span')[0];
          belowRightCellSpan.innerText = +belowRightCellSpan.innerText + 1;
          // belowRightCellDiv.innerText = +belowRightCellDiv.innerText + 1;
        }  
      }
    }
  }
}

const layout = new Layout(10, 10, 10);
layout.drawBoard();
layout.plotMines();
layout.plotNumbers();
