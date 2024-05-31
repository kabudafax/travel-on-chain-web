import React, {
	useEffect,
	useRef,
	useImperativeHandle,
	forwardRef,
	useLayoutEffect
} from 'react';
import ConfettiGenerator from 'confetti-js';
import { object } from 'zod';
const FireworksCanvas = forwardRef((props, ref) => {
	const canvasRef = useRef(null);
	const intervalRef = useRef(null);
	const particlesRef = useRef([]);
	const [confetti, setConfetti] = React.useState(null);

	// 创建 Particle 类
	class Particle {
		constructor(x, y, dx, dy, color) {
			this.x = x;
			this.y = y;
			this.dx = dx;
			this.dy = dy;
			this.color = color;
			this.life = 0;
			this.maxLife = 100;
		}

		update() {
			this.x += this.dx;
			this.y += this.dy;
			this.life++;
		}

		draw(ctx) {
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
			ctx.fill();
		}

		isAlive() {
			return this.life < this.maxLife;
		}
	}

	const createFirework = (ctx, canvas) => {
		const colors = ['#ff0043', '#14fc56', '#1e90ff', '#fffa65', '#ff9500'];
		const color = colors[Math.floor(Math.random() * colors.length)];
		const x = Math.random() * canvas.width;
		const y = Math.random() * canvas.height;
		const particleCount = 100;

		for (let i = 0; i < particleCount; i++) {
			const angle = Math.random() * 2 * Math.PI;
			const speed = Math.random() * 5;
			const dx = Math.cos(angle) * speed;
			const dy = Math.sin(angle) * speed;
			particlesRef.current.push(new Particle(x, y, dx, dy, color));
		}
	};

	const updateParticles = () => {
		particlesRef.current = particlesRef.current.filter((p) => p.isAlive());
		particlesRef.current.forEach((p) => p.update());
	};

	const drawParticles = (ctx) => {
		particlesRef.current.forEach((p) => p.draw(ctx));
	};

	const animate = (ctx, canvas) => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		updateParticles();
		drawParticles(ctx);
		requestAnimationFrame(() => animate(ctx, canvas));
	};

	// 定义 startFireworks 和 stopFireworks 函数
	const startFireworks = () => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!intervalRef.current) {
			createFirework(ctx, canvas);
			intervalRef.current = setInterval(() => createFirework(ctx, canvas), 500); // 每0.5秒创建一个新的烟花
			requestAnimationFrame(() => animate(ctx, canvas));
			// confetti2.render();
			confetti?.render();
		}
	};

	const stopFireworks = () => {
		clearInterval(intervalRef.current);
		intervalRef.current = null;
		confetti?.clear();
	};

	useImperativeHandle(ref, () => ({
		startFireworks,
		stopFireworks
	}));

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		resizeCanvas();

		window.addEventListener('resize', resizeCanvas);

		return () => {
			stopFireworks();
			window.removeEventListener('resize', resizeCanvas);
		};
	}, []);
	const duration = 15 * 1000,
		animationEnd = Date.now() + duration,
		defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

	function randomInRange(min, max) {
		return Math.random() * (max - min) + min;
	}

	const interval = setInterval(function () {
		const timeLeft = animationEnd - Date.now();

		if (timeLeft <= 0) {
			return clearInterval(interval);
		}

		const particleCount = 50 * (timeLeft / duration);

		// since particles fall down, start a bit higher than random
	}, 250);

	useLayoutEffect(() => {
		const confettiSettings = {
			target: 'confetti-canvas',
			max: '180',
			size: '1',
			animate: true,
			props: [
				'circle',
				'square',
				'triangle',
				'line',
				{ type: 'svg', src: 'site/hat.svg', size: 44, weight: 0.2 }
			],
			colors: [
				[165, 104, 246],
				[230, 61, 135],
				[0, 199, 228],
				[253, 214, 126]
			],
			clock: '25',
			rotate: true,
			width: '2560',
			height: '1271',
			start_from_edge: false,
			respawn: true
		};
		setConfetti(new ConfettiGenerator(confettiSettings));
	}, []);

	return (
		<>
			<canvas
				ref={canvasRef}
				style={{
					position: 'absolute',
					zIndex: 8,
					top: 10,
					// top: 82,
					left: 0,
					right: 0,
					width: window.innerWidth * 0.7,
					pointerEvents: 'none'
				}}
			/>
			<canvas
				id="confetti-canvas"
				className="pointer-events-none fixed bottom-0 left-0 right-0 top-0 z-[5] h-full w-full"
				pointer-events-none
			/>
			<canvas
				id="confetti-canvas"
				className="pointer-events-none fixed bottom-0 left-0 right-0 top-0 z-[5] h-full w-full"
				pointer-events-none
			/>
		</>
	);
});

export default FireworksCanvas;
