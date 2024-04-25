import { Board } from "./Board.js";

export class Game {
  constructor(skecth, state) {
    this.skecth = document.getElementById(skecth)
    this.board = new Board(10)
    this.state = state;
  }
  render() {
    this.skecth.appendChild(this.board)
    return this.skecth
  }
}
