import { useState } from "react";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SelectFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  label: string;
}

export const SelectFilter: React.FC<SelectFilterProps> = ({
  value,
  onChange,
  options,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (value: string) => {
    onChange(value);
    setIsOpen(false); // Fecha o dropdown após a seleção
  };

  return (
    <div className="flex flex-col justify-center items-start ml-2 gap-1 bg-white p-1 px-3 rounded-xl w-40 relative">
      <label className="text-xs border-b w-full">{label}</label>
      <div
        className="w-full flex justify-between items-center gap-2 cursor-pointer"
        onClick={toggleDropdown}
      >
        <div className="font-extrabold">{options.find((o) => o.value === value)?.label || "Selecione"}</div>
        <FontAwesomeIcon icon={faAngleDown} />
      </div>
      {isOpen && (
        <ul className="absolute top-full left-0 bg-white border rounded-lg shadow-md w-full mt-1 z-10">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className="p-2 hover:bg-gray-100 cursor-pointer border-b"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
