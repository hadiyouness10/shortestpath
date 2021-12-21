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
            row,
            isWall,
            onMouseDown,
            onMouseEnter,
            onMouseUp,
            onMouseLeave, 
            estimatedDistanceToEnd,
            distanceFromStart,
            id,
            hasWeight
        } = this.props;
        const extraClassName = isFinish ? 'node-finish' : isStart ? 'node-start' : isWall? 'node-wall': hasWeight? 'node-weight': '';

        return (<div
            id={`node-${row}-${col}`}
            className={`node ${extraClassName}`}
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter(row, col)}
            onMouseUp = {() => onMouseUp()}
            onMouseLeave={() => onMouseLeave(row,col)}
        ></div>)
                
    }
}

export const DEFAULT_NODE = {
    row: 0,
    col:0
}