const     _ = require('lodash');
const React = require('react');


import {Cell} from 'fixed-data-table';
const jp = require('jsonpath-plus');


const MJBCell = React.createClass({
    propTypes: {
        rows  : React.PropTypes.array.isRequired,
        jsPath: React.PropTypes.string.isRequired,
        f: React.PropTypes.func
    },

    remainingProps: function () {
        const rv = {};
        for (let v in this.props) {
            if (!_.includes(['rows', 'jsPath', 'f', 'rowIndex', 'height', 'width', 'columnKey'], v))
                rv[v]=this.props[v];
        }
        const {rows, jsPath, f, rowIndex, height, width, columnKey, ...rv2} =  this.props; // this is an alternative way to ignore properties
        if (!_.isEqual(rv, rv2))
            throw new Error();
        if (false)
            console.log(`Keeping only ${_.keys(rv).length} (rv2: ${_.keys(rv2).length}) properties out of an initial total of ${_.keys(this.props).length}`);
        return rv;
    },
    
    render: function() {
        const o = this.props.rows[this.props.rowIndex];
        const _v = jp({json: o, path: this.props.jsPath})[0];
        let v = _v;
        if (this.props.f) {
            v = this.props.f(_v);
        }
        return (
                <Cell
                    {...this.remainingProps()}
                > 
                    {v}
                </Cell>
                );
    }
});

module.exports      = MJBCell;
