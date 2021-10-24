let mix = require('laravel-mix');

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

mix.webpackConfig({
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': __dirname + '/themes/' + process.env.MIX_THEME + '/assets',
      '@vue': __dirname + '/themes/' + process.env.MIX_THEME + '/assets/src/vue'
    },
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
    proxy: 'html-store.loc',
    host: 'html-store.loc',
    notify: false,
    files: [
      "./themes/store/assets/dist/css/*.css",
      "./themes/store/assets/dist/js/*.js",
      "./themes/store/**/*.htm",
    ]
});