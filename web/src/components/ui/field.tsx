import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type FieldRootProps = {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactElement<{ id?: string; "aria-describedby"?: string; "aria-invalid"?: boolean }>;
  className?: string;
};

const controlClassName =
  "min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/20";

export function FieldRoot({ label, hint, error, required, children, className }: FieldRootProps) {
  const generatedId = React.useId();
  const inputId = children.props.id || generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("grid gap-2", className)}>
      <label htmlFor={inputId} className="text-sm font-semibold text-foreground">
        {label}
        {required && <span className="mr-1 text-primary" aria-hidden="true">*</span>}
      </label>
      {React.cloneElement(children, {
        id: inputId,
        "aria-describedby": describedBy,
        "aria-invalid": Boolean(error) || undefined,
      })}
      {hint && !error && <p id={hintId} className="text-xs leading-5 text-muted-foreground">{hint}</p>}
      {error && (
        <p id={errorId} className="flex items-start gap-2 text-xs leading-5 text-destructive">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

export const TextInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(controlClassName, className)} {...props} />
  )
);
TextInput.displayName = "TextInput";

export const TextArea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(controlClassName, "min-h-28 resize-y py-3 leading-7", className)} {...props} />
  )
);
TextArea.displayName = "TextArea";

export const SelectField = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select ref={ref} className={cn(controlClassName, "cursor-pointer", className)} {...props} />
  )
);
SelectField.displayName = "SelectField";

