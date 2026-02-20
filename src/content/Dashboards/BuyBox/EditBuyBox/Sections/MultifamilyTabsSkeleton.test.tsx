import MultifamilyTabsSkeleton from './MultifamilyTabsSkeleton';
import {
  BuyBoxFormData,
  getDefaultBuyBoxFormData
} from '@/schemas/BuyBoxFormSchema';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';

const criteriaTabs = [
  'Unit Mix',
  'Rent Roll',
  'Income Assumptions',
  'Expense Assumptions',
  'Utilities'
];

const CriteriaHarness = () => {
  const methods = useForm<BuyBoxFormData>({
    defaultValues: getDefaultBuyBoxFormData()
  });

  return (
    <FormProvider {...methods}>
      <MultifamilyTabsSkeleton
        title="Multifamily Criteria"
        description="Criteria test"
        tabs={criteriaTabs}
        mode="criteria"
      />
    </FormProvider>
  );
};

describe('MultifamilyTabsSkeleton', () => {
  it('renders criteria tabs and switches to Rent Roll tab content', async () => {
    render(<CriteriaHarness />);

    fireEvent.click(screen.getByRole('tab', { name: /2\. rent roll/i }));

    expect(await screen.findByLabelText(/physical occupancy \(%\)/i)).toBeInTheDocument();
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
    fireEvent.click(screen.getByRole('tab', { name: /2\. rent roll/i }));
    fireEvent.click(screen.getByRole('tab', { name: /1\. unit mix/i }));

    expect(screen.getByLabelText(/unit type/i)).toHaveValue('2BR / 1BA');
  });
});
