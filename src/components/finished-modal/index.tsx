import React, { useEffect, useState } from 'react';
import shanghai from '../../public/shanghai.jpg';
import Image from 'next/image';
import { Button } from '.././ui/button';
import { MintButton } from '../mint-ui/mint-button';
import {
	// Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem
} from '@material-ui/core';
interface ModalProps {
	show: boolean;
	onClose: () => void;
}

const FinishedModal: React.FC<ModalProps> = ({ show, onClose }) => {
	// const [info, setInfo] = React.useState<any>();
	const [info, setInfo] = React.useState({});
	const [city, setCity] = useState('');

	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setCity(event.target.value as string);
	};

	useEffect(() => {}, [show]);
	return (
		<div
			className={`fixed inset-0 z-30 flex scale-105 transform items-center justify-center  bg-opacity-50 ${show ? 'visible opacity-100' : 'invisible opacity-0'} transition-all duration-300`}
		>
			<div className="m-4 mx-auto max-w-sm rounded bg-white p-6 shadow-lg">
				<h1 className="mb-4 text-2xl font-bold">
					Congratulations on your special reward!
				</h1>
				<p className="mb-4">
					Please select a city of interest to check offline:
				</p>
				<select
					className="mb-4 w-full border p-2"
					value={city}
					onChange={handleChange}
				>
					<option value="Shanghai">Shanghai</option>
					<option value="Beijing">Beijing</option>
				</select>
				<div className="flex items-center justify-center">
					<Button
						variant="premium"
						className="mt-4 rounded-full p-4  font-semibold md:p-6 md:text-lg"
						onClick={onClose}
					>
						Confirm
					</Button>
				</div>
			</div>
		</div>
	);
};

export default FinishedModal;
