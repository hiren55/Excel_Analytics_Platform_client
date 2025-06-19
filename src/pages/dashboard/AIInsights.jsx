import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

export default function AIInsights() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="glassmorphism rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold glow-text mb-4 flex items-center gap-2">
                    <Brain className="h-7 w-7" /> AI Insights
                </h2>
                <form className="mb-6">
                    <textarea
                        className="w-full rounded-lg border border-border bg-background p-3 text-base resize-none min-h-[100px]"
                        placeholder="Ask AI to summarize or analyze your data..."
                    />
                    <button
                        type="submit"
                        className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground font-semibold hover:bg-primary/80 transition"
                    >
                        Get Insights
                    </button>
                </form>
                <div className="bg-background/60 rounded-lg border border-border p-6 min-h-[80px] text-center">
                    <span className="text-muted-foreground">AI summary or insights will appear here.</span>
                </div>
            </div>
        </motion.div>
    );
} 