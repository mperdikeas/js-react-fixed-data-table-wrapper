'use strict';
// require('fixed-data-table/dist/fixed-data-table.min.css');
const     _ = require('lodash');
const     $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
var cx = require('classnames');
import assert from 'assert';
import {Table, Column, Cell} from 'fixed-data-table';
import {FilteredDataStore} from 'filtered-datastore';

const jp                 = require('jsonpath-plus');
import {MJBColumn, MJBCell, MJBColumnF}                    from './fixed-data-table-wrapper-1-column.js';
import {MyTable, ColumnSpecification}                      from './fixed-data-table-wrapper-1-table-dumb.js';
import {TextualColumnSearchHeader, DateColumnSearchHeader} from  './fixed-data-table-wrapper-1-column-search-headers.js';
import {Sort, SortHub, SortHolder}                         from 'sort-enum';
import {DefaultCell} from './fixed-data-table-wrapper-1-cell-types.js';

class HighLevelColumnConfiguration {
    constructor({name, width=0, flexGrow=1, classes, 
                 cellEl=DefaultCell.el( (o, i, col)=>{window.alert(`clicked on ${col}, row: ${i}, data: ${JSON.stringify(o)}`);} ),
                 dataPath, dataFunc, align='left', headerEl, defaultHeaderElHeightFactor=1, filterPredFact, sortFunc, filterInitialValue}) {
        this.name = name;
        this.width = width;
        this.flexGrow = flexGrow;
        this.classes = classes;
        this.cellEl   = cellEl;
        this.dataPath = dataPath;
        this.dataFunc = dataFunc;
        this.align = align;
        this.headerEl = headerEl;
        this.defaultHeaderElHeightFactor = defaultHeaderElHeightFactor;
        this.filterPredFact = filterPredFact;
        this.sortFunc = sortFunc;
        this.filterInitialValue = filterInitialValue;
    }
}

class SortHolderWithSortFunc extends SortHolder {
    constructor(sortHub, initialValue, sortFunc) {
        super(sortHub, initialValue);
        this.sortFunc = sortFunc;
    }
}

const MyTableContainer = React.createClass({

    propTypes: {
        rows   : React.PropTypes.instanceOf(FilteredDataStore).isRequired,
        highColumnConfigs : React.PropTypes.array.isRequired
    },
    generateAllApplicableFilters: function(stateToUse) {
        const configAndFilters = _.zip(this.props.highColumnConfigs, stateToUse.filters);
        return _.map(configAndFilters, ([{filterPredFact}, filter])=>{
            return this.props.rows.deriveFilter(filterPredFact(filter));
        });
    },
    getInitialState: function() {
        this.sortHub = new SortHub(false);
        this.sortHolders = this.props.highColumnConfigs.map ( ({sortFunc}) => new SortHolderWithSortFunc(this.sortHub, Sort.NONE, sortFunc) );
        return {
            rows          : this.props.rows.allFiltered(),
            dirty         : false,
            width         : 0,
            height        : 200,
            filters       : this.props.highColumnConfigs.map ( (x) => x.filterInitialValue ),
            sortOrders    : this.sortHolders.map( (x) => x.v )
        };
    },
    calculateRowsSubjectToFilteringAndSorting(stateToUse) {
        this.props.rows.installFilters(this.generateAllApplicableFilters(stateToUse));
        let rowsFiltered = this.props.rows.allFiltered();
        const sortHolder = this.sortHub.returnSingleNonNoneRef();
        if (sortHolder!=null) {
            rowsFiltered = _.sortBy(rowsFiltered, sortHolder.sortFunc);
            if (sortHolder.v===Sort.DESC)
                rowsFiltered = _.reverse(rowsFiltered);
        }
        return rowsFiltered;
    },
    setDirtyState(o) {
        this.setState(Object.assign({}, o, {dirty: true}));
    },
    setCleanState(o) {
        this.setState(Object.assign({}, o, {dirty: false}));
    },
    componentWillUpdate(_, newState) {
        if (newState.dirty)
            this.setCleanState(Object.assign({}
                                             , newState
                                             , {rows: this.calculateRowsSubjectToFilteringAndSorting(newState)}));
    },
    getContainerDimensions: function() {
        if (this.isMounted()) {
            const DOMNODE = ReactDOM.findDOMNode(this);
            return {width: DOMNODE.clientWidth};
        } else
            throw new Error('I was never expecting this method to be called when I am not mounted');
    },
    updateDimensions: _.throttle(function() {
        const dims = this.getContainerDimensions();
        console.log(`Container dimensions calculated as: ${JSON.stringify(dims)})`);
        this.setState(this.getContainerDimensions());
    }, 250),
    componentDidMount: function() {
        window.addEventListener('resize', this.updateDimensions);
        this.updateDimensions();
    },
    componentWillUnmount: function() {
        window.removeEventListener('resize', this.updateDimensions);
    },
    render: function() {
        // hlcc = High-Level Column Configurations
        const hlcc_filters_sortOrders = _.zip(this.props.highColumnConfigs, this.state.filters, this.sortHolders, this.state.sortOrders);
        const lowLevelColumnSpecs = hlcc_filters_sortOrders.map( ([x, filter, sortHolder, sortOrder], i)=> {
            return new ColumnSpecification({
                name       : x.name,
                width      : x.width,
                flexGrow   : x.flexGrow,
                classes    : x.classes,
                cellEl     : x.cellEl,
                dataPath   : x.dataPath,
                dataFunc   : x.dataFunc,
                align      : x.align,
                headerEl   : x.headerEl,
                defaultHeaderElHeightFactor: x.defaultHeaderElHeightFactor,
                filterGetter : ()=>filter,
                filterSetter : (v)=>{
                    const filters = this.state.filters.slice();
                    filters[i]=Object.assign({}, filters[i], v);
                    this.setDirtyState({filters: filters});
                },
                sortSign   : sortOrder.sign,
                cycleSort  : () => {
                    sortHolder.next();
                    this.setDirtyState({sortOrders: this.sortHolders.map( (x)=>(x.v) )});
                }
            });
        });
        return (
            <MyTable
            rows                = {this.state.rows}
            sizeOfUnfilteredColl= {this.props.rows.getUnderlyingSize()}
            width               = {this.state.width}
            height              = {this.state.height}

            columnSpecs         = {lowLevelColumnSpecs}

            />
        );
    }
});

exports.MyTableContainer             = MyTableContainer;
exports.HighLevelColumnConfiguration = HighLevelColumnConfiguration;



