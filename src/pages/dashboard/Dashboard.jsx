import { motion } from 'framer-motion';

export default function Dashboard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="glassmorphism rounded-xl p-8 text-center shadow-lg">
                <h2 className="text-3xl font-bold glow-text mb-2">Welcome to Excel Analytics Platform</h2>
                <p className="text-lg text-muted-foreground">
                    Upload, analyze, and visualize your Excel data with AI-powered insights.
                </p>
            </div>
        </motion.div>
    );
} 