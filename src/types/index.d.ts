declare module 'confetti-js' {
	export class ConfettiGenerator {
		constructor(config: any);
		render(): void;
		clear(): void;
	}
}
