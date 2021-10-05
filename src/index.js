import React from "react";
import ReactDOM  from "react-dom";
import "./index.css"

function Square(props){
    return (
        <button style={{color: props.isWinSquare? 'lime' : 'black'}}
            className="square"
            onClick={props.onClick}        
        >
        {props.value}
        </button>
    );
  }
  
  class Board extends React.Component {

    renderBoard(rows, columns){
        let squareRows = [];
        for(let i = 0; i < rows; i++){
            squareRows.push(this.renderRow(i, columns));
        }

        return (
            <div>
                {squareRows}
            </div>
        );
    }

    renderRow(rowNumber, columns){
        let row = [];
        for(let i = 0; i < columns; i++){
            const index = rowNumber * columns + i;
            if(this.props.winSquares && this.props.winSquares.includes(index)){
                row.push(this.renderSquare((index), true));
            }else{
                row.push(this.renderSquare((index), false));
            }
        }

        return (
            <div className="board-row">
                {row}
            </div>
        );
    }

    renderSquare(i, isWinSquare) {
      return <Square 
      value={this.props.squares[i]}
      isWinSquare={isWinSquare}
      onClick={() => this.props.onClick(i)}

      />
    }

    render() {
      return (
          this.renderBoard(3, 3)
      );
    }
  }

  
  class Game extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                squareClicked: -1,
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length -1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                squareClicked: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            sortAscending: true,
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0, 
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        
        const moves = history.map((step, move) => {
            const squareClicked = step.squareClicked;
            const row = Math.floor(squareClicked/3);
            const col = squareClicked%3;
            const loc = "("+ col + ", " + row + ")"; 
            const desc = move ?
            'Go to move #' + move + loc:
            "Go to game start";
            return (
                <li key={move}>
                    <button onClick={() => {
                    this.jumpTo(move)
                    }}>
                    {this.state.stepNumber === move?<b>{desc}</b> : desc}
                    </button>
                </li>
            );
        });

        let status;
        if(winner){
            status = "Winner: " + (this.state.xIsNext? "O" : "X");
        }else if(history.length === 10){
            status = "Draw!"
        }else{
            status = "Next player: " + (this.state.xIsNext? 'X' : 'O');
        }
      return (
        <div className="game">
          <div className="game-board">
            <Board
                squares={current.squares}
                winSquares={winner}
                onClick={(i) => this.handleClick(i)}           
            />
            
          </div>
          <div className="game-info">
            <div>{status}</div>
            <br/>
            <button onClick={() => this.setState({sortAscending: !this.state.sortAscending})}>
                Toggle Sort Asc/Desc
            </button>
            <ol>{moves.sort((a, b) =>{
                if(this.state.sortAscending){
                    return a.key - b.key;
                }
                return b.key - a.key;
            })}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

function calculateWinner(squares){
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    for(let line of lines){
        const [a, b, c] = line;
        if(squares[a] && squares[a] === squares[b]&& squares[a] === squares[c]){
            return line;
        }
    }
    return null;
}
  