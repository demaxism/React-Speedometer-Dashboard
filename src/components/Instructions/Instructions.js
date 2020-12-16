import React from 'react';
import './Instructions.css';
import emoji from './emoji.svg'

const Instructions = (props) => (
    <div className="instructions">
        <img alt="laughing crying emoji" src={emoji} />
        <p>Hi {props.cname}, Click on an emoji to view the emoji short name.</p>
        <p>{false && "condition"}</p>
    </div>
)

export default Instructions;