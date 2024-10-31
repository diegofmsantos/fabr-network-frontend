import React from 'react';

type Props = {
    label: string;
    borderColor: string | undefined
    isSelected: boolean;
    onClick: () => void;
};

export const ButtonSetor = ({ label, borderColor, isSelected, onClick }: Props) => {
    return (
        <div
            className={`px-3 font-extrabold italic text-3xl leading-[35px] tracking-[-2px] cursor-pointer xl:text-4xl ${isSelected ? 'border-b-4' : ''
                }`}
            style={{ borderBottomColor: isSelected ? borderColor : 'transparent' }}
            onClick={onClick}
        >
            {label}
        </div>
    );
};
