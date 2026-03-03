import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Sparkles } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import FileDropZone from "@/components/FileDropZone";
import TemplateBuilder from "@/components/TemplateBuilder";
import FilePreview from "@/components/FilePreview";

const Index = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [tokens, setTokens] = useState<string[]>([]);
  const [separator, setSeparator] = useState("_");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [isDownloading, setIsDownloading] = useState(false);

  const { newNames, duplicates } = useMemo(() => {
    if (files.length === 0 || tokens.length === 0) return { newNames: [], duplicates: new Set<number>() };

    const baseName = tokens
      .map((t) => formValues[t] || "")
      .filter(Boolean)
      .join(separator);

    if (!baseName) return { newNames: files.map(() => ""), duplicates: new Set<number>() };

    const names: string[] = [];
    const counts: Record<string, number> = {};
    const dupes = new Set<number>();

    files.forEach((file, i) => {
      const ext = file.name.includes(".") ? "." + file.name.split(".").pop() : "";
      let name = baseName + ext;

      if (counts[name] !== undefined) {
        counts[name]++;
        // mark the first occurrence too
        const firstIdx = names.indexOf(name);
        if (firstIdx !== -1) {
          names[firstIdx] = baseName + `_1` + ext;
          dupes.add(firstIdx);
        }
        name = baseName + `_${counts[name]}` + ext;
        dupes.add(i);
      } else {
        counts[name] = 1;
      }
      names.push(name);
    });

    return { newNames: names, duplicates: dupes };
  }, [files, tokens, separator, formValues]);

  const canDownload = files.length > 0 && newNames.some((n) => n);

  const handleDownload = useCallback(async () => {
    if (!canDownload) return;
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      for (let i = 0; i < files.length; i++) {
        const name = newNames[i] || files[i].name;
        zip.file(name, files[i]);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "pervadinti_failai.zip");
    } finally {
      setIsDownloading(false);
    }
  }, [files, newNames, canDownload]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h1
              className="text-3xl font-bold text-foreground tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              pervadink
              <span className="text-primary">.lt</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Įkelk failus · Sudėk šabloną · Parsisiųsk
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-10">
          {/* Step 1: Upload */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StepLabel number={1} label="Įkelkite failus" />
            <FileDropZone files={files} onFilesChange={setFiles} />
          </motion.section>

          {/* Step 2: Template */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StepLabel number={2} label="Sukurkite šabloną" />
            <TemplateBuilder
              tokens={tokens}
              onTokensChange={setTokens}
              separator={separator}
              onSeparatorChange={setSeparator}
              formValues={formValues}
              onFormValuesChange={setFormValues}
            />
          </motion.section>

          {/* Step 3: Preview */}
          {files.length > 0 && tokens.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <StepLabel number={3} label="Peržiūra ir atsisiuntimas" />
              <FilePreview files={files} newNames={newNames} duplicates={duplicates} />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!canDownload || isDownloading}
                onClick={handleDownload}
                className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[var(--glow-primary-strong)]"
              >
                <Download className="h-4 w-4" />
                {isDownloading ? "Ruošiama..." : "Atsisiųsti ZIP"}
              </motion.button>
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
};

const StepLabel = ({ number, label }: { number: number; label: string }) => (
  <div className="flex items-center gap-3 mb-4">
    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
      {number}
    </span>
    <span className="text-sm font-medium text-foreground">{label}</span>
  </div>
);

export default Index;
