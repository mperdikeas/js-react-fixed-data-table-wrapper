'use strict';
// require('fixed-data-table/dist/fixed-data-table.min.css');
const     _ = require('lodash');
const     $ = require('jquery');
const React = require('react');
import {Table, Column, Cell} from 'fixed-data-table';
import assert from 'assert';

import {MJBColumnF}  from './fixed-data-table-wrapper-1-column.js';


class ColumnSpecification {

    constructor({name, width=0, flexGrow=1, classes, cellEl,
                 dataPath, dataFunc=(x)=>x, align='right', headerEl, defaultHeaderElHeightFactor, filterGetter, filterSetter, sortSign, cycleSort}) {
        assert(typeof name     === typeof '');
        assert(typeof width    === typeof 0);
        assert(typeof flexGrow === typeof 0); // TODO: build a library for this ...
        this.name     = name;
        this.width    = width;
        this.flexGrow = flexGrow;
        this.classes  = classes;
        this.cellEl   = cellEl;
        this.dataPath = dataPath;
        this.dataFunc = dataFunc;
        this.align    = align;
        this.headerEl = headerEl;
        this.defaultHeaderElHeightFactor = defaultHeaderElHeightFactor;
        this.filterGetter   = filterGetter;
        this.filterSetter= filterSetter;
        this.sortSign = sortSign;
        this.cycleSort= cycleSort;
    }
}

const MyTable = React.createClass({

    propTypes: {
        rows                : React.PropTypes.array.isRequired,
        sizeOfUnfilteredColl: React.PropTypes.number.isRequired,
        width               : React.PropTypes.number.isRequired,
        height              : React.PropTypes.number.isRequired,
        columnSpecs         : React.PropTypes.arrayOf( (propValue, key)=>
            assert.equal(propValue[key].constructor, ColumnSpecification)
                                                     ).isRequired,
        footNotePrefix      : React.PropTypes.string
    },

    columns: function() {
        let maxInitialHeightFactor = -1;
        for (let i = 0 ; i < this.props.columnSpecs.length; i++) {
            maxInitialHeightFactor = Math.max(maxInitialHeightFactor, this.props.columnSpecs[i].defaultHeaderElHeightFactor);
        }
        return {
            maxHeightFactor: maxInitialHeightFactor,
            columns: this.props.columnSpecs.map ( (s) => {
                return MJBColumnF(
                    this.props.rows,
                    {
                        name          : s.name,
                        width         : s.width,
                        flexGrow      : s.flexGrow,
                        classes       : s.classes,
                        cellEl        : s.cellEl,
                        dataPath      : s.dataPath,
                        dataFunc      : s.dataFunc,
                        align         : s.align,
                        headerEl      : s.headerEl,
                        heightFactor  : maxInitialHeightFactor,
                        filterGetter  : s.filterGetter,
                        filterSetter  : s.filterSetter,
                        sortSign      : s.sortSign,
                        cycleSort     : s.cycleSort
                    });
            })
        };
    },

    render: function() {
        const footerOuterDivStyle = {background: 'lightdblue', padding: '0.2em'};
        const footerInnerDivStyle = {background: '#dee', fontFamily: 'monospace', fontSize: '70%', borderRadius: '0.5em', padding: '0.3em', fontStyle: 'italic'};
        const columns = this.columns();
        const prefix = (()=>{
            if (this.props.footNotePrefix) {
                const STAR = (<span style={{marginLeft: '.5em', marginRight: '.5em', fontSize:'200%', fontWeight: 'bold', fontStyle: 'normal', position: 'relative', top: '0.1em'}}>&#9734;</span>);
                return (<span>{this.props.footNotePrefix}{STAR}</span>);
            } else
                return null;
        })();
        return (
            <div>
                <Table id='foo'
                    height={this.props.height}
                    width={this.props.width}
                    rowsCount={this.props.rows.length}
                    rowHeight={26}
                    headerHeight={50+(columns.maxHeightFactor-1)*20}>
                    {columns.columns}
                </Table>
                <div style={footerOuterDivStyle}>
                <div style={footerInnerDivStyle}>
                        {prefix}
                        A total of <b>{this.props.rows.length}</b> rows matched the
                        filters (out of total of {this.props.sizeOfUnfilteredColl} locally fetched)
                    </div>
                </div>
            </div>
        );
    }
});

exports.MyTable              = MyTable;
exports.ColumnSpecification = ColumnSpecification;
