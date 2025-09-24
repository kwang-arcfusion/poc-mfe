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

      // API calls ยังเหมือนเดิม
      const [optionsResponse, searchResponse] = await Promise.all([
        fetchAnalyticsOptions(),
        searchCampaignsAndOffers(initialDateRange, ''),
      ]);

      const campaignOffers = searchResponse.items;

      // --- START EDIT ---
      // 1. สร้าง Set เพื่อเก็บชื่อ Channel ที่ไม่ซ้ำกันจาก Offer ทั้งหมดที่ได้มา
      const uniqueChannels = new Set<string>();
      campaignOffers.forEach((group) => {
        group.children.forEach((offer) => {
          offer.channels?.forEach((channel) => {
            uniqueChannels.add(channel);
          });
        });
      });

      // 2. แปลง Set เป็นโครงสร้างที่ MultiSelect ต้องการ
      const dynamicChannelOptions = Array.from(uniqueChannels).map((channel) => ({
        id: channel,
        name: channel,
      }));

      const allChannelIds = Array.from(uniqueChannels);
      // --- END EDIT ---

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
        // 3. ใช้ตัวเลือก Channel ที่สร้างขึ้นมาใหม่แบบ dynamic
        availableChannels: [
          {
            name: 'Channels',
            children: dynamicChannelOptions,
          },
        ],
        chartMetricKey: optionsResponse.metrics.length > 0 ? optionsResponse.metrics[0].key : '',
        // 4. ตั้งค่า Filter เริ่มต้นให้เลือกทุก Channel ที่เจอ
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
      pendingOfferFilters: [],
      focusedOfferId: null,
    });

    // ดึงข้อมูล Offer ใหม่สำหรับช่วงวันที่ที่เลือก (เหมือนเดิม)
    await get().searchOffers('');

    // --- START EDIT ---
    const { availableCampaignOffers, offerChannelMap } = get();

    // 1. คำนวณ Offer filters ใหม่จาก Offer ที่เพิ่งดึงมา
    const allOfferFilterStrings: string[] = [];
    availableCampaignOffers.forEach((group: OptionGroup) => {
      group.children.forEach((child: OptionItem) => {
        allOfferFilterStrings.push(`offer_group:${child.id}`);
      });
    });

    // 2. คำนวณ Channel ที่เกี่ยวข้องทั้งหมดจาก Offer ที่เพิ่งดึงมา
    const availableChannelsForSelection = new Set<string>();
    availableCampaignOffers.forEach((group) => {
      group.children.forEach((offer) => {
        offer.channels?.forEach((channel) => {
          availableChannelsForSelection.add(channel);
        });
      });
    });

    const newChannelFilters = Array.from(availableChannelsForSelection);

    // 3. สร้างโครงสร้าง OptionGroup สำหรับ Channel dropdown ขึ้นมาใหม่
    const newAvailableChannels = [
      {
        name: 'Channels',
        children: newChannelFilters.map((channel) => ({ id: channel, name: channel })),
      },
    ];

    // 4. อัปเดต State ทั้งหมดในครั้งเดียว
    set({
      pendingOfferFilters: allOfferFilterStrings,
      availableChannels: newAvailableChannels,
      pendingChannelFilters: newChannelFilters,
    });
    // --- END EDIT ---
  },

  setPendingOfferFilters: (selection: string[]) => {
    const { offerChannelMap } = get();

    // 1. รวบรวม Channel ทั้งหมดที่ไม่ซ้ำกัน จาก Offer ที่ถูกเลือกใหม่ (selection)
    const availableChannelsForSelection = new Set<string>();
    selection.forEach((offerFilterString) => {
      const offerId = offerFilterString.split(':').pop();
      if (offerId && offerChannelMap[offerId]) {
        offerChannelMap[offerId].forEach((channel) => availableChannelsForSelection.add(channel));
      }
    });

    const newChannelFilters = Array.from(availableChannelsForSelection);

    // --- START EDIT ---
    // 2. สร้างโครงสร้าง OptionGroup สำหรับ availableChannels ขึ้นมาใหม่แบบ Dynamic
    const newAvailableChannels = [
      {
        name: 'Channels',
        children: newChannelFilters.map((channel) => ({ id: channel, name: channel })),
      },
    ];
    // --- END EDIT ---

    set({
      pendingOfferFilters: selection,
      // 3. อัปเดตทั้งสอง State พร้อมกัน
      availableChannels: newAvailableChannels, // <-- อัปเดตตัวเลือกทั้งหมดใน dropdown
      pendingChannelFilters: newChannelFilters, // <-- อัปเดตตัวที่ถูกติ๊ก (ให้เลือกทั้งหมดที่ใช้ได้)
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
      offerChannelMap, // <-- 1. ดึง offerChannelMap จาก state
      availableChannels, // <-- 2. ดึง availableChannels มาเพื่อหา all channel ids
      applyFilters,
    } = get();

    const newFocusedId = offerId && offerId === currentFocusedId ? null : offerId;

    let newChannelFilters = get().pendingChannelFilters; // <-- ใช้ค่าเดิมเป็น default

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
