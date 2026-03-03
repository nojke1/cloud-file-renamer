import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X } from "lucide-react";

interface FileDropZoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

const FileDropZone = ({ files, onFilesChange }: FileDropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = Array.from(e.dataTransfer.files);
      onFilesChange([...files, ...dropped]);
    },
    [files, onFilesChange]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesChange([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        animate={{
          borderColor: isDragging ? "hsl(175, 80%, 50%)" : "hsl(220, 15%, 18%)",
          backgroundColor: isDragging ? "hsl(175, 80%, 50%, 0.05)" : "transparent",
        }}
        className="relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors"
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileInput}
        />
        <motion.div
          animate={{ y: isDragging ? -4 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Upload className="mx-auto mb-4 h-10 w-10 text-primary opacity-60" />
          <p className="text-muted-foreground text-sm">
            Tempkite failus čia arba <span className="text-primary underline">pasirinkite</span>
          </p>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {files.map((file, i) => (
              <motion.div
                key={`${file.name}-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between bg-card rounded-lg px-4 py-3 border border-border"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm truncate" style={{ fontFamily: "var(--font-mono)" }}>
                    {file.name}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {(file.size / 1024).toFixed(0)} KB
                  </span>
                </div>
                <button
                  onClick={() => removeFile(i)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileDropZone;
