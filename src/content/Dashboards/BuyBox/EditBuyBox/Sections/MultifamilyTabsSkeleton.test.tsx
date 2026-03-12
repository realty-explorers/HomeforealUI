import MultifamilyTabsSkeleton from './MultifamilyTabsSkeleton';
import {
  BuyBoxFormData,
  getDefaultBuyBoxFormData
} from '@/schemas/BuyBoxFormSchema';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';

const criteriaTabs = [
  'BuyBox Filters',
  'Strategy',
  'Quality Gates'
];

const setupTabs = ['Underwriting Assumptions', 'Stress Testing'];

const CriteriaHarness = () => {
  const methods = useForm<BuyBoxFormData>({
    defaultValues: getDefaultBuyBoxFormData()
  });

  return (
    <FormProvider {...methods}>
      <MultifamilyTabsSkeleton
        title="BuyBox Filters"
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
        title="Underwriting Assumptions"
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
      await screen.findByText(
        /optional shows all deals\. preferred boosts deals that include the document\. required hides deals missing the document\./i
      )
    ).toBeInTheDocument();
  });

  it('supports unit mix add/remove behavior with minimum one row protection', async () => {
    render(<CriteriaHarness />);

    fireEvent.click(screen.getByRole('button', { name: /advanced mode/i }));
    fireEvent.click(screen.getByRole('button', { name: /^enabled$/i }));

    const addButton = screen.getByRole('button', { name: /add unit type/i });
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.queryAllByLabelText(/unit type/i).length).toBeGreaterThanOrEqual(2);
    });

    let removeButtons = screen.getAllByRole('button', { name: /remove/i });

    while (removeButtons.length > 1) {
      fireEvent.click(removeButtons[0]);
      removeButtons = screen.getAllByRole('button', { name: /remove/i });
    }

    expect(removeButtons[0]).toBeDisabled();
  });

  it('retains unit mix value when switching tabs', async () => {
    render(<CriteriaHarness />);

    fireEvent.click(screen.getByRole('button', { name: /advanced mode/i }));
    fireEvent.click(screen.getByRole('button', { name: /^enabled$/i }));

    const unitTypeInput = (await screen.findByLabelText(/unit type/i)) as HTMLInputElement;

    fireEvent.change(unitTypeInput, { target: { value: '2BR / 1BA' } });
    fireEvent.click(screen.getByRole('tab', { name: /2\. strategy/i }));
    fireEvent.click(
      screen.getByRole('tab', { name: /1\. buybox filters/i })
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
    fireEvent.click(screen.getByRole('button', { name: /advanced mode/i }));
    fireEvent.click(screen.getByRole('button', { name: /show advanced strategy/i }));

    const weightSlider = await screen.findByRole('slider', {
      name: /discount weight/i
    });

    fireEvent.change(weightSlider, { target: { value: 55 } });

    await waitFor(() => {
      expect(screen.getByText(/^custom$/i)).toBeInTheDocument();
    });
  });

  it('applies stress presets and locks/unlocks manual editing', async () => {
    render(<SetupHarness />);

    fireEvent.click(screen.getByRole('tab', { name: /2\. stress testing/i }));

    const vacancyInput = (await screen.findByLabelText(
      /^vacancy shock percent$/i
    )) as HTMLInputElement;

    expect(vacancyInput.readOnly).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: /conservative/i }));

    await waitFor(() => {
      expect(vacancyInput).toHaveValue(5);
      expect(vacancyInput.readOnly).toBe(true);
    });

    expect(screen.getByRole('button', { name: /^custom$/i })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /advanced mode/i }));
    fireEvent.click(screen.getByRole('button', { name: /^custom$/i }));

    await waitFor(() => {
      expect(vacancyInput.readOnly).toBe(false);
    });
  });
});
