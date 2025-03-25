'use client';

import React, { useState } from 'react';
import { Reorder, useDragControls } from 'motion/react';
import { DayMoment } from '@/app/create/types';
import { cn } from '@/lib/utils/cn';

interface DayMomentItemProps {
  item: DayMoment;
  onLabelChange: (id: string, label: string) => void;
  onPercentageChange: (id: string, value: number) => void;
  onRemove: (id: string) => void;
  disabled: boolean;
}

export default function DayMomentItem({
  item,
  onLabelChange,
  onPercentageChange,
  onRemove,
  disabled
}: DayMomentItemProps) {
  const [editingLabel, setEditingLabel] = useState(false);
  const [labelValue, setLabelValue] = useState(item.label);
  const [editingPercentage, setEditingPercentage] = useState(false);
  const [percentageValue, setPercentageValue] = useState(item.dayPercentage.toString());

  const controls = useDragControls();

  // Save edited label
  const saveLabel = () => {
    onLabelChange(item.id, labelValue || '📅');
    setEditingLabel(false);
  };

  // Start editing label
  const startEditingLabel = () => {
    setLabelValue(item.label);
    setEditingLabel(true);
  };

  // Save edited percentage
  const savePercentage = () => {
    const value = parseInt(percentageValue);
    if (!isNaN(value)) {
      onPercentageChange(item.id, value);
    }
    setEditingPercentage(false);
  };

  // Start editing percentage
  const startEditingPercentage = () => {
    setPercentageValue(item.dayPercentage.toString());
    setEditingPercentage(true);
  };

  return (
    <Reorder.Item
      key={item.id}
      value={item}
      className="group select-none touch-none"
      dragListener={false}
      dragControls={controls}
    >
      <div className="bg-zinc-800 rounded-md border border-zinc-500 p-3 flex items-center gap-2 relative touch-none">
        {/* Drag handle */}
        <button
          key={`${item.id}-drag-handle`}
          id={`${item.id}-drag-handle`}
          className="cursor-move flex items-center justify-center touch-none"
          onPointerDown={(e) => {
            controls.start(e);
            e.stopPropagation();
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>
            <circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
          </svg>
        </button>

        {/* Label editing */}
        {editingLabel ? (
          <div className="flex-grow">
            <input
              type="text"
              value={labelValue}
              onChange={(e) => setLabelValue(e.target.value)}
              onBlur={saveLabel}
              onKeyDown={(e) => e.key === 'Enter' && saveLabel()}
              autoFocus
              className="w-full p-1 border rounded"
              maxLength={2}
            />
          </div>
        ) : (
          <button
            onClick={startEditingLabel}
            className="text-xl focus:outline-none hover:bg-zinc-900 p-1 rounded"
          >
            {item.label}
          </button>
        )}

        {/* Percentage slider */}
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1"
              max="100"
              value={item.dayPercentage}
              onChange={(e) => onPercentageChange(item.id, parseInt(e.target.value))}
              className="w-full"
            />

            {/* Percentage value (clickable to edit) */}
            {editingPercentage ? (
              <div className="w-16">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={percentageValue}
                  onChange={(e) => setPercentageValue(e.target.value)}
                  onBlur={savePercentage}
                  onKeyDown={(e) => e.key === 'Enter' && savePercentage()}
                  autoFocus
                  className="w-full p-1 border rounded text-sm"
                />
              </div>
            ) : (
              <button
                onClick={startEditingPercentage}
                className="text-sm w-12 text-right hover:bg-zinc-900 rounded px-1"
              >
                {item.dayPercentage}%
              </button>
            )}
          </div>
        </div>

        {/* Remove button */}
        <button
          onClick={() => onRemove(item.id)}
          className={cn(
            "p-1 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-red-500 transition-colors",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled}
          aria-label="Supprimer ce moment"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    </Reorder.Item>
  );
}