import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import WebpackShellPluginNext from "webpack-shell-plugin-next";
import CopyWebpackPlugin from "copy-webpack-plugin";

// Define __dirname for ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('webpack').Configuration} */
const config = {
  entry: "./src/index.ts", // Your main TypeScript entry file
  output: {
    path: path.resolve(__dirname, "dist2"), // Output directory
    filename: "[name].[contenthash].js", // Output file with content hash for caching
    publicPath: "/", // Public path for assets
  },
  resolve: {
    extensions: [".ts", ".js"], // Resolve these extensions
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // Handle TypeScript files
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(css)$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i, // Handle image files
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), // Clean the output directory before each build
    new HtmlWebpackPlugin({
      template: "./index.html", // Your main HTML template
      inject: "body", // Inject scripts into the body
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "static", to: "static" }, // Copy static folder to dist/static
      ],
    }),

    // new WebpackShellPluginNext({
    //   onBuildStart: {
    //     scripts: ["npm run build:posts"], // Custom script to generate blog posts
    //     blocking: true, // Ensure script completes before proceeding
    //     parallel: false, // Run scripts sequentially
    //   },
    // }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all", // Split chunks for better caching
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "static"), // Serve static files from 'dist' directory
    },
    compress: true, // Enable gzip compression
    port: 9010, // Development server port
    historyApiFallback: true, // Fallback for single-page applications
  },
  mode: "development", // Default mode
};

export default config; // Export the configuration as the default export
