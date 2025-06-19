export default function ChartCard({ title, children }) {
    return (
        <div className="glassmorphism rounded-lg p-6 shadow-lg mb-6">
            <h3 className="font-bold text-lg mb-2 glow-text">{title}</h3>
            <div>{children || <div className="text-muted-foreground text-center">Chart goes here</div>}</div>
        </div>
    );
} 