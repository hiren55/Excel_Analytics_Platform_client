export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-6xl font-bold glow-text mb-4">404</h1>
            <p className="text-lg text-muted-foreground mb-6">Page not found.</p>
            <a href="/" className="rounded-lg bg-primary px-4 py-2 text-primary-foreground font-semibold hover:bg-primary/80 transition">Go to Dashboard</a>
        </div>
    );
} 