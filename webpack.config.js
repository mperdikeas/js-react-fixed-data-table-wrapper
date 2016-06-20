'use strict';
const path = require('path');


const config = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                include: path.resolve(__dirname, 'src/')
            },{
                test: /\.css$/,
                loaders: ['style', 'css']
            }
        ]
    },
    plugins: []
};

module.exports = config;
