import MultifamilyTabsSkeleton from './MultifamilyTabsSkeleton';
import {
  BuyBoxFormData,
  getDefaultBuyBoxFormData
} from '@/schemas/BuyBoxFormSchema';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';

const criteriaTabs = [
  'Asset Filters',
  'Unit Mix Preferences',
  'Deal Quality Gates',
  'Ranking Weights'
];

const setupTabs = [
  'Income Defaults',
  'Expense Defaults',
  'Utilities Defaults',
  'Taxes and Insurance Defaults',
  'Financing Defaults',
  'Stress Test Presets'
];

const CriteriaHarness = () => {
  const methods = useForm<BuyBoxFormData>({
    defaultValues: getDefaultBuyBoxFormData()
  });

  return (
    <FormProvider {...methods}>
      <MultifamilyTabsSkeleton
        title="Multifamily Discovery"
        description="Discovery test"
        tabs={criteriaTabs}
        mode="criteria"
      />
    </FormProvider>
  );
};

const SetupHarness = () => {
  const methods = useForm<BuyBoxFormData>({
    defaultValues: getDefaultBuyBoxFormData()
  });

  return (
    <FormProvider {...methods}>
      <MultifamilyTabsSkeleton
        title="Multifamily Defaults"
        description="Defaults test"
        tabs={setupTabs}
        mode="setup"
      />
    </FormProvider>
  );
};

describe('MultifamilyTabsSkeleton', () => {
  it('renders discovery tabs and switches to Unit Mix Preferences tab content', async () => {
    render(<CriteriaHarness />);

    fireEvent.click(
      screen.getByRole('tab', { name: /2\. unit mix preferences/i })
    );

    expect(await screen.findByLabelText(/unit type/i)).toBeInTheDocument();
  });

  it('supports unit mix add/remove behavior with minimum one row protection', async () => {
    render(<CriteriaHarness />);

    fireEvent.click(
      screen.getByRole('tab', { name: /2\. unit mix preferences/i })
    );

    await waitFor(() => {
      expect(screen.getAllByLabelText(/unit type/i)).toHaveLength(1);
    });

    const addButton = screen.getByRole('button', { name: /add unit type/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getAllByLabelText(/unit type/i)).toHaveLength(2);
    });

    fireEvent.click(screen.getAllByRole('button', { name: /remove/i })[0]);

    await waitFor(() => {
      expect(screen.getAllByLabelText(/unit type/i)).toHaveLength(1);
    });

    expect(screen.getByRole('button', { name: /remove/i })).toBeDisabled();
  });

  it('retains unit mix value when switching tabs', async () => {
    render(<CriteriaHarness />);

    fireEvent.click(
      screen.getByRole('tab', { name: /2\. unit mix preferences/i })
    );

    const unitTypeInput = (await screen.findByLabelText(/unit type/i)) as HTMLInputElement;

    fireEvent.change(unitTypeInput, { target: { value: '2BR / 1BA' } });
    fireEvent.click(screen.getByRole('tab', { name: /1\. asset filters/i }));
    fireEvent.click(
      screen.getByRole('tab', { name: /2\. unit mix preferences/i })
    );

    expect(screen.getByLabelText(/unit type/i)).toHaveValue('2BR / 1BA');
  });

  it('shows ranking total and auto-normalizes weights to 100', async () => {
    render(<CriteriaHarness />);

    fireEvent.click(screen.getByRole('tab', { name: /4\. ranking weights/i }));

    expect(screen.getByTestId('ranking-weight-total')).toHaveTextContent(
      'Total weight: 415.00 / 100'
    );

    fireEvent.click(screen.getByRole('button', { name: /auto normalize to 100/i }));

    await waitFor(() => {
      expect(screen.getByTestId('ranking-weight-total')).toHaveTextContent(
        'Total weight: 100.00 / 100'
      );
    });
  });

  it('auto-normalizes while dragging a ranking slider when total exceeds 100', async () => {
    render(<CriteriaHarness />);

    fireEvent.click(screen.getByRole('tab', { name: /4\. ranking weights/i }));

    const bedsSlider = await screen.findByRole('slider', {
      name: /beds relevance weight/i
    });

    fireEvent.change(bedsSlider, { target: { value: 80 } });

    await waitFor(() => {
      expect(screen.getByTestId('ranking-weight-total')).toHaveTextContent(
        'Total weight: 100.00 / 100'
      );
    });
  });

  it('applies stress presets and locks/unlocks manual editing', async () => {
    render(<SetupHarness />);

    fireEvent.click(screen.getByRole('tab', { name: /6\. stress test presets/i }));

    const vacancyInput = (await screen.findByLabelText(
      /stress test vacancy \(%\)/i
    )) as HTMLInputElement;

    expect(vacancyInput.readOnly).toBe(false);

    fireEvent.click(screen.getByRole('button', { name: /conservative/i }));

    await waitFor(() => {
      expect(vacancyInput).toHaveValue(12);
      expect(vacancyInput.readOnly).toBe(true);
    });

    fireEvent.click(screen.getByRole('button', { name: /^custom$/i }));

    await waitFor(() => {
      expect(vacancyInput.readOnly).toBe(false);
    });
  });
});
