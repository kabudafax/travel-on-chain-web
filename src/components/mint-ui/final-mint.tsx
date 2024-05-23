'use client';

import { useEffect } from 'react';
import ConfettiGenerator from "confetti-js";
import './styles.scss'

export const FinalMint = () => {
	useEffect(() => {
		const confettiSettings = {"target":"confetti-canvas","max":"180","size":"1","animate":true,"props":["circle","square","triangle","line",{"type":"svg","src":"site/hat.svg","size":44,"weight":0.2}],"colors":[[165,104,246],[230,61,135],[0,199,228],[253,214,126]],"clock":"25","rotate":true,"width":"2560","height":"1271","start_from_edge":false,"respawn":true};
		const confetti = new ConfettiGenerator(confettiSettings);
		confetti.render();

		return () => confetti.clear();
	}, []) // add the var dependencies or not

	return (
		<div className="fixed top-0 left-0 bottom-0 right-0 bg-white">
			<canvas id="confetti-canvas" className="h-full w-full"/>
			<h1 className='congrats absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>Congratulations!</h1>
		</div>
	);
};
