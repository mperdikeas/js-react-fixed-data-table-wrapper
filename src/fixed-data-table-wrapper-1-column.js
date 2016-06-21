var cx = require('classnames');
const React = require('react');
import {Cell, Column} from 'fixed-data-table';
const MJBCell = require('./fixed-data-table-wrapper-1-cell.js');


const ColumnHeader = React.createClass({
    propTypes: {
        columnNameElem  : React.PropTypes.object.isRequired,
        columnName      : React.PropTypes.string.isRequired,
        sortOrderSign   : React.PropTypes.string.isRequired,
        cycleSearchOrder: React.PropTypes.func.isRequired,
        inputElem       : React.PropTypes.object.isRequired
    },
    render: function() {
        const newColumnNameElem = React.cloneElement(this.props.columnNameElem
                                                     , {columnName: this.props.columnName,
                                                        sortOrderSign: this.props.sortOrderSign,
                                                        cycleSearchOrder: this.props.cycleSearchOrder
                                                       });
        return (
                <div>
                {newColumnNameElem}
                {this.props.inputElem}
                </div>
        );
    }
});

const ColumnName = React.createClass({
    propTypes: {
        classNames: React.PropTypes.arrayOf(React.PropTypes.string)
    },
    
    render: function() {
        var columnNameStyle = {
            cursor: 'pointer'
        };
        return (
                <div className={cx(this.props.classNames)} style={columnNameStyle} onClick={this.props.cycleSearchOrder}>
                {this.props.columnName}{this.props.sortOrderSign}
            </div>
        );
    }
});


const MJBColumn = React.createClass({
    propTypes: {
        columnName       : React.PropTypes.string.isRequired,
        width            : React.PropTypes.number.isRequired,
        flexGrow         : React.PropTypes.number.isRequired,
        rows             : React.PropTypes.array.isRequired,
        cellClasses      : React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
        cellPath         : React.PropTypes.string.isRequired,
        align            : React.PropTypes.string.isRequired,
        headerEl         : React.PropTypes.object.isRequired,
        searchFilter     : React.PropTypes.object.isRequired,
        setSearchFilter  : React.PropTypes.func.isRequired,
        sortOrderSign    : React.PropTypes.string.isRequired,
        cycleSearchOrder : React.PropTypes.func.isRequired
    },
    render: function() {
        console.log('foo');
        const newHeader = React.cloneElement(this.props.headerEl,
                                             {columnName: this.props.columnName,
                                              searchFilter: this.props.searchFilter.v,
                                              setSearchFilter: this.props.setSearchFilter,
                                              cycleSearchOrder: this.props.cycleSearchOrder});
                                              
        return (
                <Column
                width   ={this.props.width}
                flexGrow={this.props.flexGrow}
                cell    ={<MJBCell className={cx.apply(null, this.props.cellClasses)}
                          rows    ={this.rows}
                          jsPath  ={this.cellPath}
                          />}
                align={this.props.align}
                header={newHeader}
                />
        );
    }
});

const MJBColumnF = function (rows, {name, width, flexGrow, classes,
                                    cellEl,
                                    dataPath, dataFunc, align, headerEl, heightFactor, filterGetter, filterSetter, sortSign, cycleSort}) {
        const newHeader = React.cloneElement(headerEl,
                                             {columnNameClasses: classes.columnName,
                                              columnName: name,
                                              heightFactor: heightFactor,
                                              filterGetter: filterGetter,
                                              filterSetter: filterSetter,
                                              sortOrderSign   : sortSign,
                                              cycleSearchOrder: cycleSort});
        return (
                <Column
                key     ={name}
                columnKey={name}
                width   ={width}
                flexGrow={flexGrow}
            cell    ={<MJBCell
                          cellEl={cellEl}
                          className={cx.apply(null, classes.cells)}
                          rows    ={rows}
                          jsPath  ={dataPath}
                          f={dataFunc}
                          />}
                align={align}
                header={newHeader}
                />
        );
};


exports.ColumnHeader = ColumnHeader ;
exports.ColumnName   = ColumnName   ;
exports.MJBCell      = MJBCell      ;
// exports.MJBColumn    = MJBColumn    ; // not used yet
exports.MJBColumnF   = MJBColumnF   ;


