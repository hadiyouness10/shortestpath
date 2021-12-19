import React, { Component } from 'react';
import './Node.css';

export default class Node extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        const {
            col,
            isFinish,
            isStart,
            row
        } = this.props;
        const extraClassName = isFinish ? 'node-finish' : isStart ? 'node-start' : '';

        return <div
            id={`node-${row}-${col}`}
            className={`node ${extraClassName}`}
            
        ></div>
                
    }
}

export const DEFAULT_NODE = {
    row: 0,
    col:0
}