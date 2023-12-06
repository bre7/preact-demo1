import path from "path"
import ImageminPlugin from "imagemin-webpack-plugin"
import imageminMozjpeg from "imagemin-mozjpeg"
import SitemapPlugin from "sitemap-webpack-plugin"
// import { SitemapStream } from "sitemap"
import CopyWebpackPlugin from "copy-webpack-plugin"

/**
 * @param {import('preact-cli').Config} config - original webpack config.
 * @param {import('preact-cli').Env} env - options passed to the CLI.
 * @param {import('preact-cli').Helpers} helpers - object with useful helpers for working with the webpack config.
 * @param {Record<string, unknown>} options - this is mainly relevant for plugins (will always be empty in the config), default to an empty object
 **/
export default (config, env, helpers, options) => {
  const urls = ["/a1", "/b2"]

  config.resolve.alias["@"] = path.resolve(__dirname, "src")
  config.resolve.alias["@assets"] = path.resolve(__dirname, "src", "assets")
  config.resolve.alias["@components"] = path.resolve(__dirname, "src", "components")
  config.resolve.alias["@routes"] = path.resolve(__dirname, "src", "routes")

  /* ✅ CODE WORKS AS EXPECTED UNTIL THIS POINT ✅ */

  // alternative 1
   config.plugins.push(
     new SitemapPlugin({
       base: "https://github.com/",
       paths,
       options: {
         skipgzip: true,
       },
     })
   )

  // alternative 2
  config.plugins.push(
    new CopyWebpackPlugin([
      // { from: `${__dirname}/src/robots.txt` },
      { from: `${__dirname}/src/sitemap.xml` },
    ])
  )

  if (env.isProd) {
     config.plugins.push(
       new ImageminPlugin({
         from: "./build/assets/**",
         pngquant: {
           quality: "90",
         },
         plugins: [
           imageminMozjpeg({
             quality: 90,
             progressive: true,
           }),
         ],
       })
     )
  }
}