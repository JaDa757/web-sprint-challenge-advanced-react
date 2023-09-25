import React, { useState } from 'react';

const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4; 

export default function AppFunctional(props) {
  const [state, setState] = useState({
    message: initialMessage,
    email: initialEmail,
    index: initialIndex,
    currentX: 2,
    currentY: 2,
    steps: initialSteps,
    validationErrors: [],
  });

  function reset() {
    setState({
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      currentX: 2,
      currentY: 2,
      steps: initialSteps,
      validationErrors: [],
    });
  }

  function getNextIndex(direction) {
    const numRows = 3;
    const numCols = 3;

    const currentRow = state.currentY - 1;
    const currentCol = state.currentX - 1;

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

  function move(direction) {
    const nextIndex = getNextIndex(direction);

    let newCurrentX = state.currentX;
    let newCurrentY = state.currentY;
    let errorMessage = '';

    if (
      (direction === 'left' && newCurrentX > 1) ||
      (direction === 'right' && newCurrentX < 3) ||
      (direction === 'up' && newCurrentY > 1) ||
      (direction === 'down' && newCurrentY < 3)
    ) {
      if (nextIndex !== state.index) {
        newCurrentX += direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
        newCurrentY += direction === 'up' ? -1 : direction === 'down' ? 1 : 0;

        setState((prevState) => ({
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
      setState({ ...state, message: errorMessage });
    }
  }

  function onChange(evt) {
    setState({ ...state, email: evt.target.value });
  }

  async function onSubmit(evt) {
    evt.preventDefault();

    const { email, currentX, currentY, steps } = state;

    if (!email) {
      setState({ ...state, message: 'Ouch: email is required.' });
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
        setState({
          ...state,
          message: data.message,
          email: '',
        });
      } else {
        const errorData = await response.json();
        setState({ ...state, message: `${errorData.message}` });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates ({state.currentX}, {state.currentY})</h3>
        <h3 id="steps">You moved {state.steps} {state.steps === 1 ? 'time' : 'times'}</h3>
      </div>
      <div id="grid">
        {Array.from({ length: 9 }).map((_, idx) => (
          <div key={idx} className={`square${idx === state.index ? ' active' : ''}`}>
            {idx === state.index ? 'B' : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{state.message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => move('left')}>
          LEFT
        </button>
        <button id="up" onClick={() => move('up')}>
          UP
        </button>
        <button id="right" onClick={() => move('right')}>
          RIGHT
        </button>
        <button id="down" onClick={() => move('down')}>
          DOWN
        </button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="Type email"
          value={state.email}
          onChange={onChange}
        />
        <input id="submit" type="submit" value="Submit" />
      </form>
    </div>
  );
}