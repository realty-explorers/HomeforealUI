import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Sparkles, Dices, Save, RotateCw } from 'lucide-react';
import WeightSlider from './WeightSlider';
import WeightPresets from './WeightPresets';
import {
  DEFAULT_ATTRIBUTES,
  PropertyWeights,
  PropertyAttribute
} from '@/utils/propertyUtils';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';

const Index = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { control, watch, reset } = useFormContext();

  const handleResetWeights = () => {
    const defaultWeights = DEFAULT_ATTRIBUTES.reduce((acc, attr) => {
      acc[attr.id] = attr.defaultWeight;
      return acc;
    }, {} as PropertyWeights);

    reset({ weights: defaultWeights });
    enqueueSnackbar('Weights have been reset to default values');
  };

  // Apply a preset of weights
  const handleApplyPreset = (presetWeights: PropertyWeights) => {
    reset({ weights: presetWeights });
    enqueueSnackbar('Preset weights have been applied');
  };

  // Randomize weights for fun
  const handleRandomizeWeights = () => {
    const randomWeights = DEFAULT_ATTRIBUTES.reduce((acc, attr) => {
      acc[attr.id] = Math.floor(Math.random() * 100);
      return acc;
    }, {} as PropertyWeights);

    reset({ weights: randomWeights });
    // enqueueSnackbar('Weights randomized! Let\'s see what happens!', {
    //   icon: <Sparkles className="h-5 w-5 text-yellow-400" />
    // });
    // toast("Weights randomized! Let's see what happens!", {
    //   icon: <Sparkles className="h-5 w-5 text-yellow-400" />
    // });
  };

  return (
    <div className="w-full h-full">
      <div className="container px-4 py-6 sm:px-6 sm:py-12 max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-10 animate-fade-in">
          <div className="inline-block p-1.5 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500 mb-6 animate-pulse-subtle">
            <div className="bg-white rounded-full p-3">
              <Sparkles className="h-8 w-8 text-violet-500" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold purple-gradient-text mb-3">
            Property Comparison Weights
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            Customize how each property attribute influences your comparison
            results
          </p>
        </header>

        {/* Main Content - Just the Weights */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-violet-200/50 shadow-xl shadow-violet-200/30 animate-fade-in">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Attribute Weights
            </h2>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRandomizeWeights}
                className="bg-gradient-to-r from-violet-100 to-fuchsia-100 border-violet-200 hover:border-violet-300 hover:from-violet-200 hover:to-fuchsia-200 text-violet-700"
              >
                <Dices className="h-4 w-4 mr-1.5" />
                Randomize
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetWeights}
                className="border-primary-light/30 bg-white hover:bg-primary-light/10 hover:border-primary-light/50 text-primary-dark h-9"
              >
                <RotateCw className="h-4 w-4 mr-1.5" />
                Reset
              </Button>
              <WeightPresets onApplyPreset={handleApplyPreset} />
            </div>
          </div>

          <Separator className="my-6 bg-violet-200/50" />

          <div className="grid gap-y-8 relative z-10">
            {DEFAULT_ATTRIBUTES.map((attr: PropertyAttribute, index) => (
              <div
                key={attr.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <WeightSlider
                  id={attr.id}
                  name={attr.name}
                  description={attr.description}
                  unit={attr.unit}
                />
              </div>
            ))}
          </div>

          {/* Decorative Elements */}
          {/* <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gradient-to-r from-fuchsia-400/10 to-violet-500/20 rounded-full blur-3xl -z-10" /> */}
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-r from-violet-400/10 to-fuchsia-400/10 rounded-full blur-3xl -z-10" />
        </div>
      </div>
    </div>
  );
};

export default Index;
