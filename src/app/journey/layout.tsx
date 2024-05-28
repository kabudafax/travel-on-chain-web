import Chat from '@/components/chat-bot/chat';
import { Navbar } from '@/components/navbar';

const GameLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div>
			<Navbar className="bg-[#111827]" />
			<Chat />
			{children}
		</div>
	);
};

export default GameLayout;
