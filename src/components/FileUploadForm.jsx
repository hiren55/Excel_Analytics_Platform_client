export default function FileUploadForm({ onFileSelect }) {
    return (
        <div className="border-2 border-dashed border-primary/40 rounded-lg p-8 text-center bg-background/60 mb-6 cursor-pointer">
            <input
                type="file"
                accept=".xlsx"
                className="hidden"
                id="excel-upload"
                onChange={e => onFileSelect && onFileSelect(e.target.files[0])}
            />
            <label htmlFor="excel-upload" className="block cursor-pointer">
                <div className="text-muted-foreground">Drag and drop your .xlsx file here, or click to select</div>
            </label>
        </div>
    );
} 