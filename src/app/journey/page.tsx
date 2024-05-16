'use client';
import React, { useEffect, useRef } from 'react';
import GameCanvas from '@/app/journey/game.ts';
import tempale1 from '@/../public/tempale1.png';
import tempale2 from '@/../public/tempale2.png';
import './styles.scss';
import user from '@/../public/man.png';
import { cn } from '@/lib/utils';
//向右x+50y+14;
//向左x - 48 y-22;
type Point = { x: number; y: number; center: { x: number; y: number } };
type Routes = Point[];
// 180 ,90
// 235,108
const centers = [
	{ x: 180, y: 104 },
	{ x: 230, y: 120 },
	{ x: 282, y: 130 },
	{ x: 340, y: 145 },
	{ x: 295, y: 165 },
	{ x: 250, y: 185 },
	{ x: 200, y: 209 },
	{ x: 150, y: 230 },
	{ x: 105, y: 250 },
	{ x: 150, y: 265 },
	{ x: 205, y: 276 },
	{ x: 165, y: 300 }
];

function right(point: Point) {
	return {
		x: point.x + 53,
		y: point.y + 12
		// center: { x: point.center.x + 55, y: point.center.y + 15 }
	};
}
function left(point: Point) {
	return {
		x: point.x - 48,
		y: point.y + 22
		// center: { x: point.center.x - 55, y: point.center.y + 25 }
	};
}
function up(point: Point) {
	return {
		x: point.x + 48,
		y: point.y - 22
		// center: { x: point.center.x + 47, y: point.center.y - 22 }
	};
}
function upLeft(point: Point) {
	return {
		x: point.x - 53,
		y: point.y - 12
		// center: { x: point.center.x - 52 / 2, y: point.center.y - 12 }
	};
}
export default function Game() {
	const canvasRef = useRef(null);
	const animateCanvasRef = useRef(null);
	const gameRef = useRef(null);
	const gridcanvasRef = useRef(null);
	const cordinateCanvasRef = useRef(null);
	function generateRoutes(
		start: { x: number; y: number; center: { x: number; y: number } },
		steps: { dir: 'right' | 'left' | 'up' | 'upLeft'; times: number }[]
	) {
		const routes = [start];
		let times = 0;
		steps.forEach((step) => {
			switch (step.dir) {
				case 'right':
					for (let i = 0; i < step.times; i++) {
						routes.push(right(routes[times]));
						times++;
					}
					break;
				case 'left':
					for (let i = 0; i < step.times; i++) {
						routes.push(left(routes[times]));
						times++;
					}
					break;
				case 'up':
					for (let i = 0; i < step.times; i++) {
						routes.push(up(routes[times]));
						times++;
					}
					break;
				case 'upLeft':
					for (let i = 0; i < step.times; i++) {
						routes.push(upLeft(routes[times]));
						times++;
					}
					break;
				default:
					break;
			}
		});
		console.log(routes, 'routes');
		return routes;
	}

	function drawBoard(routes: Routes) {
		const context = canvasRef.current?.getContext('2d');
		context.fillStyle = 'rgb(250,229,208)'; // 设置方块的颜色

		routes.forEach((route) => {
			context.save(); // 保存当前的绘图状态
			context.translate(route.x, route.y); // 将坐标原点移动到方块的位置
			context.rotate(-Math.PI * 0.2); // 旋转45度
			context.transform(1, 0.2, 0.9, 1, 0, 0);
			context.scale(1, 0.8); // 缩放y轴，使得形状变为菱形
			context.fillRect(-35, -35, 48, 48); // 绘制方块
			context.restore(); // 恢复原有的绘图状态
		});
	}

	useEffect(() => {
		const routes = generateRoutes(
			{ x: 220, y: 128, center: { x: 180, y: 105 } },
			[
				{ dir: 'right', times: 3 },
				{ dir: 'left', times: 5 },
				{ dir: 'right', times: 2 },
				{ dir: 'left', times: 3 },
				{ dir: 'right', times: 3 },
				{ dir: 'left', times: 2 },
				{ dir: 'right', times: 2 },
				{ dir: 'up', times: 4 },
				{ dir: 'right', times: 4 },
				{ dir: 'up', times: 4 },
				{ dir: 'upLeft', times: 4 },
				{ dir: 'up', times: 4 },
				{ dir: 'upLeft', times: 10 },
				{ dir: 'left', times: 1 }
			]
		)?.map((route, inx) => ({ ...route, center: centers[inx] }));
		console.log(routes, 'routes');
		let game = new GameCanvas({
			id: 'anicanvas',
			width: window.innerWidth * 0.7,
			height: window.innerHeight,
			routes: routes,
			passRoutes: [],
			manPic: user.src
		});
		let bg = new GameCanvas({
			id: 'canvas',
			width: window.innerWidth * 0.7,
			height: window.innerHeight,
			routes: [],
			passRoutes: []
		});

		gameRef.current = game;
		console.log(canvasRef.current, 'canvasRef.current');
		if (animateCanvasRef.current) {
			// animateCanvasRef.current?.addEventListener('click', go);
		}
		if (canvasRef.current) {
			const img = new Image();
			img.onload = function () {
				const context = canvasRef.current.getContext('2d');
				context?.drawImage(img, 130, 150, 179 / 2, 160 / 2);
			};

			img.src = tempale1.src;
			const img2 = new Image();
			img2.onload = function () {
				const context = canvasRef.current.getContext('2d');

				context?.drawImage(img2, 80, 380, 179 / 2, 160 / 2);
			};
			img2.src = tempale2.src;
			drawBoard(routes);
		}
		if (animateCanvasRef?.current) {
			const userIcon = new Image();
			userIcon.onload = function () {
				const animaContext = animateCanvasRef?.current?.getContext('2d');
				console.log(animaContext, 'animate', animateCanvasRef);
				animaContext?.drawImage(userIcon, 180, 105, 30, 30);
			};
			userIcon.src = user.src;
		}
		return () => {
			if (canvasRef.current) {
				animateCanvasRef.current?.removeEventListener('click', go);
			}
		};
	}, []);

	useEffect(() => {
		const canvas = gridcanvasRef.current;
		const context = canvas.getContext('2d');
		const width = canvas.width;
		const height = canvas.height;
		const gridSpacing = 15;
		const cordinate = cordinateCanvasRef.current;
		const cordinateContext = cordinate?.getContext('2d');
		// Draw grid lines
		for (let x = 0; x <= width; x += gridSpacing) {
			context.moveTo(x, 0);
			context.lineTo(x, height);
		}

		for (let y = 0; y <= height; y += gridSpacing) {
			context.moveTo(0, y);
			context.lineTo(width, y);
		}

		context.strokeStyle = '#ddd';
		context.stroke();

		// Add mouse move event listener to show coordinates
		cordinate.addEventListener('mousemove', (event) => {
			const rect = cordinate.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;
			cordinateContext.save(); // Save current state of the canvas
			cordinateContext.clearRect(0, 0, width, height); // Clear previous drawings
			cordinateContext.fillText(`x: ${x}, y: ${y}`, x, y); // Draw coordinates
			cordinateContext.restore(); // Restore the state of the canvas
		});
	}, []);

	async function go() {
		await gameRef.current.animate(1);
	}
	return (
		<div className="h-full overflow-auto ">
			<div className="box flex">
				<div>
					<canvas
						style={{ marginTop: 10 }}
						id="canvas"
						ref={canvasRef}
						width={window.innerWidth * 0.7}
						height={window.innerHeight}
					></canvas>
					<canvas
						id="anicanvas"
						ref={animateCanvasRef}
						style={{
							position: 'absolute',
							zIndex: 5,
							top: 10,
							left: 0,
							right: 0
						}}
						width={window.innerWidth * 0.7}
						height={window.innerHeight}
					></canvas>
					<canvas
						ref={gridcanvasRef}
						width={window.innerWidth * 0.7}
						height={window.innerHeight}
						style={{
							position: 'absolute',
							zIndex: 50,
							top: 10,
							left: 0,
							right: 0
						}}
					/>
					<canvas
						ref={cordinateCanvasRef}
						width={window.innerWidth * 0.7}
						height={window.innerHeight}
						style={{
							position: 'absolute',
							zIndex: 55,
							top: 10,
							left: 0,
							right: 0
						}}
					/>
				</div>
				<div
					style={{ zIndex: 6 }}
					className={cn(
						'dice-button !z-6 absolute left-1/2 top-1/2 -translate-x-20 -translate-y-[120%]'
					)}
				>
					<div className="scene">
						<div className="cube">
							<div className="face front">1</div>
							<div className="face back">2</div>
							<div className="face right">3</div>
							<div className="face left">4</div>
							<div className="face top">5</div>
							<div className="face bottom">6</div>
						</div>
					</div>
				</div>
				<button
					className="btn"
					style={{ marginLeft: 30, fontSize: 40 }}
					onClick={() => go()}
				>
					Go
				</button>
			</div>
		</div>
	);
}
