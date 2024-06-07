export type Point = { x: number; y: number; center: { x: number; y: number } };
export type Routes = Point[];
export function right(point: Point) {
	return {
		x: point.x + 53,
		y: point.y + 12
	};
}

export function left(point: Point) {
	return {
		x: point.x - 48,
		y: point.y + 22
	};
}

export function up(point: Point) {
	return {
		x: point.x + 48,
		y: point.y - 22
	};
}

export function upLeft(point: Point) {
	return {
		x: point.x - 53,
		y: point.y - 12
	};
}
