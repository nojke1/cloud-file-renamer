import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const AVAILABLE_TOKENS = [
  { id: "dalykas", label: "Dalykas" },
  { id: "pavarde", label: "Pavardė" },
  { id: "vardas", label: "Vardas" },
  { id: "data", label: "Data" },
  { id: "grupe", label: "Grupė" },
  { id: "nr", label: "Nr." },
  { id: "tipas", label: "Tipas" },
];

interface TemplateBuilderProps {
  tokens: string[];
  onTokensChange: (tokens: string[]) => void;
  separator: string;
  onSeparatorChange: (sep: string) => void;
  formValues: Record<string, string>;
  onFormValuesChange: (values: Record<string, string>) => void;
}

const SEPARATORS = [
  { value: "_", label: "_" },
  { value: "-", label: "-" },
  { value: ".", label: "." },
];

const TemplateBuilder = ({
  tokens,
  onTokensChange,
  separator,
  onSeparatorChange,
  formValues,
  onFormValuesChange,
}: TemplateBuilderProps) => {
  const addToken = (id: string) => {
    if (!tokens.includes(id)) {
      onTokensChange([...tokens, id]);
    }
  };

  const removeToken = (id: string) => {
    onTokensChange(tokens.filter((t) => t !== id));
  };

  const unusedTokens = AVAILABLE_TOKENS.filter((t) => !tokens.includes(t.id));

  return (
    <div className="space-y-6">
      {/* Template chips */}
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-wider mb-3 block">
          Šablonas
        </label>
        <div className="flex flex-wrap gap-2 min-h-[48px] bg-card border border-border rounded-xl p-4">
          {tokens.map((tokenId, i) => {
            const token = AVAILABLE_TOKENS.find((t) => t.id === tokenId);
            return (
              <motion.button
                key={tokenId}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={() => removeToken(tokenId)}
                className="px-3 py-1.5 rounded-lg bg-primary/15 text-primary text-sm font-medium hover:bg-primary/25 transition-colors border border-primary/20"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {token?.label}
                {i < tokens.length - 1 && (
                  <span className="ml-2 text-muted-foreground">{separator}</span>
                )}
              </motion.button>
            );
          })}
          {tokens.length === 0 && (
            <span className="text-muted-foreground text-sm">
              Pasirinkite elementus žemiau...
            </span>
          )}
        </div>
      </div>

      {/* Available tokens */}
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-wider mb-3 block">
          Galimi elementai
        </label>
        <div className="flex flex-wrap gap-2">
          {unusedTokens.map((token) => (
            <motion.button
              key={token.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addToken(token.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm border border-border hover:border-primary/40 transition-colors"
            >
              <Plus className="h-3 w-3" />
              {token.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Separator */}
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-wider mb-3 block">
          Skirtukas
        </label>
        <div className="flex gap-2">
          {SEPARATORS.map((sep) => (
            <button
              key={sep.value}
              onClick={() => onSeparatorChange(sep.value)}
              className={`px-4 py-2 rounded-lg text-sm font-mono border transition-all ${
                separator === sep.value
                  ? "border-primary bg-primary/10 text-primary shadow-[var(--glow-primary)]"
                  : "border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              {sep.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form fields */}
      {tokens.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <label className="text-xs text-muted-foreground uppercase tracking-wider mb-3 block">
            Reikšmės
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tokens.map((tokenId) => {
              const token = AVAILABLE_TOKENS.find((t) => t.id === tokenId);
              return (
                <div key={tokenId}>
                  <input
                    type={tokenId === "data" ? "date" : "text"}
                    placeholder={token?.label}
                    value={formValues[tokenId] || ""}
                    onChange={(e) =>
                      onFormValuesChange({ ...formValues, [tokenId]: e.target.value })
                    }
                    className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-[var(--glow-primary)] transition-all"
                    style={{ fontFamily: "var(--font-mono)" }}
                  />
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TemplateBuilder;
