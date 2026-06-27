import { FieldRoot, TextInput } from "@/components/ui/field";

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
    <FieldRoot label={label} required={required}>
      <TextInput
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
      />
    </FieldRoot>
  );
}
