export default class GameCanvas {
	curIndex = 0;
	routes: any[] = [];
	ctx: any;
	img: any;
	passRoutes: any[] = [];
	options: any;
	manPic: string;

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
	drawLine(start: any, end: any, color: string) {
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
	animate(index: number): Promise<void> {
		console.log(index);
		return new Promise(async (resolve) => {
			this.curIndex =
				index + this.curIndex == this.routes.length ? 0 : index + this.curIndex;
			console.log(this.curIndex, 'this.curIndex');
			window.localStorage.setItem('currentPosition', this.curIndex);

			const startPoint =
				this.routes[
					this.curIndex === 0 ? this.routes.length - 1 : this.curIndex - 1
					].center;
			const endPoint = this.routes[this.curIndex].center;

			let xStep = (endPoint.x - startPoint.x) / 20;
			let yStep = (endPoint.y - startPoint.y) / 20;
			let x = startPoint.x;
			let y = startPoint.y;

			const draw = (index: number) => {
				return new Promise((resolve) => {
					this.img.onload = () => {
						let xleft = Math.abs(x - endPoint.x) < 1;
						let yleft = Math.abs(y - endPoint.y) < 1;
						x = xleft ? x : xStep + x;
						y = yleft ? y : yStep + y;
						this.ctx.clearRect(0, 0, this.options.width, this.options.height); // clear canvas
						this.ctx.drawImage(this.img, x, y, 30, 30); // draw image at current position
						if (!xleft && !yleft) {
							requestAnimationFrame(() => resolve(draw(index))); // loop
						} else {
							resolve('done');
						}
					};
					this.img.src = this.manPic;
				});
			};

			await draw(index);
			setTimeout(() => resolve(), 250);
		});
	}
}
