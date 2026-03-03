import { motion } from "framer-motion";
import { ArrowRight, AlertTriangle } from "lucide-react";

interface FilePreviewProps {
  files: File[];
  newNames: string[];
  duplicates: Set<number>;
}

const FilePreview = ({ files, newNames, duplicates }: FilePreviewProps) => {
  if (files.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <label className="text-xs text-muted-foreground uppercase tracking-wider block">
        Peržiūra
      </label>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {files.map((file, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-3 px-4 py-3 text-sm ${
              i > 0 ? "border-t border-border" : ""
            }`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span className="text-muted-foreground truncate flex-1 text-xs">
              {file.name}
            </span>
            <ArrowRight className="h-3 w-3 text-primary shrink-0" />
            <span className="text-foreground truncate flex-1 text-xs">
              {newNames[i] || "..."}
            </span>
            {duplicates.has(i) && (
              <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 shrink-0" />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FilePreview;
