import { formatDaysOnMarket } from '../src/utils/formatDaysOnMarket';

describe('formatDaysOnMarket', () => {
  describe('Rule 1: 1-30 days', () => {
    it('should return days for 1 day', () => {
      expect(formatDaysOnMarket(1)).toBe('1 days');
    });

    it('should return days for 15 days', () => {
      expect(formatDaysOnMarket(15)).toBe('15 days');
    });

    it('should return days for 30 days', () => {
      expect(formatDaysOnMarket(30)).toBe('30 days');
    });
  });

  describe('Rule 2: 31 days to less than a year', () => {
    it('should return 1 months for 31 days', () => {
      expect(formatDaysOnMarket(31)).toBe('1 months');
    });

    it('should return 1.5 months for 44 days', () => {
      expect(formatDaysOnMarket(44)).toBe('1.5 months');
    });

    it('should return 2 months for 59 days', () => {
      expect(formatDaysOnMarket(59)).toBe('2 months');
    });

    it('should return 2.5 months for 74 days', () => {
      expect(formatDaysOnMarket(74)).toBe('2.5 months');
    });

    it('should return 6 months for 183 days', () => {
      expect(formatDaysOnMarket(183)).toBe('6 months');
    });

    it('should return 11.5 months for 350 days', () => {
      expect(formatDaysOnMarket(350)).toBe('11.5 months');
    });

    it('should return 12 months for 364 days', () => {
      expect(formatDaysOnMarket(364)).toBe('12 months');
    });
  });

  describe('Rule 3: A year and above (365+)', () => {
    it('should return 1 years for 365 days', () => {
      expect(formatDaysOnMarket(365)).toBe('1 years');
    });

    it('should return 1 years and 1 months for 400 days', () => {
      expect(formatDaysOnMarket(400)).toBe('1 years and 1 months');
    });

    it('should return 1 years and 6 months for 550 days', () => {
      expect(formatDaysOnMarket(550)).toBe('1 years and 6 months');
    });

    it('should return 2 years for 730 days', () => {
      expect(formatDaysOnMarket(730)).toBe('2 years');
    });

    it('should return 2 years and 3 months for 820 days', () => {
      expect(formatDaysOnMarket(820)).toBe('2 years and 3 months');
    });

    it('should return 3 years and 6.5 months for 1300 days', () => {
      expect(formatDaysOnMarket(1300)).toBe('3 years and 6.5 months');
    });

    it('should return 5 years for 1826 days', () => {
      expect(formatDaysOnMarket(1826)).toBe('5 years');
    });
  });

  describe('Edge cases and normalization', () => {
    it('should handle 0 days', () => {
      expect(formatDaysOnMarket(0)).toBe('0 days');
    });

    it('should handle very large numbers', () => {
      expect(formatDaysOnMarket(3650)).toBe('10 years');
    });

    it('should normalize months when they reach 12', () => {
      expect(formatDaysOnMarket(730)).toBe('2 years');
    });

    it('should handle decimal months correctly', () => {
      expect(formatDaysOnMarket(45)).toBe('1.5 months');
      expect(formatDaysOnMarket(76)).toBe('2.5 months');
    });
  });
});
