import { Chip } from '@mui/material';

export type ProvenanceVariant =
  | 'listing'
  | 'comps'
  | 'calculated'
  | 'assumption'
  | 'pending';

type ProvenanceBadgeProps = {
  variant: ProvenanceVariant;
  size?: 'small' | 'medium';
  className?: string;
};

const variantConfig: Record<
  ProvenanceVariant,
  { label: string; borderColor: string; backgroundColor: string; textColor: string }
> = {
  listing: {
    label: 'Listing',
    borderColor: '#93C5FD',
    backgroundColor: '#EFF6FF',
    textColor: '#1D4ED8'
  },
  comps: {
    label: 'Comps',
    borderColor: '#A7F3D0',
    backgroundColor: '#ECFDF5',
    textColor: '#047857'
  },
  calculated: {
    label: 'Calculated',
    borderColor: '#C4B5FD',
    backgroundColor: '#F5F3FF',
    textColor: '#6D28D9'
  },
  assumption: {
    label: 'Assumption',
    borderColor: '#FCD34D',
    backgroundColor: '#FFFBEB',
    textColor: '#B45309'
  },
  pending: {
    label: 'Pending',
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    textColor: '#4B5563'
  }
};

const ProvenanceBadge = ({
  variant,
  size = 'small',
  className
}: ProvenanceBadgeProps) => {
  const config = variantConfig[variant];

  return (
    <Chip
      label={config.label}
      size={size}
      variant="outlined"
      className={className}
      sx={{
        height: size === 'small' ? 18 : 22,
        borderColor: config.borderColor,
        backgroundColor: config.backgroundColor,
        color: config.textColor,
        '& .MuiChip-label': {
          px: 0.75,
          fontSize: size === 'small' ? '0.625rem' : '0.7rem',
          fontWeight: 600,
          lineHeight: 1
        }
      }}
    />
  );
};

export default ProvenanceBadge;
