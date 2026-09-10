import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        style: {
          background: "#ffffff",
          color: "#0f172a",
          border: "1px solid #e2e8f0",
          borderRadius: "0.75rem",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        },
      }}
    />
  );
}
