'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var extend = require('deep-extend');

module.exports = yeoman.Base.extend({
    initializing: function () {
        this.props = {};
    },
    prompting: function () {
        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the pioneering ' + chalk.red('generator-webpack-mpa') + ' generator!'
        ));
    },
    default: function () {
        this.composeWith('node:app', {
            options: {
                babel: false,
                gulp: false,
                coveralls: false,
                boilerplate: false,
                projectRoot: 'generators',
                skipInstall: this.options.skipInstall
            }
        }, {
            local: require.resolve('generator-node/generators/app')
        });
    },
    writing: function () {
        this.fs.copy(
            this.templatePath('config'),
            this.destinationPath('config')
        );
        this.fs.copy(
            this.templatePath('config/.eslintrc'),
            this.destinationPath('config/.eslintrc')
        );
        this.fs.copy(
            this.templatePath('src'),
            this.destinationPath('src')
        );
        this.fs.copy(
            this.templatePath('webpack.config.js'),
            this.destinationPath('webpack.config.js')
        );
        this.fs.copy(
            this.templatePath('.gitignore'),
            this.destinationPath('.gitignore')
        );
        var pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
        extend(pkg, {
            scripts: {
                "dev": "webpack-dashboard -c cyan -- webpack-dev-server --config ./config/webpack.dev.js --content-base dist/",
                "prod": "NODE_ENV=prod webpack",
                "prepublish": "npm run prod"
            },
            devDependencies: {
                "autoprefixer-loader": "^3.2.0",
                "bell-on-bundler-error-plugin": "^1.0.8",
                "css-loader": "^0.25.0",
                "eslint": "^3.8.1",
                "eslint-loader": "^1.6.0",
                "extract-text-webpack-plugin": "^1.0.1",
                "html-webpack-plugin": "^2.24.0",
                "img-loader": "^1.3.1",
                "less": "^2.7.1",
                "less-loader": "^2.2.3",
                "style-loader": "^0.13.1",
                "file-loader": "^0.9.0",
                "url-loader": "^0.5.7",
                "webpack": "^1.13.2",
                "webpack-dashboard": "^0.2.0",
                "webpack-dev-server": "^1.16.2",
                "webpack-merge": "^0.15.0",
                "webpack-shell-plugin": "^0.4.3"
            }
        });
        pkg.keywords = pkg.keywords || [];
        
        if (!~pkg.keywords.indexOf('yeoman-generator')) {
            pkg.keywords.push('yeoman-generator');
        }

        this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    },
    install: function () {
        this.installDependencies();
    }
});