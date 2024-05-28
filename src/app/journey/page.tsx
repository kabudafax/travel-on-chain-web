'use client';
import React, { useEffect, useRef, useState } from 'react';
// import { useAccountEffect, useContractRead } from 'wagmi'
// import {contractConfig, points} from '@/config/NFT-contract.js'
import GameCanvas from '@/app/journey/game';
import tempale1 from '@/../public/tempale1.png';
import tempale2 from '@/../public/tempale2.png';
// import single4 from '@/../public/single4.png';
// import single5 from '@/../public/single5.png';
// import single6 from '@/../public/single6.png';
// import d from '@/../public/d.png';
import panda from '@/../public/panda.png';
import user from '@/../public/man.png';
import { centers } from './constant';
import tempale3 from '@/../public/tample3.png';

import { cn } from '@/lib/utils';
import '@/components/rollDice/styles.scss';
import { RollDice } from '@/components/rollDice/rollDice';

import Modal from '@/components/modal';
import { useModalStore } from '@/store/useModalStore';
// import Image from 'next/image';

//向右x+50y+14;
//向左x - 48 y-22;
type Point = { x: number; y: number; center: { x: number; y: number } };
type Routes = Point[];
const imgs = [tempale1, tempale2, panda];

function right(point: Point) {
	return {
		x: point.x + 53,
		y: point.y + 12.8
	};
}

function left(point: Point) {
	return {
		x: point.x - 47.8,
		y: point.y + 21.8
	};
}

function up(point: Point) {
	return {
		x: point.x + 47.5,
		y: point.y - 21.8
	};
}

function upLeft(point: Point) {
	return {
		x: point.x - 53.3,
		y: point.y - 12.6
	};
}
export default function Game() {
	const [canvasWidth, setCanvasWidth] = useState(0);
	const canvasRef = useRef(null);
	const animateCanvasRef = useRef(null);
	const gameRef = useRef(null);
	// 从合约读取用户初始点位
	// const { refetch } = useContractRead({
	// 	...contractConfig,
	// 	functionName: 'getUserPosition',
	// 	args:['China']
	// });
	// const gridcanvasRef = useRef(null);
	// const cordinateCanvasRef = useRef(null);
	const start = localStorage.getItem('currentPosition')
		? parseInt(localStorage.getItem('currentPosition') as string, 10)
		: 0;
	// if (typeof window !== 'undefined') {
	// 	start =
	// 		window.localStorage.getItem('lastIndex') !== null &&
	// 		window.localStorage.getItem('lastIndex') !== ''
	// 			? localStorage.getItem('lastIndex')
	// 			: 0;
	// }
	const { isShow, setIsShow, setRenderCallback } = useModalStore();

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
		// console.log(routes, 'routes');
		return routes;
	}

	function drawBoard(routes: Routes) {
		const context = canvasRef.current?.getContext('2d');

		// 获取走过的点位的缓存
		const mintedPoint = localStorage.getItem('mintedPoint')
			? JSON.parse(localStorage.getItem('mintedPoint') as string)
			: [];
		routes.forEach((route, index) => {
			if (mintedPoint.includes(index)) {
				console.log('需要绘制成mint过的样式');
				context.fillStyle = 'rgb(248,63,63)'; // 设置方块的颜色
			} else {
				context.fillStyle = 'rgba(250,229,208,0.8)'; // 设置方块的颜色
			}
			context.save(); // 保存当前的绘图状态
			context.translate(route.x, route.y); // 将坐标原点移动到方块的位置
			context.rotate(-Math.PI * 0.19); // 旋转45度
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
		// console.log(routes, 'routes');
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
		// console.log(canvasRef.current, 'canvasRef.current');

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
			// 保存重新绘制的函数到store里面
			setRenderCallback(() => {
				drawBoard(routes);
			});
		}
		if (animateCanvasRef?.current) {
			const userIcon = new Image();
			userIcon.onload = function () {
				const animaContext = animateCanvasRef?.current?.getContext('2d');
				// console.log(animaContext, 'animate', animateCanvasRef);
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

		// 设置canvas绘制的宽高
		const handleResize = () => {
			setCanvasWidth(window.innerWidth * 0.7);
		};
		handleResize();
		window.addEventListener('resize', handleResize);
		// console.log(window);

		return () => {
			if (canvasRef.current) {
				animateCanvasRef.current?.removeEventListener('click', go);
			}
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	async function go(moves: number) {
		if (gameRef.current) {
			await gameRef.current.animate(moves);
		}
		setTimeout(() => {
			setIsShow(true);
		}, 2000);
	}

	// useAccountEffect({
	// 	onConnect(data) {
	// 		console.log('Connected!', data)
	// 		initPosition()
	// 	},
	// })

	// 从合约获取当前用户位置 当钱包连接或者 链切换的时候去调用
	// async function initPosition(){
	// 	const { data, error } = await refetch();
	// 	if (error) {
	// 		console.error("Error reading contract:", error);
	// 	} else {
	// 		// 根据返回的城市名 跳转到指定位置
	// 		if(points[data]){
	// 			go(points[data])
	// 		}
	// 	}
	// }

	return (
		// bg-[#111827]
		<div className="h-full overflow-auto  bg-[#81b1bb]">
			<Modal show={isShow} onClose={() => setIsShow(false)} />

			<div className="box flex">
				<div
					id="chess-board"
					className="relative flex-shrink flex-grow-0 overflow-auto"
					style={{ flexBasis: '70%' }}
				>
					<canvas
						style={{
							marginTop: 10,
							width: canvasWidth,
							zIndex: 4,
							position: 'relative'
						}}
						id="canvas"
						ref={canvasRef}
					></canvas>
					<div></div>
					<canvas
						id="anicanvas"
						ref={animateCanvasRef}
						style={{
							position: 'absolute',
							zIndex: 5,
							top: 10,
							// top: 82,
							left: 0,
							right: 0,
							width: canvasWidth
						}}
					></canvas>
					<img
						src="/assets/chessbg.png"
						alt="background-img for chess board"
						className="absolute left-0 top-0  z-[2] w-full object-cover opacity-100"
						style={{
							marginTop: 10,
							width: canvasWidth - 50,
							height: 728
						}}
					/>
				</div>
				<RollDice onDiceChange={go} />
				<div className="flex grow justify-center">
					<div className=" size-12 w-max  text-white" style={{ fontSize: 24 }}>
						MY NFTS
					</div>
				</div>
			</div>
		</div>
	);
}
