import MultifamilyTabsSkeleton from './MultifamilyTabsSkeleton';
import {
  BuyBoxFormData,
  getDefaultBuyBoxFormData
} from '@/schemas/BuyBoxFormSchema';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';

const criteriaTabs = [
  'Deal Filters',
  'Strategy',
  'Quality Gates'
];

const CriteriaHarness = () => {
  const methods = useForm<BuyBoxFormData>({
    defaultValues: getDefaultBuyBoxFormData()
  });

  return (
    <FormProvider {...methods}>
      <MultifamilyTabsSkeleton
        title="Deal Filters"
        description="Discovery test"
        tabs={criteriaTabs}
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

  it('renders live preview metrics for deal filters', async () => {
    render(<CriteriaHarness />);

    expect(await screen.findByText(/live preview/i)).toBeInTheDocument();
    expect(screen.getByText(/average yield/i)).toBeInTheDocument();
    expect(screen.getByText(/updated at/i)).toBeInTheDocument();
  });

  it('retains filter values when switching tabs', async () => {
    render(<CriteriaHarness />);

    const minNoiInput = (await screen.findByLabelText(
      /minimum noi per unit/i
    )) as HTMLInputElement;

    fireEvent.change(minNoiInput, { target: { value: 1200 } });
    fireEvent.click(screen.getByRole('tab', { name: /2\. strategy/i }));
    fireEvent.click(
      screen.getByRole('tab', { name: /1\. deal filters/i })
    );

    expect(screen.getByLabelText(/minimum noi per unit/i)).toHaveValue(1200);
  });

  it('does not render unit mix targeting controls', async () => {
    render(<CriteriaHarness />);

    expect(screen.queryByRole('button', { name: /^enabled$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /add unit type/i })).not.toBeInTheDocument();
  });

  it('does not render visibility mode selector and keeps strategy controls available', async () => {
    render(<CriteriaHarness />);

    fireEvent.click(screen.getByRole('tab', { name: /2\. strategy/i }));

    expect(screen.queryByText(/visibility mode/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /advanced mode/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show advanced strategy/i })).toBeInTheDocument();
  });

  it('shows ranking preset controls with balanced total by default', async () => {
    render(<CriteriaHarness />);

    fireEvent.click(screen.getByRole('tab', { name: /2\. strategy/i }));

    expect(screen.getByRole('button', { name: /balanced/i })).toBeInTheDocument();
    expect(screen.getByTestId('ranking-weight-total')).toHaveTextContent(
      'Total weight: 100.00 / 100'
    );
  });

  it('updates minimum projected outcome control when strategy preset changes', async () => {
    render(<CriteriaHarness />);

    fireEvent.click(screen.getByRole('tab', { name: /2\. strategy/i }));

    expect(await screen.findByLabelText(/minimum yield value/i)).toHaveValue(6);

    fireEvent.click(screen.getByRole('button', { name: /opportunistic/i }));
    expect(await screen.findByLabelText(/minimum irr value/i)).toHaveValue(14);

    fireEvent.click(screen.getByRole('button', { name: /cash flow/i }));
    expect(await screen.findByLabelText(/minimum cash yield value/i)).toHaveValue(7);
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
      expect(screen.getByText(/^custom$/i)).toBeInTheDocument();
    });
  });

});
