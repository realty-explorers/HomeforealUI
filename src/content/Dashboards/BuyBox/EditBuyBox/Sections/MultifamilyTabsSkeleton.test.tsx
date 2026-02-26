import MultifamilyTabsSkeleton from './MultifamilyTabsSkeleton';
import {
  BuyBoxFormData,
  getDefaultBuyBoxFormData
} from '@/schemas/BuyBoxFormSchema';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';

const criteriaTabs = [
  'Discovery',
  'Strategy',
  'Quality Gates'
];

const setupTabs = ['Defaults', 'Stress Test'];

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
  it('renders discovery tabs and switches to quality gates tab content', async () => {
    render(<CriteriaHarness />);

    fireEvent.click(
      screen.getByRole('tab', { name: /3\. quality gates/i })
    );

    expect(
      await screen.findByText(/set each doc preference as optional, preferred, or required/i)
    ).toBeInTheDocument();
  });

  it('supports unit mix add/remove behavior with minimum one row protection', async () => {
    render(<CriteriaHarness />);

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

    const unitTypeInput = (await screen.findByLabelText(/unit type/i)) as HTMLInputElement;

    fireEvent.change(unitTypeInput, { target: { value: '2BR / 1BA' } });
    fireEvent.click(screen.getByRole('tab', { name: /2\. strategy/i }));
    fireEvent.click(
      screen.getByRole('tab', { name: /1\. discovery/i })
    );

    expect(screen.getByLabelText(/unit type/i)).toHaveValue('2BR / 1BA');
  });

  it('shows ranking preset controls with balanced total by default', async () => {
    render(<CriteriaHarness />);

    fireEvent.click(screen.getByRole('tab', { name: /2\. strategy/i }));

    expect(screen.getByRole('button', { name: /balanced/i })).toBeInTheDocument();
    expect(screen.getByTestId('ranking-weight-total')).toHaveTextContent(
      'Total weight: 100.00 / 100'
    );
  });

  it('marks ranking preset as custom when advanced weight sliders are edited', async () => {
    render(<CriteriaHarness />);

    fireEvent.click(screen.getByRole('tab', { name: /2\. strategy/i }));
    fireEvent.click(screen.getByRole('button', { name: /show advanced strategy/i }));

    const weightSlider = await screen.findByRole('slider', {
      name: /discount weight/i
    });

    fireEvent.change(weightSlider, { target: { value: 55 } });

    await waitFor(() => {
      expect(screen.getByText(/custom/i)).toBeInTheDocument();
    });
  });

  it('applies stress presets and locks/unlocks manual editing', async () => {
    render(<SetupHarness />);

    fireEvent.click(screen.getByRole('tab', { name: /2\. stress test/i }));

    const vacancyInput = (await screen.findByLabelText(
      /stress test vacancy \(%\)/i
    )) as HTMLInputElement;

    expect(vacancyInput.readOnly).toBe(false);

    fireEvent.click(screen.getByRole('button', { name: /conservative/i }));

    await waitFor(() => {
      expect(vacancyInput).toHaveValue(5);
      expect(vacancyInput.readOnly).toBe(true);
    });

    fireEvent.click(screen.getByRole('button', { name: /^custom$/i }));

    await waitFor(() => {
      expect(vacancyInput.readOnly).toBe(false);
    });
  });
});
