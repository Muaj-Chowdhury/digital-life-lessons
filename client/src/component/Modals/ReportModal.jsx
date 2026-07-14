import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { AlertTriangle, Flag, X, ChevronRight, Loader2 } from 'lucide-react';

const REPORT_REASONS = [
  "Inappropriate Content",
  "Hate Speech or Harassment",
  "Misleading or False Information",
  "Spam or Promotional Content",
  "Sensitive or Disturbing Content",
  "Other",
];

const ReportModal = ({ isOpen, closeModal, reportSubmit }) => {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close and Reset Helper
  const handleClose = () => {
    setStep(1);
    setReason("");
    closeModal();
  };

  const handleFinalSubmit = async () => {
    if (!reason) return;
    setIsSubmitting(true);
    await reportSubmit(reason); // Assuming reportSubmit is async
    setIsSubmitting(false);
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-base-300/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-base-100 border border-base-300 p-8 shadow-2xl"
          >
            <button
              onClick={handleClose}
              className="absolute right-6 top-6 text-base-content/40 hover:text-error transition-colors"
            >
              <X size={24} />
            </button>

            {/* STEP 1: INITIAL WARNING */}
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center"
                >
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-error/10 text-error shadow-inner">
                    <AlertTriangle size={32} />
                  </div>
                  
                  <h3 className="mb-3 text-2xl font-black text-base-content tracking-tight">
                    Flag Content?
                  </h3>
                  <p className="mb-8 text-base-content/60 font-medium leading-relaxed">
                    Our community thrives on quality. If this lesson violates our 
                    guidelines, let us know and our team will review it.
                  </p>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => setStep(2)}
                      className="w-full rounded-2xl bg-error py-4 font-bold text-white hover:bg-error/90 transition-all shadow-lg shadow-error/20 active:scale-95"
                    >
                      Yes, report this content
                    </button>
                    <button
                      onClick={handleClose}
                      className="w-full rounded-2xl bg-base-200 py-4 font-bold text-base-content/70 hover:bg-base-300 transition-all"
                    >
                      No, go back
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* STEP 2: REASON SELECTION */
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-base-content flex items-center gap-2">
                      <Flag size={20} className="text-error" />
                      Select a Reason
                    </h3>
                    <p className="text-sm text-base-content/50 font-medium">
                      Help us understand what's wrong with this lesson.
                    </p>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {REPORT_REASONS.map((r, index) => (
                      <motion.button
                        key={r}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
                        onClick={() => setReason(r)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all font-bold text-sm ${
                          reason === r 
                          ? "border-error bg-error/5 text-error shadow-md" 
                          : "border-base-200 bg-base-200/50 text-base-content/60 hover:border-base-300"
                        }`}
                      >
                        {r}
                        {reason === r && <ChevronRight size={18} />}
                      </motion.button>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-base-200">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-3 font-bold text-base-content/40 hover:text-base-content transition-colors"
                      disabled={isSubmitting}
                    >
                      Back
                    </button>
                    <button
                      onClick={handleFinalSubmit}
                      disabled={!reason || isSubmitting}
                      className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-base-content py-4 font-bold text-base-100 hover:opacity-90 disabled:opacity-30 transition-all active:scale-95 shadow-xl"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Confirm Report"
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReportModal;