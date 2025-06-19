export default function ChartSelector({ type, onTypeChange }) {
    return (
        <div className="flex gap-2 mb-4">
            <button
                className={`px-4 py-2 rounded-lg font-semibold ${type === '2D' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'}`}
                onClick={() => onTypeChange('2D')}
            >
                2D
            </button>
            <button
                className={`px-4 py-2 rounded-lg font-semibold ${type === '3D' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'}`}
                onClick={() => onTypeChange('3D')}
            >
                3D
            </button>
        </div>
    );
} 