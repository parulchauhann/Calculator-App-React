import React, { useReducer } from 'react'
import './App.css'
import Button from './Component/Button.jsx'
import Operation from './Component/Operation.jsx'

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};


function evaluate({ currentOperand, prevOperand, operation }) {
  const previous = parseFloat(prevOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(previous) || isNaN(current)) return " "
  let computation = " "
  switch (operation) {
    case "+":
      computation = previous + current;
      break;
    case "-":
      computation = previous - current;
      break;
    case "*":
      computation = previous * current;
      break;
    case "/":
      computation = previous / current;
      break;
  }
  return computation.toString()
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === 0 && state.currentOperand === 0) {
        return state;
      }
      if (payload.digit === '.' && (state.currentOperand || " ").includes(".")) {
        return state;
      }
      if (state.currentOperand === null && state.prevOperand === null) {
        return {
          ...state,
          currentOperand: payload.digit,
        };
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.prevOperand == null) {
        return state
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }
      if (state.prevOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          prevOperand: state.currentOperand,
          currentOperand: null,
        }
      }

    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.DELETE_DIGIT:

      if (state.currentOperand == null) return state
      if (state.currentOperand.length !== 0) {
        return {
          ...state,
          overwrite: false,
          currentOperand: state.currentOperand.slice(0, -1),
        }
      }
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null }
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      }

    case ACTIONS.EVALUATE:
      if (state.currentOperand && state.prevOperand && state.operation) {
        const result = evaluate(state);
        return {
          currentOperand: result,
          prevOperand: null,
          operation: null,
          overwrite: true,
        };
      }
      return state;
  }
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function convertOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ currentOperand, prevOperand, operation }, dispatch] = useReducer(reducer, {})
  return (
    <>
      <div className="calculator-pad">
        <div className="playGround">
          <div className="top">{convertOperand(prevOperand)}{operation}</div>
          <div className="bottom">{convertOperand(currentOperand)}</div>
        </div>
        <div className="row row-odd" id="row-1">
          <button className='actions' onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
          <button className='actions' onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
          <Operation operation="/" dispatch={dispatch} />
        </div>
        <div className="row row-even" id="row-2">
          <Button digit="9" dispatch={dispatch} />
          <Button digit="8" dispatch={dispatch} />
          <Button digit="7" dispatch={dispatch} />
          <Operation operation="+" dispatch={dispatch} />
        </div>
        <div className="row row-even" id="row-3">
          <Button digit="6" dispatch={dispatch} />
          <Button digit="5" dispatch={dispatch} />
          <Button digit="4" dispatch={dispatch} />
          <Operation operation="-" dispatch={dispatch} />
        </div>
        <div className="row row-even" id="row-4">
          <Button digit="3" dispatch={dispatch} />
          <Button digit="2" dispatch={dispatch} />
          <Button digit="1" dispatch={dispatch} />
          <Operation operation="*" dispatch={dispatch} />
        </div>
        <div className="row row-odd" id="row-5">
          <Button digit="." dispatch={dispatch} />
          <Button digit="0" dispatch={dispatch} />
          <button className='actions' onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
        </div>

      </div>
    </>
  )
}

export default App