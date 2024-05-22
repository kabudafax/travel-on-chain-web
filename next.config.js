// next.config.js
const path = require("path");
const { DefinePlugin } = require("webpack");

module.exports = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    // 解析cesium导入别名
    config.resolve.alias = {
      ...config.resolve.alias,
      cesium: path.resolve(__dirname, "node_modules/cesium/Source"),
    };

    // 定义与cesium相关的全局变量
    config.plugins.push(
      new DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify("/cesium"),
      })
    );

    if (!isServer) {
      // 这是一个解决SSR(服务器端渲染)中“窗口未定义”错误的方法。
      config.externals = config.externals.map((external) => {
        if (typeof external !== "function") return external;
        return (context, request, callback) => {
          if (request.match(/^cesium/)) return callback();
          return external(context, request, callback);
        };
      });
    }

    return config;
  },

  // 添加服务器端重写规则，以便从/public/cesium服务于Cesium静态资源
  async rewrites() {
    return [
      {
        source: "/cesium/:path*",
        destination: "/cesium/:path*", // Proxy to Folder
      },
    ];
  },
};
