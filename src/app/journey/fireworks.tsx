import React, {
	useEffect,
	useRef,
	useImperativeHandle,
	forwardRef
} from 'react';

const FireworksCanvas = forwardRef((props, ref) => {
	const canvasRef = useRef(null);
	const intervalRef = useRef(null);
	const particlesRef = useRef([]);

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
		}
	};

	const stopFireworks = () => {
		clearInterval(intervalRef.current);
		intervalRef.current = null;
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

	return (
		<canvas
			ref={canvasRef}
			style={{
				position: 'absolute',
				zIndex: 5,
				top: 10,
				// top: 82,
				left: 0,
				right: 0,
				width: window.innerWidth * 0.7
			}}
		/>
	);
});

export default FireworksCanvas;
