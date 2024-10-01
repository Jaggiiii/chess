import React from "react";

interface ButtonProps {
  onClick: () => void; 
  label: string;       
}

export const Button: React.FC<ButtonProps> = ({ onClick, label }) => {
  return (
    <div>
      <div className="mt-8 sm:mt-10">
        <button
          onClick={onClick} 
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-500 hover:bg-teal-700"
        >
          {label}
        </button>
      </div>
    </div>
  );
};
