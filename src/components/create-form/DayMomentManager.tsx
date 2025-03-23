'use client';

import React, { useState, useEffect } from 'react';
import { DayMoment } from '@/app/create/types';
import { Reorder } from 'motion/react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/Button';
import DayMomentItem from './DayMomentItem';

interface DayMomentManagerProps {
  moments: DayMoment[];
  onChange: (moments: DayMoment[]) => void;
}

export default function DayMomentManager({ moments, onChange }: DayMomentManagerProps) {
  const [items, setItems] = useState<DayMoment[]>(moments);

  // Update local state when props change
  useEffect(() => {
    setItems(moments);
  }, [moments]);

  // Handle reorder - this updates local state and calls the parent onChange
  const handleReorder = (newItems: DayMoment[]) => {
    setItems(newItems);
    onChange(newItems);
  };

  // Handle percentage change
  const handlePercentageChange = (id: string, value: number) => {
    // Ensure value is between 1 and 100
    const clampedValue = Math.max(1, Math.min(100, value));

    // Create a new array with the updated item
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, dayPercentage: clampedValue } : item
    );

    // Normalize percentages to ensure they sum to 100
    const total = updatedItems.reduce((sum, item) => sum + item.dayPercentage, 0);

    if (total !== 100) {
      // Distribute the difference proportionally
      const diff = 100 - total;
      const otherItems = updatedItems.filter(item => item.id !== id);

      if (otherItems.length > 0) {
        const totalOthers = otherItems.reduce((sum, item) => sum + item.dayPercentage, 0);

        // Only adjust if there are other items with non-zero percentages
        if (totalOthers > 0) {
          const updatedWithNormalized = updatedItems.map(item => {
            if (item.id === id) return item;

            // Distribute the difference proportionally
            const adjustmentFactor = item.dayPercentage / totalOthers;
            const adjustment = diff * adjustmentFactor;
            const newPercentage = Math.max(1, Math.round(item.dayPercentage + adjustment));

            return { ...item, dayPercentage: newPercentage };
          });

          setItems(updatedWithNormalized);
          onChange(updatedWithNormalized);
          return;
        }
      }
    }

    setItems(updatedItems);
    onChange(updatedItems);
  };

  // Add a new moment
  const addMoment = () => {
    // Calculate default percentage: if we have 2 items with 50% each, a new one should be 33%
    const defaultPercentage = Math.max(1, Math.floor(100 / (items.length + 1)));

    // Distribute remaining percentage from existing items
    const remaining = 100 - defaultPercentage;
    const updatedItems = items.map(item => ({
      ...item,
      dayPercentage: Math.floor(item.dayPercentage * remaining / 100)
    }));

    // Ensure the sum is 100% (handle rounding errors)
    const currentSum = updatedItems.reduce((sum, item) => sum + item.dayPercentage, 0) + defaultPercentage;

    if (currentSum < 100) {
      // Add the difference to the last item
      const lastIndex = updatedItems.length - 1;
      if (lastIndex >= 0) {
        updatedItems[lastIndex].dayPercentage += (100 - currentSum);
      }
    }

    // Create new item
    const newItem: DayMoment = {
      id: `moment-${uuidv4()}`,
      label: '📅', // Default emoji
      dayPercentage: defaultPercentage
    };

    const newItems = [...updatedItems, newItem];
    setItems(newItems);
    onChange(newItems);
  };

  // Remove a moment
  const removeMoment = (id: string) => {
    // Don't allow removing if only one item remains
    if (items.length <= 1) return;

    // Get the percentage of the removed item
    const removedItem = items.find(item => item.id === id);
    if (!removedItem) return;

    const removedPercentage = removedItem.dayPercentage;

    // Distribute the removed percentage proportionally among remaining items
    const remainingItems = items.filter(item => item.id !== id);
    const totalRemainingPercentage = remainingItems.reduce((sum, item) => sum + item.dayPercentage, 0);

    const updatedItems = remainingItems.map(item => {
      const proportionOfRemaining = item.dayPercentage / totalRemainingPercentage;
      const newPercentage = Math.round(item.dayPercentage + (removedPercentage * proportionOfRemaining));
      return { ...item, dayPercentage: newPercentage };
    });

    // Ensure the sum is 100% (handle rounding errors)
    const currentSum = updatedItems.reduce((sum, item) => sum + item.dayPercentage, 0);

    if (currentSum !== 100 && updatedItems.length > 0) {
      // Add the difference to the last item
      const lastIndex = updatedItems.length - 1;
      updatedItems[lastIndex].dayPercentage += (100 - currentSum);
    }

    setItems(updatedItems);
    onChange(updatedItems);
  };

  // Handle label change from DayMomentItem
  const handleLabelChange = (id: string, label: string) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, label } : item
    );
    setItems(updatedItems);
    onChange(updatedItems);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Personnaliser les moments de la journée</h4>

      <div className="rounded-md p-4 bg-gray-50 space-y-4 touch-none">
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={handleReorder}
          className="space-y-2 touch-none"
        >
          {items.map((item) => (
            <DayMomentItem
              key={item.id}
              item={item}
              onLabelChange={handleLabelChange}
              onPercentageChange={handlePercentageChange}
              onRemove={removeMoment}
              disabled={items.length <= 1}
            />
          ))}
        </Reorder.Group>
        <Button
          onClick={addMoment}
          variant="text"
          size="sm"
          className="text-xs w-full"
        >
          Ajouter un moment
        </Button>
      </div>
    </div>
  );
}