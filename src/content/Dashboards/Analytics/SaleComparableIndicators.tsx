import { useSelector } from 'react-redux';
import { ArrowDown, LineChart, Crown } from 'lucide-react';
import AnalyzedProperty from '@/models/analyzedProperty';
import { priceFormatter } from '@/utils/converters';
import { selectProperties } from '@/store/slices/propertiesSlice';
import { selectExpenses } from '@/store/slices/expensesSlice';
import {
  calculateArvPercentage,
  calculateMarginPercentage
} from '@/utils/calculationUtils';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type SaleComparableIndicatorsProps = {
  property: AnalyzedProperty;
};

type IndicatorRowProps = {
  icon: typeof LineChart;
  label: string;
  amount: number;
  underPercent: number;
  marginPercent: number;
  trackClass: string; // tailwind class for track + indicator color
  accentText: string;
};

const IndicatorRow = ({
  icon: Icon,
  label,
  amount,
  underPercent,
  marginPercent,
  trackClass,
  accentText
}: IndicatorRowProps) => {
  const safeUnder = Math.max(0, Math.min(100, underPercent || 0));
  return (
    <div className="flex flex-col w-full gap-1">
      <div className="flex items-center gap-2 flex-wrap font-poppins text-xs">
        <Icon className={cn('size-3.5', accentText)} />
        <span className="font-semibold text-slate-700 uppercase tracking-wider text-[0.65rem]">
          {label}
        </span>
        <span className="font-bold text-slate-900">
          {priceFormatter(amount?.toFixed())}
        </span>
        <span className="text-slate-300">●</span>
        <span className={cn('font-semibold', accentText)}>
          Margin {marginPercent.toFixed()}%
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Progress value={safeUnder} className={trackClass} />
        <span
          className={cn(
            'inline-flex items-center gap-0.5 font-poppins font-semibold text-xs whitespace-nowrap',
            accentText
          )}
        >
          <ArrowDown className="size-3.5" />
          {underPercent.toFixed()}%
        </span>
      </div>
    </div>
  );
};

const SaleComparableIndicators = (props: SaleComparableIndicatorsProps) => {
  const { saleCalculatedProperty } = useSelector(selectProperties);
  const { initialInvestment, financingCosts } = useSelector(selectExpenses);
  const totalExpenses = initialInvestment + financingCosts;

  const hasSoldComps =
    (saleCalculatedProperty?.comps?.filter((comp) => comp.type === 'sold')
      ?.length ?? 0) > 0;
  if (!hasSoldComps) return null;

  const arvSale = saleCalculatedProperty?.arvPrice ?? 0;
  const arv25 = saleCalculatedProperty?.arv25Price ?? 0;
  const salePrice = saleCalculatedProperty?.price ?? 0;

  return (
    <div className="flex flex-col md:flex-row w-full gap-4 px-4 py-3 sticky top-0 z-[2] bg-off-white shadow-sm">
      <IndicatorRow
        icon={LineChart}
        label="Sales Comps"
        amount={arvSale}
        underPercent={calculateArvPercentage(arvSale, salePrice, totalExpenses)}
        marginPercent={calculateMarginPercentage(
          arvSale,
          salePrice,
          totalExpenses
        )}
        trackClass="bg-purple-100 [&>div]:bg-secondary"
        accentText="text-secondary"
      />
      <IndicatorRow
        icon={Crown}
        label="25th ARV"
        amount={arv25}
        underPercent={calculateArvPercentage(arv25, salePrice, totalExpenses)}
        marginPercent={calculateMarginPercentage(
          arv25,
          salePrice,
          totalExpenses
        )}
        trackClass="bg-emerald-100 [&>div]:bg-arv"
        accentText="text-emerald-700"
      />
    </div>
  );
};

export default SaleComparableIndicators;
