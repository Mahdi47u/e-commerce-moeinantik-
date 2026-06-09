type AuthFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
};

export default function AuthField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: AuthFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="mr-1 text-primary">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
}
