// remotes/stories/src/storyDetail/ActionsCard.tsx
import * as React from 'react';
import { Text, Body1, Badge, makeStyles, shorthands, tokens } from '@fluentui/react-components';
// ✨ 1. Import icon ที่ต้องการ
import { CheckmarkCircle20Regular, CheckmarkCircle24Color } from '@fluentui/react-icons';

// ✨ 2. ปรับแก้ useStyles ทั้งหมดให้เหมือนกับ NarrativeCard
const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    lineHeight: 1.6,
  },
  titleGroup: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  },
  title: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    fontSize: '18px',
  },
  stack: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '12px',
  },
  item: {
    display: 'flex',
    columnGap: '10px',
    ...shorthands.padding('10px', '12px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: tokens.colorStatusDangerBackground3,
    marginTop: '8px',
    flexShrink: 0,
  },
  itemContent: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '6px',
    width: '100%',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
  },
  sub: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
});

// ✨ 3. (แนะนำ) ย้ายข้อมูลมาไว้ใน Array เพื่อให้จัดการง่ายขึ้น
const recommendedActions = [
  {
    text: 'ลดแรงเสียดทาน OTP บน Mobile (A/B) — guest checkout / OTP เฉพาะ high-risk; cache หน้า OTP',
    badge: { text: 'วันนี้–พรุ่งนี้', color: 'danger' as const },
    kpi: 'KPI: Checkout→Purchase ↑ ≥ +200% ภายใน 48 ชม.',
  },
  {
    text: 'ถอดสคริปต์ heatmap บน mobile — ใช้ sampling/เฉพาะ staging',
    badge: { text: 'วันนี้', color: 'danger' as const },
    kpi: 'KPI: TTI ↓ ≥ 0.5s',
  },
  {
    text: 'สลับเส้นทางชำระเงินสำรอง + Alert — failover auto + alert เมื่อ error > 2%',
    badge: { text: 'เร่งด่วน', color: 'danger' as const },
    kpi: 'KPI: Payment error < 1%',
  },
  {
    text: 'Wallet priority / One-click Pay',
    badge: { text: '2–7 วัน', color: 'brand' as const },
    kpi: 'KPI: Mobile CPA ↓ ≥ 30%',
  },
  {
    text: 'รีมาร์เก็ตติ้ง Drop-off (3 กลุ่ม) — ATC / Checkout / OTP abandon',
    badge: { text: '2–7 วัน', color: 'brand' as const },
    kpi: 'KPI: ROAS กลุ่มรีมาร์เก็ต ≥ 6.0',
  },
  {
    text: 'ปรับ Checkout เป็น step เดียวบน Mobile',
    badge: { text: '1–2 สัปดาห์', color: 'success' as const },
    kpi: 'KPI: Purchase rate mobile ≥ 0.5%',
  },
];

export const ActionsCard: React.FC = () => {
  const s = useStyles();
  // ✨ 4. ปรับแก้ JSX ทั้งหมดให้ใช้โครงสร้างและสไตล์ใหม่
  return (
    <div className={s.card}>
      <div className={s.titleGroup}>
        <CheckmarkCircle24Color />
        <Text className={s.title}>Recommended Actions</Text>
      </div>

      <div className={s.stack}>
        {recommendedActions.map((action, index) => (
          <div key={index} className={s.item}>
            <span className={s.dot} />
            <div className={s.itemContent}>
              <div className={s.row}>
                <Body1>
                  <strong>{action.text.split('—')[0]}</strong>
                  {action.text.includes('—') && `—${action.text.split('—')[1]}`}
                </Body1>
                <Badge
                  appearance="tint"
                  color={action.badge.color}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {action.badge.text}
                </Badge>
              </div>
              <Text className={s.sub}>{action.kpi}</Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
