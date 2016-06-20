if (!global._babelPolyfill)
    require('babel-polyfill');


import {MyTableContainer, HighLevelColumnConfiguration}    from './fixed-data-table-wrapper-1-table-smart.js'          ;
import {TextualColumnSearchHeader, DateColumnSearchHeader} from './fixed-data-table-wrapper-1-column-search-headers.js';

exports.MyTableContainer             = MyTableContainer;
exports.HighLevelColumnConfiguration = HighLevelColumnConfiguration;
exports.TextualColumnSearchHeader    = TextualColumnSearchHeader;
exports.DateColumnSearchHeader       = DateColumnSearchHeader;


