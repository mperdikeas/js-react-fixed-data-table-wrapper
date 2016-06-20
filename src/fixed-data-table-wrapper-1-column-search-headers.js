const     _ = require('lodash');
const     $ = require('jquery');
var cx = require('classnames');
const React = require('react');

import {Sort} from 'sort-enum';

var moment = require('moment');

import {ColumnHeader, ColumnName} from './fixed-data-table-wrapper-1-column.js';
import jp from 'jsonpath-plus';

const TextualColumnInput = React.createClass({
    propTypes: {
        initialPrompt   : React.PropTypes.string.isRequired,
        searchFilter    : React.PropTypes.string,
        setSearchFilter : React.PropTypes.func.isRequired,
        doubleSize      : React.PropTypes.bool.isRequired
    },
    getInitialState: function() {
        return {
            searchBlurred: true
        };
    },
    onChange: function (ev) {
        this.props.setSearchFilter(ev.target.value.trim());
    },
    initSearch: function (ev) {
        if (this.props.searchFilter===this.props.initialPrompt) {
            this.setState({
                searchBlurred: false
            });
            this.props.setSearchFilter('');
        }
    },
    onFocusChange: function() {
        this.setState({searchBlurred: false});
    },
    onBlurChange: function () {
        this.setState({searchBlurred: true});        
        if (this.props.searchFilter==='') {
            this.props.setSearchFilter(this.props.initialPrompt);
        }
    },
    render: function() {

        var inputStyle = {
            width: '100%'
        };
        const bottomBufferStyle = {
            background:  'repeating-linear-gradient(45deg, transparent, transparent 10px, #ccc 10px, #ccc 20px)',
            height    : '30px'
        };
        const buffer = this.props.doubleSize?(<div style={bottomBufferStyle}></div>):null;
        return (
                <div>
                <input style={inputStyle} type='search' className= {cx({'blur': this.state.searchBlurred})}
                                         value    = {this.props.searchFilter}
                                         onChange = {this.onChange}
                                         onClick  = {this.initSearch}
                                         onFocus  = {this.onFocusChange}
                                         onBlur   = {this.onBlurChange}
                />
                {buffer}
                </div>
        );
    }    
});



const TextualColumnSearchHeader = React.createClass({
    propTypes: {
        initialPrompt   : React.PropTypes.string.isRequired,
        columnNameClasses : React.PropTypes.arrayOf(React.PropTypes.string),
        columnName      : React.PropTypes.string,
        sortOrderSign   : React.PropTypes.string,
        cycleSearchOrder: React.PropTypes.func,
        filterGetter    : React.PropTypes.func,
        filterSetter    : React.PropTypes.func,
        heightFactor    : React.PropTypes.number
    },
    statics: {
        objify: (x) => ({v:x}),
        deObjify: ({v})=>v,
        // yes, this is a Factory that returns a Factory. How cool is that?
        // Honestly though I couldn't figure a simpler way to accomplish this
        textualInclusionFilterFactoryFactory: function(jPath, initialPrompt, caseSensitive=false) {
            return function(o) {
                const v = TextualColumnSearchHeader.deObjify(o);
                return function(o) {
                    if ((v==='') || (v===initialPrompt))
                        return ()=>true;
                    else {
                        const field = jp({json: o, path: jPath})[0];
                        if (caseSensitive)
                            return String(field).includes(String(v));
                        else
                            return String(field).toLowerCase().includes(String(v).toLowerCase());
                    }
                };
            };
        },
        doubleSizeFromHeightFactor: (heightFactor) => {
            switch (heightFactor) {
            case 1: return false;
            case 2: return true;
            default:
                throw new Error(`the TextualColumnSearchHeader can't set [heightFactor] to a value of [${heightFactor}]`);
            }
        },
        defaultHeightFactor: function() {
            return 1;
        }
    },
    initialHeightFactor: function() {
        return 2;
    },
    render: function() {
        const objify   = TextualColumnSearchHeader.objify;
        const deObjify = TextualColumnSearchHeader.deObjify;
        const columnNameElem = <ColumnName classNames={this.props.columnNameClasses}/>;
        const inputElem      = <TextualColumnInput
                                    initialPrompt = {this.props.initialPrompt}
                                    searchFilter    = {deObjify(this.props.filterGetter())}
                                    setSearchFilter = {(s)=>{this.props.filterSetter(objify(s));}}
                                    doubleSize      = {TextualColumnSearchHeader.doubleSizeFromHeightFactor(this.props.heightFactor)}
                               />;
        return (
                <ColumnHeader
                    columnNameElem   = {columnNameElem}
                    columnName       = {this.props.columnName}
                    sortOrderSign    = {this.props.sortOrderSign}
                    cycleSearchOrder = {this.props.cycleSearchOrder}
                    inputElem        = {inputElem}
                />
        );
    }
});



const DateColumnInput = React.createClass({
    propTypes: {
        fromSSE         : React.PropTypes.instanceOf(Date),
        untilSSE        : React.PropTypes.instanceOf(Date),
        setSearchFilter : React.PropTypes.func  .isRequired
    },

    onChangeFrom: function (ev) {
        this.props.setSearchFilter({fromSSE: new Date(ev.target.value)});
    },
    onChangeUntil: function (ev) {
        this.props.setSearchFilter({untilSSE: new Date(ev.target.value)});
    },

    render: function() {
        var datePickerDivStyle = {
            fontSize: '90%',
            display: 'inline-block'
        };
        var inputFontSize = {
            fontSize: '90%'
        };
        return (
                <div>
                    <div style={datePickerDivStyle}>
                        <span style={{marginRight: '3px'}}>from:</span>
                        <input style={inputFontSize} type={'date'}
                               value    = {this.props.fromSSE==null
                                           ?null
                                           :moment(this.props.fromSSE).format('YYYY-MM-DD')}
                               onChange = {this.onChangeFrom}
                        />
                    </div>
                    <div style={datePickerDivStyle}>
                        <span style={{marginRight: '3px'}}>until:</span>
                        <input style={inputFontSize} type={'date'}
                               value    = {this.props.untilSSE==null
                                           ?null
                                           :moment(this.props.untilSSE).format('YYYY-MM-DD')}
                               onChange = {this.onChangeUntil}            
                        />
                    </div>
                </div>
        );
    }
});

const DateColumnSearchHeader = React.createClass({
    propTypes: {
        columnNameClasses : React.PropTypes.arrayOf(React.PropTypes.string),        
        columnName      : React.PropTypes.string, // all the remaining are required but remain empty so that an empty template object
        sortOrderSign   : React.PropTypes.string, // can be created and (subsequently) populated
        cycleSearchOrder: React.PropTypes.func,
        filterGetter    : React.PropTypes.func,
        filterSetter    : React.PropTypes.func,
        heightFactor    : React.PropTypes.number        
    },

    statics: {
        defaultHeightFactor: function() {
            return 2;
        }
    },
    render: function() {
        const columnNameElem = <ColumnName classNames={this.props.columnNameClasses}/>;
        const inputElem = <DateColumnInput
                            fromSSE         = {this.props.filterGetter().fromSSE}
                            untilSSE        = {this.props.filterGetter().untilSSE}
                            setSearchFilter = {this.props.filterSetter}
            />;
        if ((this.props.heightFactor) && (this.props.heightFactor!=2))
            throw new Error(`the DateColumnSearchHeader component can't set [heightFactor] to a value of [${this.props.heightFactor}]`);
        return (
             <ColumnHeader
                    columnNameElem   = {columnNameElem}
                    columnName       = {this.props.columnName}
                    sortOrderSign    = {this.props.sortOrderSign}
                    cycleSearchOrder = {this.props.cycleSearchOrder}
                    inputElem        = {inputElem}
                />
        );
    }
});


exports.TextualColumnSearchHeader = TextualColumnSearchHeader;
exports.DateColumnSearchHeader    = DateColumnSearchHeader;


