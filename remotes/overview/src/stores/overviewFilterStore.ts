// remotes/overview/src/stores/overviewFilterStore.ts
import { create } from 'zustand';
import type { DateRange, OptionGroup } from '@arcfusion/ui';
import type { AnalyticsOptions, FilterValues, OverviewApiResponse } from '../types';
import {
  fetchAnalyticsOptions,
  fetchCampaignOffersByDate,
  fetchOverviewData,
  fetchPerformanceSummary,
} from '../services/api';

const getThisMonthDateRange = (): DateRange => {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return { start, end };
};

export interface OverviewState {
  pendingDateRange: DateRange;
  pendingFilters: Omit<FilterValues, 'metrics'>;
  pendingCampaignOffers: string[];
  appliedDateRange: DateRange;
  appliedFilters: Omit<FilterValues, 'metrics'>;
  appliedCampaignOffers: string[];
  overviewData: OverviewApiResponse | null;
  availableCampaignOffers: OptionGroup[];
  availableChannels: OptionGroup[];
  chartMetricKey: string;
  focusedOfferId: string | null;
  rightPanelData: any[];
  isDirty: boolean;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  setPendingDateRange: (range: DateRange) => void;
  setPendingFilters: (category: 'channels', selection: string[]) => void;
  setPendingCampaignOffers: (selection: string[]) => void;
  setChartMetricKey: (key: string) => void;
  setFocusedOfferId: (offerId: string | null) => void;
  applyFilters: () => void;
  cancelChanges: () => void;
}

export const useOverviewStore = create<OverviewState>((set, get) => ({
  pendingDateRange: { start: null, end: null },
  pendingFilters: { channels: [] },
  pendingCampaignOffers: [],
  appliedDateRange: { start: null, end: null },
  appliedFilters: { channels: [] },
  appliedCampaignOffers: [],
  overviewData: null,
  availableCampaignOffers: [],
  availableChannels: [],
  rightPanelData: [],
  chartMetricKey: '',
  focusedOfferId: null,
  isDirty: false,
  isLoading: true,
  error: null,

  initialize: async () => {
    set({ isLoading: true, error: null });
    try {
      const initialDateRange = getThisMonthDateRange();
      const [options, campaignOffers] = await Promise.all([
        fetchAnalyticsOptions(),
        fetchCampaignOffersByDate(initialDateRange),
      ]);
      const allChannelIds =
        options.dimensions.find((d) => d.key === 'channel')?.options.map((o) => o.key) || [];
      const allOfferIds = campaignOffers.flatMap((cg) => cg.children.map((offer) => offer.id));
      const initialChartMetric = options.metrics.length > 0 ? options.metrics[0].key : '';
      set({
        pendingDateRange: initialDateRange,
        appliedDateRange: initialDateRange,
        pendingFilters: { channels: allChannelIds },
        appliedFilters: { channels: allChannelIds },
        pendingCampaignOffers: allOfferIds,
        appliedCampaignOffers: allOfferIds,
        availableCampaignOffers: campaignOffers,
        availableChannels: [
          {
            name: 'Channels',
            children:
              options.dimensions
                .find((d) => d.key === 'channel')
                ?.options.map((o) => ({ id: o.key, name: o.label })) || [],
          },
        ],
        chartMetricKey: initialChartMetric,
        isDirty: false,
      });
      await get().applyFilters();
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  setPendingDateRange: async (range: DateRange) => {
    set({ pendingDateRange: range, isDirty: true, isLoading: true });
    try {
      const campaignOffers = await fetchCampaignOffersByDate(range);
      const currentSelected = get().pendingCampaignOffers;
      const newAvailableIds = new Set(
        campaignOffers.flatMap((cg) => cg.children.map((offer) => offer.id))
      );
      const newSelection = currentSelected.filter((id) => newAvailableIds.has(id));
      set({
        availableCampaignOffers: campaignOffers,
        pendingCampaignOffers: newSelection,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  setPendingFilters: (category, selection) => {
    set((state) => ({
      pendingFilters: { ...state.pendingFilters, [category]: selection },
      isDirty: true,
      focusedOfferId: null,
    }));
  },

  setPendingCampaignOffers: (selection) => {
    set({ pendingCampaignOffers: selection, isDirty: true, focusedOfferId: null });
  },

  setChartMetricKey: (key) => {
    set({ chartMetricKey: key });
  },

  setFocusedOfferId: (offerId: string | null) => {
    const currentFocus = get().focusedOfferId;
    const newFocusId = currentFocus === offerId ? null : offerId;
    set({ focusedOfferId: newFocusId, isDirty: false });
    get().applyFilters();
  },

  applyFilters: async () => {
    const { pendingDateRange, pendingFilters, pendingCampaignOffers, focusedOfferId } = get();
    const offerIdsForFetch = focusedOfferId ? [focusedOfferId] : pendingCampaignOffers;
    set({
      appliedDateRange: pendingDateRange,
      appliedFilters: pendingFilters,
      appliedCampaignOffers: pendingCampaignOffers,
      isDirty: false,
      isLoading: true,
      error: null,
    });
    try {
      const [overviewData, rightPanelData] = await Promise.all([
        fetchOverviewData(pendingDateRange, pendingFilters, { offer_ids: offerIdsForFetch }),
        fetchPerformanceSummary({
          dateRange: pendingDateRange,
          offer_ids: pendingCampaignOffers,
        }),
      ]);
      set({
        overviewData,
        rightPanelData,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  cancelChanges: () => {
    const { appliedDateRange, appliedFilters, appliedCampaignOffers } = get();
    set({
      pendingDateRange: appliedDateRange,
      pendingFilters: appliedFilters,
      pendingCampaignOffers: appliedCampaignOffers,
      isDirty: false,
      focusedOfferId: null,
    });
  },
}));