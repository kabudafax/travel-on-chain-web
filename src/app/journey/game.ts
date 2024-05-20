export default class GameCanvas {
	constructor(options) {
		this.options = options;
		this.ctx = null;
		this.timer = null;
		this.points = [];
		this.animateNum = 0;
		// window.devicePixelRatio ||
		this.dpr = window.devicePixelRatio || 1;
		this.routes = options.routes;
		this.passRoutes = options.passRoutes;
		this.initCanvas();
		this.manPic = options.manPic;
		this.img = new Image();
		this.curIndex = options.currentIndex ?? 0;
	}
	initCanvas() {
		let canvas = document.getElementById(this.options.id);
		// console.log(this.dpr, 'this.dpr');
		canvas.width = this.options.width * this.dpr;
		canvas.height = this.options.height * this.dpr;
		this.ctx = canvas.getContext('2d');
		this.ctx.scale(this.dpr, this.dpr);
		// this.drawInitialPath();
	}
	/**
	 * @Author: yuyongxing
	 * @param {*}
	 * @return {*}
	 * @Date: 2021-11-21 21:25:13
	 * @LastEditors: yuyongxing
	 * @LastEditTime: Do not edit
	 * @Description: 绘制初始路径
	 */
	drawInitialPath() {
		this.ctx.strokeStyle = '#bbb';
		this.ctx.shadowBlur = 0.5;
		this.ctx.shadowColor = '#333';
		this.ctx.lineWidth = 5;
		this.ctx.lineJoin = 'bevel';
		this.ctx.beginPath();
		for (let i = 0; i < this.routes.length; i++) {
			let point = this.routes[i];
			if (i == 0) {
				this.ctx.moveTo(point.x, point.y);
			} else {
				this.ctx.lineTo(point.x, point.y);
			}
		}
		this.ctx.stroke();
		this.ctx.closePath();
		for (let i = 0; i < this.routes.length; i++) {
			let point = this.routes[i];
			if (i <= this.passRoutes.length) {
				this.drawPoint(point.x, point.y, '#1DEFFF');
				if (i > 0) {
					this.drawLine(this.routes[i - 1], point, '#1DEFFF');
				}
				continue;
			}
			this.drawPoint(point.x, point.y, '#bbb');
		}
	}
	/**
	 * @Author: yuyongxing
	 * @param {*} routes
	 * @return {*} routes
	 * @Date: 2021-11-21 21:13:03
	 * @LastEditors: yuyongxing
	 * @LastEditTime: Do not edit
	 * @Description: 根据屏幕比例格式化坐标点
	 */
	formatRoutes(routes) {
		return routes.map((item) => {
			item.x = item.x * this.dpr;
			item.y = item.y * this.dpr;
			return item;
		});
	}
	/**
	 * @Author: yuyongxing
	 * @param {*} x
	 * @param {*} y
	 * @param {*} color
	 * @return {*}
	 * @Date: 2021-11-21 21:35:44
	 * @LastEditors: yuyongxing
	 * @LastEditTime: Do not edit
	 * @Description: 绘制坐标点
	 */
	drawPoint(x, y, color) {
		this.ctx.beginPath();
		this.ctx.fillStyle = color;
		this.ctx.strokeStyle = color;
		this.ctx.shadowColor = color;
		this.ctx.arc(x, y, 5, Math.PI * 2, 0, true);
		this.ctx.stroke();
		this.ctx.fill();
		this.ctx.closePath();
	}
	/**
	 * @Author: yuyongxing
	 * @param {*} start
	 * @param {*} end
	 * @param {*} color
	 * @return {*}
	 * @Date: 2021-11-22 16:25:55
	 * @LastEditors: yuyongxing
	 * @LastEditTime: Do not edit
	 * @Description: 绘制线段
	 */
	drawLine(start, end, color) {
		this.ctx.strokeStyle = color;
		this.ctx.shadowColor = color;
		this.ctx.shadowBlur = 0.5;
		this.ctx.beginPath();
		this.ctx.moveTo(start.x, start.y);
		this.ctx.lineTo(end.x, end.y);
		this.ctx.stroke();
		this.ctx.closePath();
	}
	/**
	 * @Author: yuyongxing
	 * @param {*} start
	 * @param {*} end
	 * @return {*}
	 * @Date: 2021-11-22 16:26:16
	 * @LastEditors: yuyongxing
	 * @LastEditTime: Do not edit
	 * @Description: 开始两个坐标点之间的动画
	 */
	animate(index) {
		this.curIndex =
			index + this.curIndex == this.routes.length ? 0 : index + this.curIndex;
		console.log(this.curIndex, 'this.curIndex');
		const startPoint =
			this.routes[
				this.curIndex === 0 ? this.routes.length - 1 : this.curIndex - 1
			].center;
		const endPoint = this.routes[this.curIndex].center;

		// if (index) {
		// this.curIndex = index;
		// }
		// let rate =
		// 	Math.sqrt(Math.pow(end.x - startPoint.x, 2) + Math.pow(end.y - startPoint.y, 2)) /
		// 	speed;

		let xStep = (endPoint.x - startPoint.x) / 20;
		let yStep = (endPoint.y - startPoint.y) / 20;
		// console.log(yStep, 'yStep');
		let x = startPoint.x;
		let y = startPoint.y;
		// console.log(startPoint, endPoint, 'draw', x, y);
		// this.img.onload = () => {
		const draw = (index) => {
			// window.requestAnimationFrame(() => {
			// 	if (Math.abs(x - endPoint.x) !== 0 && Math.abs(y - endPoint.y) !== 0) {
			// 		draw();
			// 	}
			// });
			this.img.onload = () => {
				let xleft = Math.abs(x - endPoint.x) < 1;
				let yleft = Math.abs(y - endPoint.y) < 1;
				// if (xleft) x = Math.round(x + xStep);
				// if (yleft) y = Math.round(y + yStep);
				// if (xleft)
				x = xleft ? x : xStep + x;
				// console.log(yStep, y, Math.round(yStep + y), 'round');
				// if (yleft)
				y = yleft ? y : yStep + y;
				this.ctx.clearRect(0, 0, this.options.width, this.options.height); // clear canvas
				this.ctx.drawImage(this.img, x, y, 30, 30); // draw image at current position
				// console.log('===', x, endPoint.x, y, endPoint.y);
				if (!xleft && !yleft) requestAnimationFrame(() => draw(index)); // loop
			};
			this.img.src = this.manPic;
		};
		draw(index);
		// };
		// console.log(manPic, 'manPic');

		// this.img.src = this.manPic;

		// window.requestAnimationFrame(() => {
		// 	if (Math.abs(x - endPoint.x) !== 0 || Math.abs(y - endPoint.y) !== 0) {
		// 		draw();
		// 	}
		// });

		// for (let i = 0; i < rate; i++) {
		// 	this.points.push({
		// 		x: (start.x + ((end.x - start.x) / rate) * i - 20).toFixed(1),
		// 		y: (start.y + ((end.y - start.y) / rate) * i + 3).toFixed(1)
		// 	});
		// }
		// this.points.push(end);
		// this.startAnimate(resolve, reject);
	}
	startAnimate(resolve, reject) {
		let nowPoint = this.points[this.animateNum];
		this.animateNum++;
		let nextPoint = this.points[this.animateNum];
		this.ctx.beginPath();
		// this.ctx.strokeStyle = '#1DEFFF';
		// this.ctx.shadowColor = '#1DEFFF';
		// this.ctx.lineWidth = 7;
		// this.ctx.moveTo(nowPoint.x, nowPoint.y);
		// this.ctx.lineTo(nextPoint.x, nextPoint.y);
		this.ctx.arc(nowPoint.x, nowPoint.y, 3, 0, Math.PI * 2, true);
		this.ctx.stroke();
		this.ctx.closePath();

		this.timer = window.requestAnimationFrame(() => {
			// this.startAnimate(resolve, reject);
		});

		// if (this.animateNum >= this.points.length - 1) {
		// 	this.points = [];
		// 	this.animateNum = 0;
		// 	window.cancelAnimationFrame(this.timer);
		// 	this.drawPoint(nowPoint.x, nowPoint.y, '#1DEFFF');
		// 	resolve();
		// }
	}
}
