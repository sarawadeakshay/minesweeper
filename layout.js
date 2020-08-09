const cellInstanceArr = [];

class Cell {
  constructor(rowIdx, cellIdx, totalRows, totalCols) {
    this.rowIdx = rowIdx;
    this.cellIdx = cellIdx;
    this.totalRows = totalRows;
    this.isMine = false;
    this.cellDiv = null;
    this.isRevealed = false;
    this.value = 0;
    this.maxIdx = totalRows * totalCols - 1;
  }

  // add a new cell to the selected row
  addCell() {
    const rowDiv = document.getElementsByClassName(`row-${this.rowIdx}`)[0];
    const cellDiv = document.createElement('div');
    cellDiv.className = `cell-div`;
    cellDiv.addEventListener('click', this.onClick);
    cellDiv.innerHTML ='<span class="cell-hide">'+this.value+'</span>'
    this.cellDiv = cellDiv;
    rowDiv.append(cellDiv);
  };

  // add a mine to the cell
  setMine() {
    this.isMine = true;
    const span = this.cellDiv.getElementsByTagName('span')[0];
    span.innerText = 'M';
    span.classList.add('mine');
  }

  showCells() {
    if (this.isMine) {
      cellInstanceArr.forEach(cell => {
        cell.showCell();
      });
      setTimeout(() => {
        alert('Game Over!');
      }, 100);
    } else {
      // if cell value is NOT 0, then just show that cell
      // if cell value is 0, show neighbouring cells and if required, their neighbouring cells recursively
      this.showCell();
      const span = this.cellDiv.getElementsByTagName('span')[0];
      if (+span.innerText === 0) {
        const mineCellRow = Math.floor(this.cellIdx/this.totalRows);
        
        // left cell logic
        if (this.cellIdx > 0) {
          const leftCellIdx = this.cellIdx - 1;
          const leftCellRow = Math.floor((leftCellIdx)/this.totalRows);
          if (mineCellRow === leftCellRow && !cellInstanceArr[leftCellIdx].isRevealed) {
            // recursively call the method with the context of the current cell as left cell is also 0
            cellInstanceArr[leftCellIdx].showCells();
          }
        }

        // right cell logic
        const rightCellIdx = this.cellIdx + 1;
        const rightCellRow = Math.floor((rightCellIdx)/this.totalRows);
        if (mineCellRow === rightCellRow && !cellInstanceArr[rightCellIdx].isRevealed) {
          // recursively call the method with the context of the current cell as left cell is also 0
          cellInstanceArr[rightCellIdx].showCells();
        }
        
        // upper cell logic
        const upperCellIdx = this.cellIdx - this.totalRows;
        if (upperCellIdx > 0) {
          if (!cellInstanceArr[upperCellIdx].isRevealed) {
            // recursively call the method with the context of the current cell as left cell is also 0
            cellInstanceArr[upperCellIdx].showCells();
          }
        }

        // below cell logic
        const belowCellIdx = this.cellIdx + this.totalRows;
        if (belowCellIdx <= this.maxIdx) {
          if (!cellInstanceArr[belowCellIdx].isRevealed) {
            cellInstanceArr[belowCellIdx].showCells();
          }
        }
      }
    }
  }

  showCell() {
    const cellSpan = this.cellDiv.getElementsByTagName('span')[0];
    cellSpan.classList.remove('cell-hide');
    this.isRevealed = true;
  }

  // cell on click
  onClick = () => {
    this.showCells();
  }
}


class Layout {
  width = 30;
  height = 30;
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
        const objCell = new Cell(rowCnt, cellInstanceArr.length, this.totalRows, this.totalCols);
        objCell.addCell();
        cellInstanceArr.push(objCell);
      }
    }
  }

  // plot random mines in the layout
  plotMines() {
    while (this.mineIdxArr.length < this.totalMines) {
      const randIdx = Math.floor(Math.random() * this.maxIdx);
      if (!this.mineIdxArr.includes(randIdx)) {
        cellInstanceArr[randIdx].setMine();
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
      const leftCellDiv = cellInstanceArr[mineIdx - 1].cellDiv;
      if (mineCellRow === leftCellRow && !cellInstanceArr[mineIdx - 1].isMine) {
        const leftCellSpan = leftCellDiv.getElementsByTagName('span')[0];
        leftCellSpan.innerText = +leftCellSpan.innerText + 1;
      }
    }
    
    // if right cell's row is same as mineCellRow and right cell does not contain a mine,
    // add 1 to its existing cnt
    const rightCellRow = Math.floor((mineIdx + 1)/this.totalRows);
    const rightCellDiv = cellInstanceArr[mineIdx + 1].cellDiv;
    if (mineCellRow === rightCellRow && !cellInstanceArr[mineIdx + 1].isMine) {
      const rightCellSpan = rightCellDiv.getElementsByTagName('span')[0];
      rightCellSpan.innerText = +rightCellSpan.innerText + 1;
    }
  } //  plotNeighbourCells over

  plotUpperCells(mineIdx) {
    const upperCellIdx = mineIdx - this.totalRows;
    if (upperCellIdx > 0) {
      const upperCellRow = Math.floor(upperCellIdx/this.totalRows);
      const upperCellDiv = cellInstanceArr[upperCellIdx].cellDiv;
      if (!cellInstanceArr[upperCellIdx].isMine) {
        const upperCellSpan = upperCellDiv.getElementsByTagName('span')[0];
        upperCellSpan.innerText = +upperCellSpan.innerText + 1;
      }

      // check left, to the upper row cell
      const upperLeftCellRow = Math.floor((upperCellIdx - 1)/this.totalRows);
      const upperLeftCellDiv = cellInstanceArr[upperCellIdx - 1].cellDiv;
      if (upperCellRow === upperLeftCellRow && !cellInstanceArr[upperCellIdx - 1].isMine) {
        const upperLeftCellSpan = upperLeftCellDiv.getElementsByTagName('span')[0];
        upperLeftCellSpan.innerText = +upperLeftCellSpan.innerText + 1;
      }

      // check right, to the upper row cell
      const upperRightCellRow = Math.floor((upperCellIdx + 1)/this.totalRows);
      const upperRightCellDiv = cellInstanceArr[upperCellIdx + 1].cellDiv;
      if (upperCellRow === upperRightCellRow && !cellInstanceArr[upperCellIdx + 1].isMine) {
        const upperRightCellSpan = upperRightCellDiv.getElementsByTagName('span')[0];
        upperRightCellSpan.innerText = +upperRightCellSpan.innerText + 1;
      }
    }
  } //  plotUpperCells over

  plotBelowCells(mineIdx) {
    const belowCellIdx = mineIdx + this.totalRows;
    if (belowCellIdx <= this.maxIdx) {
      const belowCellRow = Math.floor(belowCellIdx/this.totalRows);
      const belowCellDiv = cellInstanceArr[belowCellIdx].cellDiv;
      if (!cellInstanceArr[belowCellIdx].isMine) {
        const belowCellSpan = belowCellDiv.getElementsByTagName('span')[0];
        belowCellSpan.innerText = +belowCellSpan.innerText + 1;
      }

      // check left, to the upper row cell
      const belowLeftCellRow = Math.floor((belowCellIdx - 1)/this.totalRows);
      const belowLeftCellDiv = cellInstanceArr[belowCellIdx - 1].cellDiv;
      if (belowCellRow === belowLeftCellRow && !cellInstanceArr[belowCellIdx - 1].isMine) {
        const belowLeftCellSpan = belowLeftCellDiv.getElementsByTagName('span')[0];
        belowLeftCellSpan.innerText = +belowLeftCellSpan.innerText + 1;
      }

      // check right, to the upper row cell
      if (belowCellIdx + 1 <= this.maxIdx) {
        const belowRightCellRow = Math.floor((belowCellIdx + 1)/this.totalRows);
        const belowRightCellDiv = cellInstanceArr[belowCellIdx + 1].cellDiv;
        if (belowCellRow === belowRightCellRow && !cellInstanceArr[belowCellIdx + 1].isMine) {
          const belowRightCellSpan = belowRightCellDiv.getElementsByTagName('span')[0];
          belowRightCellSpan.innerText = +belowRightCellSpan.innerText + 1;
        }  
      }
    }
  } //  plotBelowCells over
}

const layout = new Layout(10, 10, 10);
layout.drawBoard();
layout.plotMines();
layout.plotNumbers();
