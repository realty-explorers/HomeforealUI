import InvestmentStrategy from './InvestmentStrategy';
import {
  BuyBoxFormData,
  getDefaultBuyBoxFormData
} from '@/schemas/BuyBoxFormSchema';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import userEvent from '@testing-library/user-event';

jest.mock('./InvestmentTypes/FixAndFlip', () => {
  return function FixAndFlipMock() {
    return <div data-testid="fix-and-flip-panel">Fix and Flip Panel</div>;
  };
});

jest.mock('./InvestmentTypes/BuyAndHold', () => {
  return function BuyAndHoldMock() {
    return <div data-testid="buy-and-hold-panel">Buy and Hold Panel</div>;
  };
});

const InvestmentStrategyHarness = () => {
  const methods = useForm<BuyBoxFormData>({
    defaultValues: getDefaultBuyBoxFormData()
  });

  return (
    <FormProvider {...methods}>
      <InvestmentStrategy
        register={methods.register}
        control={methods.control}
        watch={methods.watch}
        setValue={methods.setValue}
        getValues={methods.getValues}
        errors={methods.formState.errors}
      />
    </FormProvider>
  );
};

describe('InvestmentStrategy', () => {
  it('shows Fix and Flip by default and switches to Multifamily', async () => {
    const user = userEvent.setup();

    render(<InvestmentStrategyHarness />);

    expect(screen.getByTestId('fix-and-flip-panel')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /multifamily/i }));

    expect(
      screen.getByText(/choose what kind of deals should rise to the top\./i)
    ).toBeInTheDocument();
    expect(screen.queryByTestId('fix-and-flip-panel')).not.toBeInTheDocument();
  });

  it('keeps coming-soon strategies disabled', () => {
    render(<InvestmentStrategyHarness />);

    expect(screen.getByRole('button', { name: /buy and hold/i })).toBeDisabled();
    expect(screen.getByTestId('fix-and-flip-panel')).toBeInTheDocument();
  });
});
