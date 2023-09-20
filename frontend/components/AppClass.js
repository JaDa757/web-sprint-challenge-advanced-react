import React, { useState, useEffect } from 'react'

// Suggested initial states
export default class AppClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      email: '',
      index: 4,
      steps: 0,
    };
  }


  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  reset = () => {
    this.setState({
      message: '',
      email: '',
      index: 4,
      steps: 0,
    });
  };

  getNextIndex = (direction) => {
    // Define the dimensions of your grid
    const numRows = 3;
    const numCols = 3;

    // Calculate the current row and column of "B" based on the current index
    const currentRow = Math.floor(this.state.index / numCols);
    const currentCol = this.state.index % numCols;

    // Define a mapping of directions to their corresponding row and column changes
    const directionMap = {
      left: { rowChange: 0, colChange: -1 },
      up: { rowChange: -1, colChange: 0 },
      right: { rowChange: 0, colChange: 1 },
      down: { rowChange: 1, colChange: 0 },
    };

    // Get the row and column changes for the given direction
    const { rowChange, colChange } = directionMap[direction];

    // Calculate the new row and column based on the direction
    const nextRow = currentRow + rowChange;
    const nextCol = currentCol + colChange;

    // Calculate the new index
    const nextIndex = nextRow * numCols + nextCol;

    // Ensure the new index is within the grid boundaries
    return Math.max(0, Math.min(numRows * numCols - 1, nextIndex));
  };

  move = (direction) => {
    const nextIndex = this.getNextIndex(direction);
    if (nextIndex !== this.state.index) {
      this.setState((prevState) => ({
        index: nextIndex,
        steps: prevState.steps + 1,
        message: `Moved ${direction}`,
      }))
    }
  }

  onChange = (evt) => {
    this.setState({ email: evt.target.value });
  }

  onSubmit = async (evt) => {
    evt.preventDefault();
    // Implement logic to send a POST request to the server with this.state.email
    try {
      // Send the request and handle the response
      const response = await fetch('http://localhost:9000/api/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: this.state.email }),
      });

      if (response.ok) {
        
        const data = await response.json();
        
        this.setState({ message: data.message });
        
        this.setState({ email: '' });
      } else {
        // Handle errors
        // You can update the message state to display an error message
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle network or other errors
    }
  }


  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates (2, 2)</h3>
          <h3 id="steps">You moved 0 times</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === 4 ? ' active' : ''}`}>
                {idx === 4 ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message"></h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={() => this.move('left')}>LEFT</button>
          <button id="up" onClick={() => this.move('up')}>UP</button>
          <button id="right" onClick={() => this.move('right')}>RIGHT</button>
          <button id="down" onClick={() => this.move('down')}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            id="email"
            type="email"
            placeholder="type email"
            value={this.state.email}
            onChange={this.onChange}
          >
          </input>

          <input
            id="submit"
            type="submit"
            value='Submit'
          />
        </form>
      </div>
    )
  }
}

