// remotes/overview/src/stores/overviewFilterStore.ts
import { create } from 'zustand';
import {
  fetchAnalyticsOptions,
  fetchOverviewData,
  fetchPerformanceSummary,
  searchCampaignsAndOffers,
} from '@arcfusion/client';
import { getDatePresets } from '@arcfusion/ui';
import type {
  OptionGroup,
  OverviewApiResponse,
  FilterValues,
  DateRange,
  OptionItem,
} from '@arcfusion/types';

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
      const [options, campaignOffers] = await Promise.all([
        fetchAnalyticsOptions(),
        searchCampaignsAndOffers(initialDateRange, ''),
      ]);

      const allChannelOptions = options.dimensions.find((d) => d.key === 'channel')?.options || [];
      const allChannelIds = allChannelOptions.map((o) => o.key);

      const newOfferChannelMap: OfferChannelMap = {};
      const allOfferFilterStrings: string[] = []; // ✨ เตรียม list ของ filter string ทั้งหมด

      campaignOffers.forEach((group: OptionGroup) => {
        group.children.forEach((child: OptionItem) => {
          if (child.channels) {
            newOfferChannelMap[child.id] = child.channels;
          }
          // ✨ สร้าง filter string สำหรับ offer แต่ละตัว
          // ในตัวอย่างนี้ เราจะใช้ offer_group เป็น default เพื่อรวมผล
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
        // ✨ ตั้งค่า filter เริ่มต้นให้เป็น "ทั้งหมด"
        pendingOfferFilters: allOfferFilterStrings,
        pendingChannelFilters: allChannelIds,
        isDirty: true, // ตั้งเป็น true เพื่อให้ปุ่ม Apply แสดง
      });

      // ✨ เรียก applyFilters ทันทีเพื่อโหลดข้อมูลหน้า Dashboard
      await get().applyFilters();
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  searchOffers: async (query: string) => {
    const { pendingDateRange } = get();
    try {
      const campaignOffers = await searchCampaignsAndOffers(pendingDateRange, query);
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
    set({ pendingDateRange: range, isDirty: true, availableCampaignOffers: [] });
    await get().searchOffers('');
  },

  setPendingOfferFilters: (selection: string[]) => {
    const {
      offerChannelMap,
      pendingChannelFilters,
      availableChannels: currentAvailableChannels,
    } = get();

    const relevantChannels = new Set<string>();
    selection.forEach((filterString) => {
      const match = filterString.match(/offer(?:_group)?:([^,]+)/);
      const offerId = match ? match[1] : null;

      if (offerId && offerChannelMap[offerId]) {
        offerChannelMap[offerId].forEach((channel) => relevantChannels.add(channel));
      }
    });

    const allPossibleChannels = (currentAvailableChannels[0]?.children || []).map((c) => c.id);
    const newAvailableChannels = allPossibleChannels.filter(
      (cId) => relevantChannels.size === 0 || relevantChannels.has(cId)
    );
    const newSelectedChannels = pendingChannelFilters.filter(
      (c) => relevantChannels.size === 0 || relevantChannels.has(c)
    );

    const newAvailableChannelOptions = (currentAvailableChannels[0]?.children || []).filter((c) =>
      newAvailableChannels.includes(c.id)
    );

    set({
      pendingOfferFilters: selection,
      availableChannels: [{ name: 'Channels', children: newAvailableChannelOptions }],
      pendingChannelFilters: newSelectedChannels,
      isDirty: true,
    });
  },

  setPendingChannelFilters: (selection: string[]) => {
    set({ pendingChannelFilters: selection, isDirty: true });
  },

  setChartMetricKey: (key) => {
    set({ chartMetricKey: key });
  },

  setFocusedOfferId: (offerId: string | null) => {
    console.log('Drill down to offer:', offerId);
  },

  applyFilters: async () => {
    const { pendingDateRange, pendingChannelFilters, pendingOfferFilters } = get();
    set({ isLoading: true, error: null, isRightPanelVisible: pendingOfferFilters.length > 0 });
    try {
      const [overviewData, rightPanelData] = await Promise.all([
        fetchOverviewData(pendingDateRange, pendingChannelFilters, pendingOfferFilters),
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
      });
    } catch (err: any) {
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
