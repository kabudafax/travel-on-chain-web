'use client';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

// Ensure Cesium is only imported in the client-side bundle
if (typeof window !== 'undefined') {
	var Cesium = require('cesium/Cesium');
	require('cesium/Widgets/widgets.css');
}

export default function NightEarth({ className }: { className: String }) {
	const router = useRouter();

	const cesiumContainerRef = useRef(null);
	const [isSpinning, setIsSpinning] = useState(false);
	let is = true;

	let viewer: any;

	useEffect(() => {
		if (typeof window !== 'undefined') {
			// Cesium will be initialized here
			Cesium.Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN!;

			Cesium.Camera.DEFAULT_VIEW_RECTANGLE_FACTOR = 3;

			viewer = new Cesium.Viewer('cesiumContainer', {
				terrain: Cesium.Terrain.fromWorldTerrain()
			});

			// 隐藏toolbar
			viewer.animation._container.style.display = 'none'; //隐藏掉时钟 图中6
			viewer.timeline.container.style.display = 'none'; //隐藏时间轴 图中7
			viewer.fullscreenButton.container.style.display = 'none'; //隐藏全屏按钮 图中8
			viewer._cesiumWidget._creditContainer.style.display = 'none'; //隐藏logo 图中9
			const toolbar: HTMLElement = document.querySelector(
				'.cesium-viewer-toolbar'
			)!;
			toolbar.style.display = 'none';

			initializeCesium();
			startSpinGlobe();
		}
	}, []);

	// initialize earth
	const initializeCesium = async () => {
		try {
			Cesium.Camera.DEFAULT_VIEW_RECTANGLE_FACTOR = 3;

			// const imageryLayer = viewer.imageryLayers.addImageryProvider(await Cesium.IonImageryProvider.fromAssetId(3812));
			// await viewer.zoomTo(imageryLayer);

			// 方法2
			// 获取新的图像层的覆盖范围
			// const imageryLayerExtent = imageryLayer.imageryProvider.rectangle;

			// 将相机视图调整为新的图像层的覆盖范围
			// viewer.camera.flyTo({
			//   destination: Cesium.Rectangle.fromDegrees(
			//     Cesium.Math.toDegrees(imageryLayerExtent.west),
			//     Cesium.Math.toDegrees(imageryLayerExtent.south),
			//     Cesium.Math.toDegrees(imageryLayerExtent.east),
			//     Cesium.Math.toDegrees(imageryLayerExtent.north)
			//   ),
			// });

			// 方法3
			const imageryProvider = await Cesium.IonImageryProvider.fromAssetId(3812);
			const imageryLayer =
				viewer.imageryLayers.addImageryProvider(imageryProvider);
			// 等待图像图层加载完成
			imageryProvider.readyPromise.then(() => {
				// 获取图像图层的覆盖范围
				const imageryLayerExtent = imageryProvider.rectangle;

				// 计算相机的目标位置
				const targetPosition = Cesium.Rectangle.center(imageryLayerExtent);

				// 计算相机的目标高度
				const targetHeight = Cesium.Cartesian3.magnitude(
					viewer.scene.globe.ellipsoid.cartographicToCartesian(
						new Cesium.Cartographic(
							targetPosition.longitude,
							targetPosition.latitude,
							0
						)
					)
				);

				// 设置相机的视图
				viewer.camera.setView({
					destination: Cesium.Cartesian3.fromDegrees(
						targetPosition.longitude,
						targetPosition.latitude,
						targetHeight * 3
					), // 设置相机的高度为覆盖范围的 3 倍
					orientation: {
						heading: Cesium.Math.toRadians(0), // 设置方向，0 表示正北方向
						pitch: Cesium.Math.toRadians(-90), // 设置俯仰角，-90 表示地球仰角为 0，即相机垂直向下
						roll: 0 // 设置侧倾角，0 表示无侧倾
					}
				});

				// 设置视图矩形的因子
				viewer.scene.screenSpaceCameraController.minimumZoomDistance =
					(targetHeight * 3) / 3;
				viewer.scene.screenSpaceCameraController.maximumZoomDistance =
					targetHeight * 3 * 3;
			});
		} catch (error) {
			console.log(error);
		}

		const buildingTileset = await Cesium.createOsmBuildingsAsync();
		viewer.scene.primitives.add(buildingTileset);

		// 设置初始相机距离（相机到地球表面的距离）
		// viewer.scene.camera.distance = 50000000000000000000000000000000000000; // 将距离设为 5000000 米，可以根据需要调整

		// 设置相机视角
		// viewer.scene.camera.setView({
		//   destination: Cesium.Cartesian3.fromDegrees(-75.16375, 39.952583, 5000000), // 设置初始位置，这里的经纬度可以根据需要调整
		//   orientation: {
		//     heading: Cesium.Math.toRadians(0), // 设置方向，0 表示正北方向
		//     pitch: Cesium.Math.toRadians(-90), // 设置俯仰角，-90 表示地球仰角为 0，即相机垂直向下
		//     roll: 0, // 设置侧倾角，0 表示无侧倾
		//   },
		// });
	};

	// spin earth
	let previousTime = Date.now();
	let spinRate = 0.1;

	function applyGlobeSpin() {
		var currentTime = Date.now();
		var delta = (currentTime - previousTime) / 1000;
		previousTime = currentTime;
		viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -spinRate * delta);
	}

	function startSpinGlobe() {
		previousTime = Date.now();
		viewer.clock.onTick.addEventListener(applyGlobeSpin);
	}

	function stopSpinGlobe() {
		viewer.clock.onTick.removeEventListener(applyGlobeSpin);
	}

	// 处理点击事件，飞行+跳转
	function handleClick() {
		stopSpinGlobe();
		// 获取输入框元素
		const inputElement: HTMLInputElement = document.querySelector(
			'.cesium-geocoder-input'
		)!;

		// 将输入框的值设置为 "china"
		inputElement.value = 'china';

		// 触发搜索事件（如果有的话）
		inputElement.dispatchEvent(new Event('input'));
		const searchButton: HTMLButtonElement = document.querySelector(
			'.cesium-geocoder-searchButton'
		)!;
		// if (searchButton) {
		//   searchButton.click();
		// }

		// 用promise
		new Promise((resolve, reject) => {
			// 如果搜索按钮存在，则绑定点击事件
			if (searchButton) {
				// @ts-ignore
				searchButton.click();
			} else {
				// 如果搜索按钮不存在，则拒绝 Promise
				reject('搜索按钮不存在');
			}
		}).then((resolve) => {
			if (resolve) {
				console.log('fly to');
			}
		});

		setTimeout(() => {
			router.push('/journey');
			console.log('222');
		}, 5000);
	}

	return (
		<div className={cn('', className)}>
			<div
				id="cesiumContainer"
				ref={cesiumContainerRef}
				style={{ width: '100%', height: '100vh' }}
			/>
			{/* <div id="cesiumContainer" ref={cesiumContainerRef} style={{ width: "50%", height: "50vh" }} /> */}
			<button
				className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-1 py-1 text-xs font-bold text-white shadow-md transition duration-300 ease-in-out hover:from-purple-500 hover:to-blue-600 hover:shadow-lg"
				style={{
					position: 'absolute',
					zIndex: 3,
					pointerEvents: 'visible',
					top: '60px',
					right: '40px',
					width: '50px',
					height: '50px'
				}}
				onClick={() => {
					handleClick();
				}}
			>
				Dive Into
			</button>
		</div>
	);
}
