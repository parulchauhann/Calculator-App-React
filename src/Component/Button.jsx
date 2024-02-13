import React from 'react'
import { ACTIONS } from '../App'

function Button({ dispatch, digit }) {
    return (
        <div className='button'>
            <button className='button' onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}>
                {digit}
            </button>
        </div>
    )
}

export default Button