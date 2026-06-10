"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToastStore } from "@/store/useToastStore";
import { CheckCircle, AlertTriangle, Info, ShieldAlert, X } from "lucide-react";

export default function ToastProvider() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 left-0 right-0 z-[100] flex flex-col items-center gap-2 pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map((toast) => {
          let Icon = Info;
          let bgColor = "bg-white";
          let textColor = "text-gray-800";
          let iconColor = "text-blue-500";
          let borderColor = "border-gray-100";

          if (toast.type === "success") {
            Icon = CheckCircle;
            iconColor = "text-green-500";
            borderColor = "border-green-100";
          } else if (toast.type === "error") {
            Icon = AlertTriangle;
            iconColor = "text-red-500";
            borderColor = "border-red-100";
          } else if (toast.type === "warning") {
            Icon = ShieldAlert;
            bgColor = "bg-rose-600";
            textColor = "text-white";
            iconColor = "text-white";
            borderColor = "border-rose-700";
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border ${bgColor} ${borderColor} max-w-sm w-full mx-auto backdrop-blur-md bg-opacity-95`}
            >
              <Icon size={20} className={iconColor} />
              <p className={`text-sm font-medium flex-1 ${textColor} break-words whitespace-pre-line`}>
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                className={`p-1 rounded-full hover:bg-black/5 transition-colors ${textColor} opacity-60 hover:opacity-100`}
              >
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
