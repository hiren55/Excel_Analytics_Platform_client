import { motion } from 'framer-motion';
import { BarChart3, Cube } from 'lucide-react';

export default function Charts() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="glassmorphism rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold glow-text mb-4 flex items-center gap-2">
                    <BarChart3 className="h-7 w-7" /> Chart Generator
                </h2>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <label className="block mb-1 font-medium">X Axis</label>
                        <select className="w-full rounded-lg border border-border bg-background p-2">
                            <option>Select column</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block mb-1 font-medium">Y Axis</label>
                        <select className="w-full rounded-lg border border-border bg-background p-2">
                            <option>Select column</option>
                        </select>
                    </div>
                    <button className="rounded-lg bg-primary px-4 py-2 text-primary-foreground font-semibold hover:bg-primary/80 transition">Generate</button>
                </div>
                <div className="flex items-center gap-4 mb-4">
                    <button className="flex items-center gap-1 px-3 py-1 rounded-lg bg-accent text-accent-foreground font-medium">
                        <BarChart3 className="h-4 w-4" /> 2D
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 rounded-lg bg-accent text-accent-foreground font-medium">
                        <Cube className="h-4 w-4" /> 3D
                    </button>
                </div>
                <div className="h-72 flex items-center justify-center bg-background/60 rounded-lg border border-border">
                    <span className="text-muted-foreground">Chart will appear here</span>
                </div>
                <div className="flex gap-4 mt-4">
                    <button className="rounded-lg bg-primary px-4 py-2 text-primary-foreground font-semibold hover:bg-primary/80 transition">Download PNG</button>
                    <button className="rounded-lg bg-secondary px-4 py-2 text-secondary-foreground font-semibold hover:bg-secondary/80 transition">Download PDF</button>
                </div>
            </div>
        </motion.div>
    );
} 