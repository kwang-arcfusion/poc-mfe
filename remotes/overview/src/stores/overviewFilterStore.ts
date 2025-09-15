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
    focusedOfferId: string | null; // ✨ State นี้จะใช้ควบคุมการ Drill-down เพียงอย่างเดียว
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
    // ✨ ลบ preFocusOfferFilters ออก เพราะเรามีวิธีจัดการที่ดีกว่าแล้ว
    
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
        set({
            pendingDateRange: range,
            isDirty: true,
            availableCampaignOffers: [],
            focusedOfferId: null, // Reset focus state
        });
        await get().searchOffers('');
    },

    setPendingOfferFilters: (selection: string[]) => {
        // ... (Logic for updating channels remains the same)
        set({
            pendingOfferFilters: selection,
            // ... (other channel state updates)
            isDirty: true,
            focusedOfferId: null, // Reset focus state
        });
    },

    setPendingChannelFilters: (selection: string[]) => {
        set({
            pendingChannelFilters: selection,
            isDirty: true,
            focusedOfferId: null, // Reset focus state
        });
    },

    setChartMetricKey: (key) => {
        set({ chartMetricKey: key });
    },

    // ✨ 1. แก้ไข setFocusedOfferId ให้จัดการแค่การ Toggle State
    setFocusedOfferId: (offerId: string | null) => {
        const { focusedOfferId: currentFocusedId, applyFilters } = get();

        // Toggle: ถ้าคลิกตัวเดิม ให้ยกเลิก focus, ถ้าคลิกตัวใหม่ ให้ focus ตัวใหม่
        const newFocusedId = offerId && offerId === currentFocusedId ? null : offerId;
        
        set({ focusedOfferId: newFocusedId });
        
        // หลังจากเปลี่ยน state แล้ว ให้เรียก applyFilters เพื่อดึงข้อมูลใหม่ทันที
        applyFilters(); 
    },
    
    // ✨ 2. แก้ไข applyFilters ให้ฉลาดขึ้น
    applyFilters: async () => {
        const { pendingDateRange, pendingChannelFilters, pendingOfferFilters, focusedOfferId } = get();

        // ตรรกะสำคัญ:
        // ถ้ามีการ focus (drill-down) ให้ใช้ focusedOfferId ในการ filter หน้าจอหลัก
        // ถ้าไม่มีการ focus ให้ใช้ pendingOfferFilters จาก Filter ด้านบน
        const activeOfferFilters = focusedOfferId
            ? [`offer_group:${focusedOfferId}`] 
            : pendingOfferFilters;

        set({ isLoading: true, error: null });
        try {
            const [overviewData, rightPanelData] = await Promise.all([
                // API สำหรับหน้าจอหลัก (Cards, Chart, Table) จะใช้ activeOfferFilters
                fetchOverviewData(pendingDateRange, pendingChannelFilters, activeOfferFilters),
                
                // API สำหรับ Panel ขวา จะใช้ pendingOfferFilters เสมอ เพื่อให้รายการแสดงผลครบถ้วน
                fetchPerformanceSummary({
                    dateRange: pendingDateRange,
                    offer_ids: pendingOfferFilters, 
                }),
            ]);
            
            set({
                overviewData,
                rightPanelData,
                appliedDateRange: pendingDateRange,
                appliedOfferFilters: pendingOfferFilters, // State ที่ apply แล้ว จะยึดตาม Filter หลักเสมอ
                appliedChannelFilters: pendingChannelFilters,
                isDirty: false,
                isLoading: false,
                isRightPanelVisible: pendingOfferFilters.length > 0
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