import { memo, useRef, useEffect } from "react";

interface ProgressBarProps {
    currentTime: number;
    duration: number;
    loadingProgress: number;
    progressPercentage: number;
    isPlaying: boolean;
    isAudioReady: boolean;
    key: string;
    onProgressBarClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ProgressBar = memo(({
    currentTime,
    duration,
    loadingProgress,
    progressPercentage,
    isPlaying,
    isAudioReady,
    key,
    onProgressBarClick
}: ProgressBarProps) => {
    const lastValidDurationRef = useRef(duration);
    const lastValidCurrentTimeRef = useRef(currentTime);
    const lastValidProgressRef = useRef(progressPercentage);

    // Update refs when we have valid values
    useEffect(() => {
        // Always update refs with the latest values if they're valid
        if (duration > 0) {
            lastValidDurationRef.current = duration;
        }

        if (currentTime > 0) {
            lastValidCurrentTimeRef.current = currentTime;
        }

        if (progressPercentage > 0) {
            lastValidProgressRef.current = progressPercentage;
        }
    }, [duration, currentTime, progressPercentage]);

    // Use the stored values if the current ones are 0
    const displayDuration = duration || lastValidDurationRef.current;
    const displayCurrentTime = currentTime || lastValidCurrentTimeRef.current;
    const displayProgress = progressPercentage || lastValidProgressRef.current;

    const formatTime = (time: number) => {
        if (isNaN(time) || time === 0) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="flex items-center gap-4 mb-4">
            <span className="text-sm text-cyan-300 min-w-[40px]">
                {formatTime(displayCurrentTime)}
            </span>

            <div
                className="relative flex-1 h-5 flex items-center cursor-pointer"
                onClick={onProgressBarClick}
            >
                <div className="bg-fuchsia-900 relative grow rounded-full h-1 w-full">
                    <div
                        className="absolute bg-fuchsia-700/50 rounded-full h-full"
                        style={{ width: `${loadingProgress}%` }}
                    />
                    <div
                        className="absolute bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full h-full"
                        style={{
                            width: `${displayProgress}%`,
                            transition: isPlaying ? 'width 0.1s linear' : 'none'
                        }}
                    />
                    {isAudioReady && (
                        <div
                            className="absolute block w-3 h-3 bg-white rounded-full shadow-md hover:bg-fuchsia-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transform -translate-y-1/2 top-1/2"
                            style={{ left: `calc(${displayProgress}% - 6px)` }}
                        />
                    )}
                </div>
            </div>

            <span className="text-xs text-cyan-300 w-10">
                {formatTime(displayDuration)}
            </span>
        </div>
    );
}, (prevProps, nextProps) => {
    // Only re-render if these specific props change significantly
    return (
        Math.abs(prevProps.currentTime - nextProps.currentTime) < 0.1 &&
        Math.abs(prevProps.duration - nextProps.duration) < 0.1 &&
        Math.abs(prevProps.loadingProgress - nextProps.loadingProgress) < 0.5 &&
        Math.abs(prevProps.progressPercentage - nextProps.progressPercentage) < 0.5 &&
        prevProps.isPlaying === nextProps.isPlaying &&
        prevProps.isAudioReady === nextProps.isAudioReady
    );
});

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
