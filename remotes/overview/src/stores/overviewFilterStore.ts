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

      const [options, searchResponse] = await Promise.all([
        fetchAnalyticsOptions(),
        searchCampaignsAndOffers(initialDateRange, ''),
      ]);

      const campaignOffers = searchResponse.items;

      const allChannelOptions = options.dimensions.find((d) => d.key === 'channel')?.options || [];
      const allChannelIds = allChannelOptions.map((o) => o.key);

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
            children: allChannelOptions.map((o) => ({ id: o.key, name: o.label })),
          },
        ],
        chartMetricKey: options.metrics.length > 0 ? options.metrics[0].key : '',
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
      // --- START EDIT ---
      // 3. แก้ไขการดึงข้อมูลตรงนี้ด้วย
      const searchResponse = await searchCampaignsAndOffers(pendingDateRange, query);
      const campaignOffers = searchResponse.items;
      // --- END EDIT ---

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
      pendingOfferFilters: [], // ล้างค่าที่เลือกไว้ก่อน
      focusedOfferId: null,
    });

    // ดึงข้อมูล Offer ใหม่สำหรับช่วงวันที่ที่เลือก
    await get().searchOffers('');

    // --- ส่วนที่เพิ่มเข้ามา ---
    // หลังจากดึงข้อมูล Offer ใหม่แล้ว ให้อ่านค่าแล้วตั้งเป็น Filter ที่เลือกไว้เลย
    const { availableCampaignOffers } = get();
    const allOfferFilterStrings: string[] = [];
    availableCampaignOffers.forEach((group: OptionGroup) => {
      group.children.forEach((child: OptionItem) => {
        // ใช้ `offer_group:` เพื่อให้ตรงกับ format ที่ MultiSelect component สร้าง
        allOfferFilterStrings.push(`offer_group:${child.id}`);
      });
    });

    set({ pendingOfferFilters: allOfferFilterStrings });
  },

  setPendingOfferFilters: (selection: string[]) => {
    set({
      pendingOfferFilters: selection,
      isDirty: true,
      focusedOfferId: null,
    });
  },

  setPendingChannelFilters: (selection: string[]) => {
    set({
      pendingChannelFilters: selection,
      isDirty: true,
      focusedOfferId: null,
    });
  },

  setChartMetricKey: (key) => {
    set({ chartMetricKey: key });
  },

  setFocusedOfferId: (offerId: string | null) => {
    const { focusedOfferId: currentFocusedId, applyFilters } = get();
    const newFocusedId = offerId && offerId === currentFocusedId ? null : offerId;
    set({ focusedOfferId: newFocusedId });
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
    const { appliedDateRange, appliedOfferFilters, appliedChannelFilters } = get();
    set({
      pendingDateRange: appliedDateRange,
      pendingOfferFilters: appliedOfferFilters,
      pendingChannelFilters: appliedChannelFilters,
      isDirty: false,
      focusedOfferId: null,
    });
  },
}));
