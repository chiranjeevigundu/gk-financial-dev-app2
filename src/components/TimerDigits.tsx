import { useGlobal } from '../context/GlobalContext';

export function TimerDigits() {
    const { auctionState } = useGlobal();
    const seconds = auctionState.secondsLeft;

    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');

    return <div className="text-4xl font-black tracking-wider tabular-nums">{mm}:{ss}</div>;
}
