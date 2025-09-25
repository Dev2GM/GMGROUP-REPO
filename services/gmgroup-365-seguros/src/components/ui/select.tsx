import { ChevronDownIcon } from "lucide-react";

interface SelectProps {
  id: string;
  name: string;
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

function Select({
  id,
  name,
  label,
  options,
  placeholder = "Selecciona una opción",
  required = false,
  value,
  onChange,
  className = "",
}: SelectProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-left text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="block w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-principal focus:border-principal appearance-none pr-8"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDownIcon className="fill-current h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

export default Select;
