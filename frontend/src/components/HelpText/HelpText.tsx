import React from 'react';
import { Tooltip } from '../Tooltip/Tooltip';

interface HelpTextProps {
  text: string;
  className?: string;
}

export const HelpText: React.FC<HelpTextProps> = ({ text, className = '' }) => {
  return (
    <Tooltip content={text}>
      <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-300 text-gray-600 text-xs cursor-help ${className}`}>
        ?
      </span>
    </Tooltip>
  );
};

