import { motion } from 'framer-motion';
import { History } from 'lucide-react';

export default function HistoryPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="glassmorphism rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold glow-text mb-4 flex items-center gap-2">
                    <History className="h-7 w-7" /> Upload & Chart History
                </h2>
                <div className="bg-background/60 rounded-lg border border-border p-6 text-center">
                    <span className="text-muted-foreground">Your upload and chart generation history will appear here.</span>
                </div>
            </div>
        </motion.div>
    );
} 