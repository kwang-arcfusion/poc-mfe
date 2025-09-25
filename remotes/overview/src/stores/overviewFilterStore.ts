// remotes/overview/src/stores/overviewFilterStore.ts
import { create } from 'zustand';
import {
  fetchAnalyticsOptions,
  fetchOverviewData,
  fetchPerformanceSummary,
  searchCampaignsAndOffers,
} from '@arcfusion/client';
import { getDatePresets } from '@arcfusion/ui';
import type { OptionGroup, OverviewApiResponse, DateRange, OptionItem } from '@arcfusion/types';

type OfferChannelMap = { [offerId: string]: string[] };

export interface OverviewState {
  pendingDateRange: DateRange;
  pendingOfferFilters: string[];
  pendingChannelFilters: string[];
  appliedDateRange: DateRange;
  appliedOfferFilters: string[];
  appliedChannelFilters: string[];
  appliedCampaignOffers: OptionGroup[]; // 👈 เพิ่ม State นี้
  appliedChannels: OptionGroup[]; // 👈 เพิ่ม State นี้
  overviewData: OverviewApiResponse | null;
  availableCampaignOffers: OptionGroup[];
  availableChannels: OptionGroup[];
  offerChannelMap: OfferChannelMap;
  isRightPanelVisible: boolean;
  chartMetricKey: string;
  focusedOfferId: string | null;
  rightPanelData: any[];
  isDirty: boolean;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  searchOffers: (query: string) => Promise<void>;
  setPendingDateRange: (range: DateRange) => void;
  setPendingOfferFilters: (selection: string[]) => void;
  setPendingChannelFilters: (selection: string[]) => void;
  setChartMetricKey: (key: string) => void;
  setFocusedOfferId: (offerId: string | null) => void;
  applyFilters: () => void;
  cancelChanges: () => void;
}

export const useOverviewStore = create<OverviewState>((set, get) => ({
  // --- Initial State ---
  pendingDateRange: { start: null, end: null },
  pendingOfferFilters: [],
  pendingChannelFilters: [],
  appliedDateRange: { start: null, end: null },
  appliedOfferFilters: [],
  appliedChannelFilters: [],
  appliedCampaignOffers: [], // 👈 เพิ่มค่าเริ่มต้น
  appliedChannels: [], // 👈 เพิ่มค่าเริ่มต้น
  overviewData: null,
  availableCampaignOffers: [],
  availableChannels: [],
  offerChannelMap: {},
  isRightPanelVisible: false,
  rightPanelData: [],
  chartMetricKey: '',
  focusedOfferId: null,
  isDirty: false,
  isLoading: true,
  error: null,

  // --- Actions ---
  initialize: async () => {
    set({ isLoading: true, error: null });
    try {
      const initialDateRange = getDatePresets().thisWeek;

      const [optionsResponse, searchResponse] = await Promise.all([
        fetchAnalyticsOptions(),
        searchCampaignsAndOffers(initialDateRange, ''),
      ]);

      const campaignOffers = searchResponse.items;

      const uniqueChannels = new Set<string>();
      campaignOffers.forEach((group) => {
        group.children.forEach((offer) => {
          offer.channels?.forEach((channel) => {
            uniqueChannels.add(channel);
          });
        });
      });

      const dynamicChannelOptions = Array.from(uniqueChannels).map((channel) => ({
        id: channel,
        name: channel,
      }));

      const allChannelIds = Array.from(uniqueChannels);

      const newOfferChannelMap: OfferChannelMap = {};
      const allOfferFilterStrings: string[] = [];
      campaignOffers.forEach((group: OptionGroup) => {
        group.children.forEach((child: OptionItem) => {
          if (child.channels) {
            newOfferChannelMap[child.id] = child.channels;
          }
          allOfferFilterStrings.push(`offer_group:${child.id}`);
        });
      });

      set({
        pendingDateRange: initialDateRange,
        availableCampaignOffers: campaignOffers,
        offerChannelMap: newOfferChannelMap,
        availableChannels: [
          {
            name: 'Channels',
            children: dynamicChannelOptions,
          },
        ],
        chartMetricKey: optionsResponse.metrics.length > 0 ? optionsResponse.metrics[0].key : '',
        pendingOfferFilters: allOfferFilterStrings,
        pendingChannelFilters: allChannelIds,
        isDirty: true,
      });

      await get().applyFilters();
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  searchOffers: async (query: string) => {
    const { pendingDateRange } = get();
    try {
      const searchResponse = await searchCampaignsAndOffers(pendingDateRange, query);
      const campaignOffers = searchResponse.items;

      const newOfferChannelMap: OfferChannelMap = {};
      campaignOffers.forEach((group: OptionGroup) => {
        group.children.forEach((child: OptionItem) => {
          if (child.channels) {
            newOfferChannelMap[child.id] = child.channels;
          }
        });
      });
      set({
        availableCampaignOffers: campaignOffers,
        offerChannelMap: { ...get().offerChannelMap, ...newOfferChannelMap },
      });
    } catch (err: any) {
      set({ error: 'Failed to search offers.' });
    }
  },

  setPendingDateRange: async (range: DateRange) => {
    set({
      pendingDateRange: range,
      isDirty: true,
      availableCampaignOffers: [],
      pendingOfferFilters: [],
      focusedOfferId: null,
    });

    await get().searchOffers('');

    const { availableCampaignOffers } = get();

    const allOfferFilterStrings: string[] = [];
    availableCampaignOffers.forEach((group: OptionGroup) => {
      group.children.forEach((child: OptionItem) => {
        allOfferFilterStrings.push(`offer_group:${child.id}`);
      });
    });

    const availableChannelsForSelection = new Set<string>();
    availableCampaignOffers.forEach((group) => {
      group.children.forEach((offer) => {
        offer.channels?.forEach((channel) => {
          availableChannelsForSelection.add(channel);
        });
      });
    });

    const newChannelFilters = Array.from(availableChannelsForSelection);

    const newAvailableChannels = [
      {
        name: 'Channels',
        children: newChannelFilters.map((channel) => ({ id: channel, name: channel })),
      },
    ];

    set({
      pendingOfferFilters: allOfferFilterStrings,
      availableChannels: newAvailableChannels,
      pendingChannelFilters: newChannelFilters,
    });
  },

  setPendingOfferFilters: (selection: string[]) => {
    const { offerChannelMap } = get();
    const availableChannelsForSelection = new Set<string>();
    selection.forEach((offerFilterString) => {
      const offerId = offerFilterString.split(':').pop();
      if (offerId && offerChannelMap[offerId]) {
        offerChannelMap[offerId].forEach((channel) => availableChannelsForSelection.add(channel));
      }
    });

    const newChannelFilters = Array.from(availableChannelsForSelection);

    const newAvailableChannels = [
      {
        name: 'Channels',
        children: newChannelFilters.map((channel) => ({ id: channel, name: channel })),
      },
    ];

    set({
      pendingOfferFilters: selection,
      availableChannels: newAvailableChannels,
      pendingChannelFilters: newChannelFilters,
      isDirty: true,
      focusedOfferId: null,
    });
  },

  setPendingChannelFilters: (selection: string[]) => {
    const { offerChannelMap, pendingOfferFilters } = get();

    const newOfferFilters = pendingOfferFilters.filter((offerFilterString) => {
      const offerId = offerFilterString.split(':').pop();
      if (!offerId) return false;
      const offerChannels = offerChannelMap[offerId];
      if (!offerChannels || offerChannels.length === 0) {
        return false;
      }
      return offerChannels.some((channel) => selection.includes(channel));
    });

    const finalOfferFilters = newOfferFilters.length > 0 ? newOfferFilters : [];

    set({
      pendingChannelFilters: selection,
      pendingOfferFilters: finalOfferFilters,
      isDirty: true,
      focusedOfferId: null,
    });
  },

  setChartMetricKey: (key) => {
    set({ chartMetricKey: key });
  },

  setFocusedOfferId: (offerId: string | null) => {
    const {
      focusedOfferId: currentFocusedId,
      offerChannelMap,
      availableChannels,
      applyFilters,
    } = get();

    const newFocusedId = offerId && offerId === currentFocusedId ? null : offerId;
    let newChannelFilters = get().pendingChannelFilters;

    if (newFocusedId) {
      const validChannelsForOffer = offerChannelMap[newFocusedId] || [];
      if (validChannelsForOffer.length > 0) {
        newChannelFilters = validChannelsForOffer;
      }
    } else {
      const allChannelIds = availableChannels.flatMap((g) => g.children.map((c) => c.id));
      newChannelFilters = allChannelIds;
    }

    set({
      focusedOfferId: newFocusedId,
      pendingChannelFilters: newChannelFilters,
    });

    applyFilters();
  },

  applyFilters: async () => {
    const { pendingDateRange, pendingChannelFilters, pendingOfferFilters, focusedOfferId } = get();
    const activeOfferFilters = focusedOfferId
      ? [`offer_group:${focusedOfferId}`]
      : pendingOfferFilters;

    set({ isLoading: true, error: null });

    try {
      const [overviewData, rightPanelData] = await Promise.all([
        fetchOverviewData(
          pendingDateRange,
          pendingChannelFilters,
          activeOfferFilters,
          'prev_period'
        ),
        fetchPerformanceSummary({
          dateRange: pendingDateRange,
          offer_ids: pendingOfferFilters,
        }),
      ]);

      set({
        overviewData,
        rightPanelData,
        appliedDateRange: pendingDateRange,
        appliedOfferFilters: pendingOfferFilters,
        appliedChannelFilters: pendingChannelFilters,
        appliedCampaignOffers: get().availableCampaignOffers, // ✨ บันทึกค่า
        appliedChannels: get().availableChannels, // ✨ บันทึกค่า
        isDirty: false,
        isLoading: false,
        isRightPanelVisible: pendingOfferFilters.length > 0,
      });
    } catch (err: any) {
      console.error('Failed to apply filters:', err);
      set({ error: err.message, isLoading: false });
    }
  },

  cancelChanges: () => {
    const {
      appliedDateRange,
      appliedOfferFilters,
      appliedChannelFilters,
      appliedCampaignOffers, // 👈 ดึงค่า
      appliedChannels, // 👈 ดึงค่า
    } = get();
    set({
      pendingDateRange: appliedDateRange,
      pendingOfferFilters: appliedOfferFilters,
      pendingChannelFilters: appliedChannelFilters,
      availableCampaignOffers: appliedCampaignOffers, // ✨ คืนค่า
      availableChannels: appliedChannels, // ✨ คืนค่า
      isDirty: false,
      focusedOfferId: null,
    });
  },
}));
