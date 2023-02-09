let mix = require('laravel-mix');
let path = require('path');
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */

mix.setPublicPath('./themes/store/assets');

mix.alias({
  '@': path.join(__dirname + '/themes/' + process.env.MIX_THEME + '/assets'),
  '@vue': path.join(__dirname + '/themes/' + process.env.MIX_THEME + '/assets/src/vue')
});

mix.webpackConfig({
  resolve: {
    extensions: ['.js', '.vue', '.json'],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(vue|js)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'eslint-loader',
        options: {
          fix: false,
          cache: false,
          formatter: require('eslint-friendly-formatter')
        }
      },
    ]
  },
});

mix.js('./themes/store/assets/src/app.js', 'dist/js')
mix.js('./themes/store/assets/src/vue/index.js', 'dist/js/vue.js')
  .vue()
  .version()
  .sass('./themes/store/assets/src/app.scss', 'dist/css')
  .options({
    postCss: [
      require('postcss-url'),
      require('autoprefixer')({
        overrideBrowserslist: ['last 6 versions'],
            grid: true
      }),
      require('cssnano')({
          preset: ['default', {
              discardComments: {
                  removeAll: true,
              },
          }]
      }),
    ]
  })
  .browserSync({
    proxy: process.env.MIX_HOST,
    host: process.env.MIX_HOST,
    notify: false,
    files: [
      "./themes/" + process.env.MIX_THEME + "/assets/dist/css/*.css",
      "./themes/" + process.env.MIX_THEME + "/assets/dist/js/*.js",
      "./themes/" + process.env.MIX_THEME + "/**/*.htm",
    ]
});
