


module.exports = {
    //context: __dirname + '/src',
    entry: {
        //javascript: __dirname + '/index.js',
        javascript:__dirname + '/index.js',
        html: './index.html',
        css: './main.css'
    },

    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist'
    },
    module: {
        loaders: [
            {
                test: /.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.html$|.css$/,
                loader: "file?name=[name].[ext]",
            },

        ]
    },
};


