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
        return (<Cell {...allPropsExceptVO} onClick={()=>{this.props.click(o, this.props.rowIndex, this.props.columnKey);}}>
                    {v}
                </Cell>
               );
    }
});

// function f will be called with three arguments:
// o: the row object
// i: the index (in the filtered set)
// col: the column name
DefaultCell.elWithClickHandler = function (f) {
    return (<DefaultCell
                click={f}
            />);
};

DefaultCell.elWithoutClickHandler = function () {
    return (<DefaultCell/>);
};


exports.DefaultCell = DefaultCell;
