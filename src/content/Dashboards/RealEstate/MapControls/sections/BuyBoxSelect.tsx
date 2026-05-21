import { Check, ChevronDown, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import BuyBox from '@/models/buybox';
import {
  getBuyboxDisplayName,
  isMultifamilyBuyBoxValue
} from '../utils/buybox';

type BuyBoxSelectProps = {
  buyboxes?: BuyBox[];
  selectedId: string;
  loading?: boolean;
  onChange: (nextId: string) => void;
};

const BuyBoxSelect = ({
  buyboxes,
  selectedId,
  loading,
  onChange
}: BuyBoxSelectProps) => {
  const selected = buyboxes?.find((b) => b.id === selectedId);
  const triggerLabel = loading
    ? 'Loading…'
    : selected
    ? getBuyboxDisplayName(selected) +
      (isMultifamilyBuyBoxValue(selected) ? ' • Multifamily' : '')
    : 'Choose BuyBox';

  return (
    <div className="mb-3 flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
        BuyBox
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            disabled={loading || !buyboxes?.length}
            className={cn(
              'inline-flex h-9 w-full items-center justify-between gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors',
              'hover:border-primary/40 focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20',
              'data-[state=open]:border-primary/60 data-[state=open]:ring-2 data-[state=open]:ring-primary/20',
              'disabled:cursor-not-allowed disabled:opacity-60'
            )}
          >
            <span className="truncate text-left">{triggerLabel}</span>
            {loading ? (
              <Loader2 className="size-4 shrink-0 animate-spin text-zinc-400" />
            ) : (
              <ChevronDown className="size-4 shrink-0 text-zinc-400" />
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          // Match the trigger width so the menu doesn't pop wider than
          // the select and look detached.
          className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-72 overflow-y-auto"
        >
          {buyboxes?.map((buyBoxItem) => {
            const isSelected = buyBoxItem.id === selectedId;
            const isMultifamily = isMultifamilyBuyBoxValue(buyBoxItem);
            return (
              <DropdownMenuItem
                key={buyBoxItem.id}
                onSelect={() => onChange(buyBoxItem.id)}
                className="flex items-center gap-2 pr-2"
              >
                <Check
                  className={cn(
                    'size-3.5 shrink-0',
                    isSelected ? 'text-primary' : 'text-transparent'
                  )}
                />
                <span className="flex-1 truncate text-sm">
                  {getBuyboxDisplayName(buyBoxItem)}
                </span>
                {isMultifamily && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    Multifamily
                  </span>
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default BuyBoxSelect;
