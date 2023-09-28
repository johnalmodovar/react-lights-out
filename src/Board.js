import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = 0.15 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];

    for (let i = 0; i < nrows; i++) {
      let row = [];
      for (let j = 0; j < ncols; j++) {
        row.push(Math.random() <= chanceLightStartsOn);
      }
      initialBoard.push(row);
    }
    console.log(initialBoard);
    return initialBoard;
  }

  function hasWon() {
    for (const row of board) {
      if (row.some(c => c)) return false;
    }

    return true;
  }

  function flipCellsAround(coord) {  //[y, x]  <- "3-2"
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // Make a (deep) copy of the oldBoard
      const newBoard = [...oldBoard];

      // in the copy, flip this cell and the cells around it
      flipCell(y, x, newBoard);
      flipCell(y - 1, x, newBoard);
      flipCell(y + 1, x, newBoard);
      flipCell(y, x - 1, newBoard);
      flipCell(y, x + 1, newBoard);

      // return the copy
      return newBoard;
    });
  }

  return (
    <div className="Board">
      <h1 className={`Board-win-message ${!hasWon() ? "gone" : ""}`}>You won!</h1>
      <table className={`Board-gameboard ${!hasWon() ? "" : "gone"}`}>
        <tbody>
          {
            board.map((row, y) => {
              return { <tr>
             { row.map((cell, x) => {
                return (<Cell
                  isLit={board[y][x]}
                  flipCellsAroundMe={() => flipCellsAround(`${y}-${x}`)} />);
                });}
            </tr> }
            });
          }
        </tbody>
      </table>
    </div>
  );
}


export default Board;
