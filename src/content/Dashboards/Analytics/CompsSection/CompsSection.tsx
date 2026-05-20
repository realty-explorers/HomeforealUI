import AnalyzedProperty, {
  CompData,
  FilteredComp
} from '@/models/analyzedProperty';
import { Box, Button, Grid, Typography } from '@mui/material';
import CompsFilter from './CompsFilter';
import TuneIcon from '@mui/icons-material/Tune';
import { LayoutGrid, List as ListIcon } from 'lucide-react';
import styled from '@emotion/styled';
import analyticsStyles from '../Analytics.module.scss';
import styles from './CompsSection.module.scss';
import { useEffect, useState } from 'react';
import React from 'react';
import CompsListView from './CompsListView';
import { cn } from '@/lib/utils';

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  overflowX: 'auto',
  gap: '1rem',
  padding: '0.5rem 0.25rem'
}));

type CompsSectionProps = {
  comps: CompData[];
  selectedComps: FilteredComp[];
  setSelectedComps: (comps: FilteredComp[]) => void;
  propertyCard: React.ReactNode;
  compCard: React.ReactElement;
  subject?: AnalyzedProperty;
};
const CompsSection = ({
  comps,
  selectedComps,
  setSelectedComps,
  propertyCard,
  compCard,
  subject
}: CompsSectionProps) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('list');
  // const selectedCompsIndexes = selectedComps?.map((comp) => comp.index);
  const [selectedCompsIndexes, setSelectedCompsIndexes] = useState<number[]>(
    []
  );

  useEffect(() => {
    setSelectedCompsIndexes(selectedComps?.map((comp) => comp.index));
  }, [selectedComps]);

  const handleToggle = (index: number) => {
    if (selectedCompsIndexes?.includes(index)) {
      const filteredComps = selectedComps.filter(
        (property) => property.index !== index
      );
      setSelectedComps(filteredComps);
    } else {
      const newSelectedComps = [...selectedComps, { ...comps?.[index], index }];
      setSelectedComps(newSelectedComps);
    }
  };
  const createCompCard = (compsProperty: CompData, index: number) => {
    const newCompCard = React.cloneElement(compCard, {
      compsProperty,
      index,
      selected: selectedCompsIndexes?.includes(index),
      toggle: () => handleToggle(index)
    });
    return newCompCard;
  };

  return (
    <Grid className={`${analyticsStyles.sectionContainer}`}>
      <Typography className={styles.compsSectionInfo}>
        We found {selectedComps?.length} comps that match your search
      </Typography>
      <div className="hidden md:flex items-center gap-2 mt-2">
        <Button
          onClick={() => setFilterOpen(!filterOpen)}
          startIcon={<TuneIcon />}
          className="text-black bg-white hover:bg-[#5569ff] hover:text-white rounded-2xl px-4"
        >
          Filter Comps
        </Button>
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
          <button
            type="button"
            aria-label="List view"
            onClick={() => setViewMode('list')}
            className={cn(
              'flex items-center justify-center size-8 rounded-md transition-colors',
              viewMode === 'list'
                ? 'bg-primary text-white'
                : 'text-slate-500 hover:text-slate-900'
            )}
          >
            <ListIcon className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Card view"
            onClick={() => setViewMode('cards')}
            className={cn(
              'flex items-center justify-center size-8 rounded-md transition-colors',
              viewMode === 'cards'
                ? 'bg-primary text-white'
                : 'text-slate-500 hover:text-slate-900'
            )}
          >
            <LayoutGrid className="size-4" />
          </button>
        </div>
      </div>
      <CompsFilter
        open={filterOpen}
        setOpen={setFilterOpen}
        setSelectedComps={setSelectedComps}
        selectedComps={selectedComps}
      />

      {viewMode === 'list' && subject ? (
        <div className="mt-4">
          <CompsListView
            subject={subject}
            comps={comps ?? []}
            selectedIndexes={selectedCompsIndexes ?? []}
            onToggle={handleToggle}
          />
        </div>
      ) : (
        <Wrapper className={styles.cardsWrapper}>
          <Grid item className="hidden md:flex mb-8 sticky left-0 z-[1]">
            {propertyCard}
          </Grid>
          {comps?.map((compsProperty, index) => (
            <Grid item key={index} className="mb-8 left-0">
              {createCompCard(compsProperty, index)}
            </Grid>
          ))}
        </Wrapper>
      )}
    </Grid>
  );
};

export default CompsSection;
