import autoprefixer from 'autoprefixer'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import dotenv from 'dotenv'
import HtmlPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'node:path'
import postcssImport from 'postcss-import'
import postcssNested from 'postcss-nested'
import { fileURLToPath } from 'url'
import webpack from 'webpack'

// During an uncomfortable transition to a true module system for JavaScript,
// __dirname became a casualty. We still have use for it. This is the new idiom
// for determining __dirname (the directory of this file).
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// There can be a lot of environment variables, and many of them private. We
// want a way to inject configuration via environment variables into the UI at
// build time. List variables here to ensure they are included.
const includeEnvironmentVariables = [
]
// Part of a series of settings to allow use of process.env in the web. See also
// the resolve -> alias setting in this file, the ProvidePlugin usage in this
// file, and the added process package.
const env = Object.fromEntries(
  Object.entries({
    ...dotenv.config(),
    ...process.env,
  }).filter(([k, _v]) => includeEnvironmentVariables.includes(k)),
)

export default {
  // All Webpack bundles require a single entry point from which the entire
  // bundling process starts.
  entry: './client/app.tsx',
  mode: process.env.NODE === 'production' ? 'production' : 'development',
  // This indicates how and where the final output is bundled.
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, './public'),
    publicPath: '/',
  },
  // The webpack-dev-server is what we run locally when npm start is invoked. It
  // starts up a server of its own which bundles everything (according to our
  // configuration in this entire file) and keeps those bundled assets in
  // memory. Nothing is written to disk when running webpack-dev-server.
  // Additionally, the server can act as a reverse proxy to emulate deployment
  // and potentially work around CORS issues. This configuration reverse proxies
  // to _our_ server and in doing so means we don't need to use CORS.
  devServer: {
    // This is the port you browse to when running locally.
    port: 7891,
    historyApiFallback: true,
    // A versioned server shouldn't be aware of its prefix (the /api/v1) part.
    // Making it aware can increase difficulty with actually versioning the
    // server. Additionally it implies you could have different versions
    // served by the same server code (like v1 and v2 being in the same
    // codebase). This counters the purpose of versioning, and ensures at some
    // point you will make a change that services one of the servers and
    // breaks the other.
    //
    // To ensure this separation, we have to do some path re-writing here to
    // scrub the version prefix. This is for webpack-dev-server. Similar work
    // has to be done on the Express.js side when it is hosted.
    proxy: {
      '/api/v1': {
        pathRewrite: {
          // This rewritres the /api/v1 (coming from the browser) to nothing.
          // See API_PREFIX. When deployed, we set API_PREFIX to be /api/v1, but
          // if the API were ever to be versioned, we'd set it to /api/v2.
          '^/api/v1': ''
        },
        // This is our server that we want to reverse-proxy to.
        target: 'http://localhost:7890',
      },
    },
  },
  plugins: [
    // HtmlWebpackPlugin is able to take an HTML file and properly stuff in any
    // assets it thinks we are using, such as style sheets (CSS), JavaScript,
    // and even fonts. Anything included statically in our UI code will be
    // reflected in the index.html that the plugin emits. We need to give it our
    // own HTML file so we can do things like control what meta tags exist, how
    // the body tag is populated, the title, and anything else we might want to
    // control.
    new HtmlPlugin({ template: './client/index.html' }),
    // Clean the dist directory on every webpack build. Note that the dist
    // directory is not used when running webpack-dev-server (npm start).
    new CleanWebpackPlugin(),
    // This provides the environment variable data to Webpack. This environment
    // variable data comes from the environment variables themselves, plus the
    // .env file (with environment variables winning conflicts). To make this
    // completely work, see the resolve.alias section as well as the
    // ProvidePlugin in this plugin section, and finally the environment
    // processing code above this configuration in this file.
    new webpack.EnvironmentPlugin(env),
    // Typically we don't need to copy files manually from Webpack. If we
    // statically refer to the file correctly (such as an import in a .js/ts
    // file, or an <img src="...">, Webpack will detect that properly and ensure
    // the file is included and its path is kept consistently working. But
    // sometimes we need assets dynamically, or Webpack otherwise just doesn't
    // know how to include them. For these files, place them in the public
    // directory and Webpack will ensure they get copied over.
    new CopyPlugin({
      patterns: [{ from: 'client/public' }],
    }),
    // This extracts CSS data and puts it into a CSS file, which is then
    // included in our index.html. The gathering of the CSS data is done via the
    // plugin's loader, which can be seen in the rules section below for CSS.
    new MiniCssExtractPlugin(),
    // Bring this in to allow use of process.env in the web. See also the
    // resolve -> alias setting in this file, dotenv usage in this file, and
    // the added process package.
    new webpack.ProvidePlugin({
      process: 'process/browser',
      React: 'react',
    }),
    // Prevent Webpack from rebuilding when the css.d.ts files are written out.
    new webpack.WatchIgnorePlugin({
      paths: [/css\.d\.ts$/],
    }),
  ],
  resolve: {
    alias: {
      // Use this to allow use of process.env in the web. See also the
      // ProvidePlugin usage in this file, dotenv usage in this file, and the
      // added process package.
      process: 'process/browser',
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    // Each set of rules here indicates how a specific kind of asset is
    // processed. Assets can range from JavaScript files, CSS files, images, and
    // anything else Webpack might need to bundle. Loaders (Webpack's name for
    // plugins that belong in these rules) are indicated and configured for
    // assets. When a list of loaders is provided, the assets will move through
    // the loaders in a bottom-to-top order.
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      // TypeScript support. See also the resolve.extensions section for
      // including them by file type.
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          // css-loader lets us import css files. MiniCssExtractPlugin takes the
          // CSS data and stuffs it into a css file for us. That file is then
          // later included in our index.html by the same plugin employed in the
          // plugins section. This plugin must be the last in order in order to
          // work correctly (and thus needs to be on the top).
          MiniCssExtractPlugin.loader,
          // This loader makes CSS Modules type safe with TypeScript files.
          {
            loader: 'css-modules-typescript-loader',
            options: {
              mode: process.env.CI ? 'verify' : 'emit'
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              // If modules is set to true _or_ it is an object, this enables
              // CSS Modules - a means of un-globalizing CSS class selectors and
              // letting us pretend that CSS files are actually standalone
              // modules that don't interfere with other modules.
              modules: {
                exportLocalsConvention: 'camelCase',
                // The localIdentName provides a template in which the class
                // names are mangled by CSS Modules. By default it is just a
                // random hash. Below, we use the file name ([name]) and the
                // class name ([local]) along with part of the hash. This allows
                // us to be able to see what classes are applied to what
                // elements in a human readable way.
                localIdentName: '[name]__[local]__[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
          // PostCSS is akin to Babel.js, but for CSS files. PostCSS allows us
          // to use cutting edge or experimental CSS features that browsers
          // don't support yet, and it will convert that CSS into into CSS our
          // browsers can understand. An example of such a feature is nested
          // CSS. Each feature can be thought of as an individual plugin, listed
          // below.
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              postcssOptions: {
                plugins: [
                  // Import one CSS from another.
                  postcssImport(),
                  // Use browser prefixes - a way for browsers to aggressively
                  // support new CSS features. autoprefixer can be supplied with
                  // a browser support matrix and autoprefixer will
                  // automatically add prefixes _as needed_ to your CSS. See
                  // browserlist (https://github.com/browserslist/browserslist)
                  // for declaring such a matrix).
                  autoprefixer(),
                  // Use nested CSS. This lets you write selectors less
                  // repetitiously.
                  postcssNested(),
                ],
              },
            },
          },
        ],
      },
      // Support the packaging of images.
      {
        test: /\.(jpeg|jpg|png|svg|gif)$/,
        type: 'asset/resource',
      },
      // Support the packaging of fonts.
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
