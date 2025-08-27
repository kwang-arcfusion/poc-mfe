// remotes/stories/src/storyDetail/ActionsCard.tsx
import * as React from 'react';
import {
  Card,
  Text,
  Body1,
  Badge,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  card: { ...shorthands.padding('20px'), rowGap: '12px' },
  title: { fontWeight: tokens.fontWeightSemibold, color: tokens.colorNeutralForeground1 },
  item: {
    ...shorthands.padding('12px'),
    rowGap: '6px',
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'start' },
  sub: { color: tokens.colorNeutralForeground3, fontSize: tokens.fontSizeBase200 },
});

export const ActionsCard: React.FC = () => {
  const s = useStyles();
  return (
    <div>
      <Text as="h2" className={s.title}>
        ✅ Recommended Actions
      </Text>

      <Card appearance="filled" className={s.item}>
        <div className={s.row}>
          <Body1>
            <strong>ลดแรงเสียดทาน OTP บน Mobile (A/B)</strong> — guest checkout / OTP เฉพาะ
            high-risk; cache หน้า OTP
          </Body1>
          <Badge appearance="tint" color="danger">
            วันนี้–พรุ่งนี้
          </Badge>
        </div>
        <Text className={s.sub}>KPI: Checkout→Purchase ↑ ≥ +200% ภายใน 48 ชม.</Text>
      </Card>

      <Card appearance="filled" className={s.item}>
        <div className={s.row}>
          <Body1>
            <strong>ถอดสคริปต์ heatmap บน mobile</strong> — ใช้ sampling/เฉพาะ staging
          </Body1>
          <Badge appearance="tint" color="danger">
            วันนี้
          </Badge>
        </div>
        <Text className={s.sub}>KPI: TTI ↓ ≥ 0.5s</Text>
      </Card>

      <Card appearance="filled" className={s.item}>
        <div className={s.row}>
          <Body1>
            <strong>สลับเส้นทางชำระเงินสำรอง + Alert</strong> — failover auto + alert เมื่อ error
            &gt; 2%
          </Body1>
          <Badge appearance="tint" color="danger">
            เร่งด่วน
          </Badge>
        </div>
        <Text className={s.sub}>KPI: Payment error &lt; 1%</Text>
      </Card>

      <Card appearance="filled" className={s.item}>
        <div className={s.row}>
          <Body1>
            <strong>Wallet priority / One-click Pay</strong>
          </Body1>
          <Badge appearance="tint" color="brand">
            2–7 วัน
          </Badge>
        </div>
        <Text className={s.sub}>KPI: Mobile CPA ↓ ≥ 30%</Text>
      </Card>

      <Card appearance="filled" className={s.item}>
        <div className={s.row}>
          <Body1>
            <strong>รีมาร์เก็ตติ้ง Drop-off (3 กลุ่ม)</strong> — ATC / Checkout / OTP abandon
          </Body1>
          <Badge appearance="tint" color="brand">
            2–7 วัน
          </Badge>
        </div>
        <Text className={s.sub}>KPI: ROAS กลุ่มรีมาร์เก็ต ≥ 6.0</Text>
      </Card>

      <Card appearance="filled" className={s.item}>
        <div className={s.row}>
          <Body1>
            <strong>ปรับ Checkout เป็น step เดียวบน Mobile</strong>
          </Body1>
          <Badge appearance="tint" color="success">
            1–2 สัปดาห์
          </Badge>
        </div>
        <Text className={s.sub}>KPI: Purchase rate mobile ≥ 0.5%</Text>
      </Card>
    </div>
  );
};
