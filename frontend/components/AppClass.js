import React, { Component } from 'react';

const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4;

class AppClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      currentX: 2,
      currentY: 2,
      steps: initialSteps,
      validationErrors: [],
    };
  }

  reset = () => {
    this.setState({
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      currentX: 2,
      currentY: 2,
      steps: initialSteps,
      validationErrors: [],
    });
  }

  getNextIndex = (direction) => {
    const numRows = 3;
    const numCols = 3;
    const { currentX, currentY } = this.state;

    const currentRow = currentY - 1;
    const currentCol = currentX - 1;

    const directionMap = {
      left: { rowChange: 0, colChange: -1 },
      up: { rowChange: -1, colChange: 0 },
      right: { rowChange: 0, colChange: 1 },
      down: { rowChange: 1, colChange: 0 },
    };

    const { rowChange, colChange } = directionMap[direction];

    const nextRow = currentRow + rowChange;
    const nextCol = currentCol + colChange;

    const limitedNextRow = Math.max(0, Math.min(numRows - 1, nextRow));
    const limitedNextCol = Math.max(0, Math.min(numCols - 1, nextCol));

    const nextIndex = limitedNextRow * numCols + limitedNextCol;

    return nextIndex;
  }

  move = (direction) => {
    const nextIndex = this.getNextIndex(direction);

    let newCurrentX = this.state.currentX;
    let newCurrentY = this.state.currentY;
    let errorMessage = '';

    if (
      (direction === 'left' && newCurrentX > 1) ||
      (direction === 'right' && newCurrentX < 3) ||
      (direction === 'up' && newCurrentY > 1) ||
      (direction === 'down' && newCurrentY < 3)
    ) {
      if (nextIndex !== this.state.index) {
        newCurrentX += direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
        newCurrentY += direction === 'up' ? -1 : direction === 'down' ? 1 : 0;

        this.setState((prevState) => ({
          ...prevState,
          index: nextIndex,
          steps: prevState.steps + 1,
          message: '',
          currentX: newCurrentX,
          currentY: newCurrentY,
        }));
      }
    } else {
      errorMessage = `You can't go ${direction}`;
      this.setState({ message: errorMessage });
    }
  }

  onChange = (evt) => {
    this.setState({ email: evt.target.value });
  }

  onSubmit = async (evt) => {
    evt.preventDefault();

    const { email, currentX, currentY, steps } = this.state;

    if (!email) {
      this.setState({ message: 'Ouch: email is required.' });
      return;
    }

    try {
      const response = await fetch('http://localhost:9000/api/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, x: currentX, y: currentY, steps }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setState({
          message: data.message,
          email: '',
        });
      } else {
        const errorData = await response.json();
        this.setState({ message: `${errorData.message}` });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  render() {
    return (
      <div id="wrapper" className={this.props.className}>
        <div className="info">
          <h3 id="coordinates">Coordinates ({this.state.currentX}, {this.state.currentY})</h3>
          <h3 id="steps">You moved {this.state.steps} {this.state.steps === 1 ? 'time' : 'times'}</h3>
        </div>
        <div id="grid">
          {Array.from({ length: 9 }).map((_, idx) => (
            <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
              {idx === this.state.index ? 'B' : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={() => this.move('left')}>
            LEFT
          </button>
          <button id="up" onClick={() => this.move('up')}>
            UP
          </button>
          <button id="right" onClick={() => this.move('right')}>
            RIGHT
          </button>
          <button id="down" onClick={() => this.move('down')}>
            DOWN
          </button>
          <button id="reset" onClick={this.reset}>
            reset
          </button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            id="email"
            type="email"
            placeholder="Type email"
            value={this.state.email}
            onChange={this.onChange}
          />
          <input id="submit" type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default AppClass;
