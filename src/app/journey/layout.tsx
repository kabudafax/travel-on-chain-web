import { Navbar } from '@/components/navbar';

const GameLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div>
			<Navbar className="bg-[#111827]" />
			{children}
		</div>
	);
};

export default GameLayout;
