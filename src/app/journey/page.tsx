'use client';
import React, { useEffect, useRef } from 'react';
import GameCanvas from '@/app/journey/game.ts';
import tempale1 from '@/../public/tempale1.png';
import tempale2 from '@/../public/tempale2.png';
// import single4 from '@/../public/single4.png';
// import single5 from '@/../public/single5.png';
// import single6 from '@/../public/single6.png';
// import d from '@/../public/d.png';
import panda from '@/../public/panda.png';
import './styles.scss';
import user from '@/../public/man.png';
import { cn } from '@/lib/utils';
import { RollDice } from '@/components/rollDice/rollDice';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import contractABI from './TravelVRFV2Plus.json';

// sepolia
export const contractAddress = '0x1b10AbF4a94AB96a4CDefE8B6Df08DD6A9e9A6b5';

import { centers } from './constant';
import tempale3 from '@/../public/tample3.png';
//向右x+50y+14;
//向左x - 48 y-22;
type Point = { x: number; y: number; center: { x: number; y: number } };
type Routes = Point[];
const imgs = [tempale1, tempale2, panda];
function right(point: Point) {
	return {
		x: point.x + 53,
		y: point.y + 12
	};
}
function left(point: Point) {
	return {
		x: point.x - 48,
		y: point.y + 22
	};
}
function up(point: Point) {
	return {
		x: point.x + 48,
		y: point.y - 22
	};
}
function upLeft(point: Point) {
	return {
		x: point.x - 53,
		y: point.y - 12
	};
}
export default function Game() {
	const canvasRef = useRef(null);
	const animateCanvasRef = useRef(null);
	const gameRef = useRef(null);
	// const gridcanvasRef = useRef(null);
	// const cordinateCanvasRef = useRef(null);
	const start = 0;
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
			width: 1000,
			height: window.innerHeight,
			routes: routes,
			passRoutes: [],
			manPic: user.src,
			currentIndex: start
		});
		let bg = new GameCanvas({
			id: 'canvas',
			width: 1000,
			height: window.innerHeight,
			routes: [],
			passRoutes: []
		});

		gameRef.current = game;
		console.log(canvasRef.current, 'canvasRef.current');

		if (canvasRef.current) {
			const img = new Image();
			const imgCordinates = [
				{ x: 130, y: 150, size: [179 / 2, 160 / 2] },
				{ x: 80, y: 380, size: [179 / 2, 160 / 2] },
				// { x: 100, y: 56, size: [1280, 720] },
				{ x: 600, y: 300, size: [1920 / 2, 1080 / 2] }
			];
			// img.onload = function () {
			// 	const context = canvasRef.current.getContext('2d');
			// 	context?.drawImage(img, 130, 150, 179 / 2, 160 / 2);
			// };

			// img.src = tempale1.src;
			// const img2 = new Image();
			// img2.onload = function () {
			// 	const context = canvasRef.current.getContext('2d');

			// 	context?.drawImage(img2, 80, 380, 179 / 2, 160 / 2);
			// };
			// img2.src = tempale2.src;
			imgs.forEach((img, inx) => {
				const imgSingle = new Image();
				imgSingle.onload = function () {
					const context = canvasRef.current.getContext('2d');

					if (inx === 3) {
						context.save();
						context.rotate((-10 * Math.PI) / 180);

						context?.drawImage(
							imgSingle,
							imgCordinates[inx].x,
							imgCordinates[inx].y,
							...imgCordinates[inx].size
						);
						context.restore();
					} else {
						context?.drawImage(
							imgSingle,
							imgCordinates[inx].x,
							imgCordinates[inx].y,
							...imgCordinates[inx].size
						);
					}
				};
				imgSingle.src = img.src;
			});
			drawBoard(routes);
		}
		if (animateCanvasRef?.current) {
			const userIcon = new Image();
			userIcon.onload = function () {
				const animaContext = animateCanvasRef?.current?.getContext('2d');
				console.log(animaContext, 'animate', animateCanvasRef);
				animaContext?.drawImage(
					userIcon,
					centers[start].x,
					centers[start].y,
					30,
					30
				);
			};
			userIcon.src = user.src;
		}
		return () => {
			if (canvasRef.current) {
				animateCanvasRef.current?.removeEventListener('click', go);
			}
		};
	}, []);

	// useEffect(() => {
	// 	const canvas = gridcanvasRef.current;
	// 	const context = canvas.getContext('2d');
	// 	const width = canvas.width;
	// 	const height = canvas.height;
	// 	const gridSpacing = 15;
	// 	const cordinate = cordinateCanvasRef.current;
	// 	const cordinateContext = cordinate?.getContext('2d');
	// 	// Draw grid lines
	// 	for (let x = 0; x <= width; x += gridSpacing) {
	// 		context.moveTo(x, 0);
	// 		context.lineTo(x, height);
	// 	}

<<<<<<< HEAD
				{/* <div
					onClick={GetRandom}
=======
	// 	for (let y = 0; y <= height; y += gridSpacing) {
	// 		context.moveTo(0, y);
	// 		context.lineTo(width, y);
	// 	}

	// 	context.strokeStyle = '#ddd';
	// 	context.stroke();

	// 	// Add mouse move event listener to show coordinates
	// 	cordinate.addEventListener('mousemove', (event) => {
	// 		const rect = cordinate.getBoundingClientRect();
	// 		const x = event.clientX - rect.left;
	// 		const y = event.clientY - rect.top;
	// 		cordinateContext.save(); // Save current state of the canvas
	// 		cordinateContext.clearRect(0, 0, width, height); // Clear previous drawings
	// 		cordinateContext.fillText(`x: ${x}, y: ${y}`, x, y); // Draw coordinates
	// 		cordinateContext.restore(); // Restore the state of the canvas
	// 	});
	// }, []);

	async function go() {
		if (gameRef.current) gameRef.current.animate(1);
	}
	return (
		<div className="h-full overflow-auto bg-[#111827]">
			<div className="box flex">
				<div
					className="flex-shrink flex-grow-0 overflow-auto"
					style={{ flexBasis: '70%' }}
				>
					<canvas
						style={{ marginTop: 10 }}
						id="canvas"
						ref={canvasRef}
						width={window.innerWidth * 0.7}
						height={window.innerHeight}
					></canvas>
					<div></div>
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
					{/*<canvas
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
					/>*/}
				</div>
				<div
>>>>>>> ac480c7f5bac5e9fd6199c93c0f706f7e7c4d9ee
					style={{ zIndex: 6 }}
					className={cn(
						'dice-button !z-6 absolute left-1/2 top-1/2 -translate-x-20 -translate-y-[120%]'
					)}
				>
					<div className="scene">
						<div className="cube" onClick={() => go()}>
							<div className="face front">1</div>
							<div className="face back">2</div>
							<div className="face right">3</div>
							<div className="face left">4</div>
							<div className="face top">5</div>
							<div className="face bottom">6</div>
						</div>
					</div>
<<<<<<< HEAD
				</div> */}
				<RollDice />
=======
				</div>
				<div className="flex grow justify-center">
					<div className=" size-12 w-max  text-white" style={{ fontSize: 24 }}>
						MY NFTS
					</div>
				</div>
>>>>>>> ac480c7f5bac5e9fd6199c93c0f706f7e7c4d9ee
			</div>
		</div>
	);
}
