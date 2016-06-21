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


exports.DefaultCell = DefaultCell;
