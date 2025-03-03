import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PremiumCardProps {
  id: string;
  title: string;
  className?: string;
}

const PremiumCard = ({ id, title, className }: PremiumCardProps) => {
  return (
    <div className="group perspective">
      <Card
        className={cn(
          'relative overflow-hidden backdrop-blur-sm bg-white bg-opacity-90 rounded-xl border border-purple-100',
          'shadow-[0_10px_30px_-10px_rgba(107,33,168,0.15),_0_4px_6px_-2px_rgba(107,33,168,0.05)]',
          'hover:shadow-[0_20px_30px_-15px_rgba(107,33,168,0.2),_0_10px_10px_-5px_rgba(107,33,168,0.1)]',
          'hover:translate-y-[-5px] transition-all duration-500',
          "before:content-[''] before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500",
          'before:bg-gradient-to-r before:from-white/10 before:to-transparent before:pointer-events-none',
          'hover:before:opacity-100',
          'transform-gpu transform-style-preserve-3d',
          className
        )}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/30 to-transparent bg-[length:200%_100%] animate-[shimmer_3s_infinite] shimmer-animation" />

        <CardHeader className="relative overflow-hidden z-10 bg-gradient-to-r from-[rgba(128,90,213,0.9)] to-[rgba(157,35,195,0.9)] text-white rounded-t-xl px-6 py-4 flex flex-row items-center gap-2 after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-r after:from-purple-500/10 after:to-fuchsia-500/10 after:pointer-events-none after:z-[-1]">
          <div className="h-3 w-3 rounded-full bg-white/70 animate-pulse" />
          <CardTitle className="text-xl font-medium tracking-tight">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <p className="text-purple-900/60 text-sm font-medium uppercase tracking-wider">
              Analysis ID
            </p>
            <div className="animate-[subtle-float_6s_ease-in-out_infinite]">
              <Badge
                variant="outline"
                className="bg-white/80 backdrop-blur-sm text-purple-900 font-medium px-4 py-2 rounded-md
                          border border-purple-200 shadow-sm
                          transition-all duration-300 ease-in-out hover:translate-y-[-2px]
                          hover:bg-purple-50 hover:border-purple-300"
              >
                {id}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumCard;
