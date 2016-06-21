const React = require('react');

import {Cell} from 'fixed-data-table';

const DefaultCell = React.createClass({
    propTypes: {
        o: React.PropTypes.object,
        v: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object, React.PropTypes.number]),
                click: React.PropTypes.func
               },
    render: function() {
        const {v, o, ...allPropsExceptVO} = this.props;
        const props = Object.assign(allPropsExceptVO, this.props.click?
                                    {onClick: ()=>{this.props.click(o, this.props.rowIndex, this.props.columnKey);}}
                                    : {});
                                    
        return (<Cell {...props}>
                    {v}
                </Cell>
               );
    }
});

// function [clickHandler] will be called with three arguments:
// o: the row object
// i: the index (in the filtered set)
// col: the column name
DefaultCell.el = function (clickHandler) {
    if (clickHandler)
        return (<DefaultCell
                click={clickHandler}
                />);
    else
        return (<DefaultCell/>);
};

exports.DefaultCell = DefaultCell;
