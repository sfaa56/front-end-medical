// components/FormError.tsx
import React from "react";

interface FormErrorProps {
  message?: string | undefined | null;
}

const FormError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;
  return (
    <p className="mt-1 text-sm text-red-500  flex items-center gap-1">
      <span>*</span> {message}
    </p>
  );
};

export default FormError;
