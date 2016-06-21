const     _ = require('lodash');
const React = require('react');


import {Cell} from 'fixed-data-table';
const jp = require('jsonpath-plus');


const MJBCell = React.createClass({
    propTypes: {
        cellEl: React.PropTypes.element.isRequired,
        rows  : React.PropTypes.array.isRequired,
        jsPath: React.PropTypes.string.isRequired,
        f: React.PropTypes.func
    },

    remainingProps: function () {
        const rv = {};
        for (let v in this.props) {
            if (!_.includes(['rows', 'jsPath', 'f', 'height', 'width'], v))
                rv[v]=this.props[v];
        }
        const {rows, jsPath, f, height, width, ...rv2} =  this.props; // this is an alternative way to ignore properties
        if (!_.isEqual(rv, rv2))
            throw new Error();
        return rv;
    },
    
    render: function() {
        const o = this.props.rows[this.props.rowIndex];
        const _v = jp({json: o, path: this.props.jsPath})[0];
        let v = _v;
        if (this.props.f) {
            v = this.props.f(_v);
        }
        if (false)
        return (
                <Cell
                    {...this.remainingProps()}
                > 
                    {v}
                </Cell>
                )
       if (false)
        return (
            <span className={this.props.className}>
                  {v}
                </span>
        );
        if (true) {
            const clonedEl = React.cloneElement(this.props.cellEl,
            Object.assign({},this.remainingProps(),{v:v},{o:o})
            );
            return clonedEl    ;
        }
    }
});

module.exports      = MJBCell;
