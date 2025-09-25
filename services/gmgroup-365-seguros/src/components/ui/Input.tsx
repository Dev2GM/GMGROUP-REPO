interface InputProps {
  id: string;
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "date" | "number" | "password";
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
}

function Input({
  id,
  name,
  label,
  type = "text",
  placeholder,
  required = false,
  value,
  onChange,
  className = "",
  disabled = false,
}: InputProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-left text-sm font-medium mb-1">
        {label}
        {required && <span className="text-rojo ml-1">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="block w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-principal focus:border-principal"
      />
    </div>
  );
}

export default Input;
