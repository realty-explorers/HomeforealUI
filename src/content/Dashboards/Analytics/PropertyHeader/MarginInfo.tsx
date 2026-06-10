import { useSelector } from 'react-redux';
import CountUp from 'react-countup';
import { LineChart, Crown, type LucideIcon } from 'lucide-react';
import { selectSaleCalculatedProperty } from '@/store/slices/propertiesSlice';
import { selectExpenses } from '@/store/slices/expensesSlice';
import {
  calculateArvPercentage,
  calculateMarginPercentage
} from '@/utils/calculationUtils';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Theme = {
  accentBar: string;
  iconColor: string;
  chipBg: string;
  chipBorder: string;
  chipLabel: string;
  chipValue: string;
};

const purpleTheme: Theme = {
  accentBar: 'bg-secondary',
  iconColor: 'text-secondary',
  chipBg: 'bg-purple-50',
  chipBorder: 'border-purple-100',
  chipLabel: 'text-purple-600',
  chipValue: 'text-purple-900'
};

const greenTheme: Theme = {
  accentBar: 'bg-arv',
  iconColor: 'text-arv',
  chipBg: 'bg-emerald-50',
  chipBorder: 'border-emerald-100',
  chipLabel: 'text-emerald-600',
  chipValue: 'text-emerald-900'
};

const StatChip = ({
  label,
  value,
  theme
}: {
  label: string;
  value: number;
  theme: Theme;
}) => (
  <div
    className={cn(
      'rounded-lg border px-2.5 py-1.5',
      theme.chipBg,
      theme.chipBorder
    )}
  >
    <div
      className={cn(
        'text-[0.55rem] uppercase tracking-wider font-semibold',
        theme.chipLabel
      )}
    >
      {label}
    </div>
    <div
      className={cn(
        'font-poppins font-bold text-base leading-tight',
        theme.chipValue
      )}
    >
      <CountUp end={value} duration={2} decimals={0} />%
    </div>
  </div>
);

const MarginCard = ({
  icon: Icon,
  name,
  amount,
  percent,
  margin,
  theme
}: {
  icon: LucideIcon;
  name: string;
  amount: number;
  percent: number;
  margin: number;
  theme: Theme;
}) => (
  <Card className="flex-1 relative overflow-hidden border-slate-200 shadow-sm">
    <div className={cn('absolute inset-y-0 left-0 w-1', theme.accentBar)} />
    <div className="pl-5 pr-4 py-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className={cn('size-3.5', theme.iconColor)} />
        <span className="text-[0.65rem] uppercase tracking-wider font-semibold text-slate-500">
          {name}
        </span>
      </div>
      <div className="font-poppins font-bold text-2xl text-slate-900 leading-tight">
        $
        <CountUp end={amount} duration={2} separator="," />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <StatChip label="Under price" value={percent} theme={theme} />
        <StatChip label="Net margin" value={margin} theme={theme} />
      </div>
    </div>
  </Card>
);

type MarginInfoProps = {};
const MarginInfo = (_: MarginInfoProps) => {
  const saleCalculatedProperty = useSelector(selectSaleCalculatedProperty);
  const { initialInvestment, financingCosts } = useSelector(selectExpenses);
  const totalExpenses = initialInvestment + financingCosts;
  const soldComps = saleCalculatedProperty?.comps?.filter(
    (comp) => comp.status === 'sold' || comp.status === 'off_market'
  );
  if (!soldComps || soldComps.length === 0) {
    return null;
  }

  const salePrice = saleCalculatedProperty?.price ?? 0;
  const arvSale = saleCalculatedProperty?.arvPrice ?? 0;
  const arv25 = saleCalculatedProperty?.arv25Price ?? 0;

  return (
    <div className="flex flex-col md:flex-row gap-3 mt-4 md:sticky top-0 z-[2] bg-off-white pb-4 px-4">
      <MarginCard
        icon={LineChart}
        name="Sale Comparable"
        amount={arvSale}
        percent={Number(calculateArvPercentage(arvSale, salePrice).toFixed())}
        margin={Number(
          calculateMarginPercentage(arvSale, salePrice, totalExpenses).toFixed()
        )}
        theme={purpleTheme}
      />
      <MarginCard
        icon={Crown}
        name="Top 25th ARV"
        amount={arv25}
        percent={Number(calculateArvPercentage(arv25, salePrice).toFixed())}
        margin={Number(
          calculateMarginPercentage(arv25, salePrice, totalExpenses).toFixed()
        )}
        theme={greenTheme}
      />
    </div>
  );
};

export default MarginInfo;
