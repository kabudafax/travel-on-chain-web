// next.config.js
const path = require('path');
const { DefinePlugin } = require('webpack');

const process = require('process');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const pathBuilder = (subpath) => path.join(process.cwd(), subpath);

module.exports = {
	reactStrictMode: false,
	typescript: {
		ignoreBuildErrors: true
	},
	webpack: (config, { isServer }) => {
		// 解析cesium导入别名
		config.resolve.alias = {
			...config.resolve.alias,
			cesium: path.resolve(__dirname, 'node_modules/cesium/Source')
		};

		// 定义与cesium相关的全局变量
		config.plugins.push(
			new DefinePlugin({
				CESIUM_BASE_URL: JSON.stringify('/cesium')
			}),

			// 使用copy插件将cesium资源复制到public目录
			new CopyWebpackPlugin({
				patterns: [
						{
								from: pathBuilder ('node_modules/cesium/Build/Cesium/Workers'),
								to: '../public/cesium/Workers',
								info: { minimized: true }
						}
				]
		}),
		new CopyWebpackPlugin({
				patterns: [
						{
								from: pathBuilder ('node_modules/cesium/Build/Cesium/ThirdParty'),
								to: '../public/cesium/ThirdParty',
								info: { minimized: true }
						}
				]
		}),
		new CopyWebpackPlugin({
				patterns: [
						{
								from: pathBuilder ('node_modules/cesium/Build/Cesium/Assets'),
								to: '../public/cesium/Assets',
								info: { minimized: true }
						}
				]
		}),
		new CopyWebpackPlugin({
				patterns: [
						{
								from: pathBuilder ('node_modules/cesium/Build/Cesium/Widgets'),
								to: '../public/cesium/Widgets',
								info: { minimized: true }
						}
				]
		}),
		new webpack.DefinePlugin({ CESIUM_BASE_URL: JSON.stringify('/cesium') })
		);

		if (!isServer) {
			// 这是一个解决SSR(服务器端渲染)中“窗口未定义”错误的方法。
			config.externals = config.externals.map((external) => {
				if (typeof external !== 'function') return external;
				return (context, request, callback) => {
					if (request.match(/^cesium/)) return callback();
					return external(context, request, callback);
				};
			});
		}

		return config;
	},

	output: 'standalone',

	// 添加服务器端重写规则，以便从/public/cesium服务于Cesium静态资源
	async rewrites() {
		return [
			{
				source: '/cesium/:path*',
				destination: '/cesium/:path*' // Proxy to Folder
			}
		];
	}
};
