// remotes/stories/src/storyDetail/NarrativeCard.tsx
import * as React from 'react';
import { Card, Text, Body1, makeStyles, shorthands, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {},
  title: { fontWeight: tokens.fontWeightSemibold, color: tokens.colorNeutralForeground1 },
  tldr: {
    ...shorthands.borderLeft('4px', 'solid', tokens.colorBrandForegroundLink),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding('10px', '12px'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
  bullet: {
    display: 'flex',
    columnGap: '10px',
    ...shorthands.padding('10px', '12px'),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: tokens.colorBrandForegroundLink,
    marginTop: '8px',
    flexShrink: 0,
  },
  stack: { display: 'flex', flexDirection: 'column', rowGap: '10px' },
});

export const NarrativeCard: React.FC = () => {
  const s = useStyles();
  return (
    <div>
      <Text as="h2" className={s.title}>
        📘 Narrative
      </Text>

      <div className={s.tldr}>
        <Body1>
          <strong>TL;DR</strong> — การซื้อหล่น <strong>−88%</strong> สัมพันธ์กับ{' '}
          <strong>Phone Verification (OTP)</strong> และเหตุการณ์ <strong>payment timeout</strong>{' '}
          ช่วง 5 ส.ค. โดยเฉพาะบนมือถือ ขณะที่ตัวชี้วัด (impr/click/spend) ใกล้เคียงเดิม
        </Body1>
      </div>

      <div className={s.stack}>
        <div className={s.bullet}>
          <span className={s.dot} />
          <Body1>
            <strong>Top-funnel แข็งแรง</strong>: Impressions +3%, CTR −7%, Spend −2% →
            ไม่ใช่ปัญหาการหาทราฟฟิก
          </Body1>
        </div>
        <div className={s.bullet}>
          <span className={s.dot} />
          <Body1>
            <strong>คอขวดอยู่ที่ขั้นจ่ายเงิน</strong>: Purchases/1k clicks จาก 6.86 →{' '}
            <strong>0.82</strong>; จุดเปลี่ยนเริ่ม 4–5 ส.ค.
          </Body1>
        </div>
        <div className={s.bullet}>
          <span className={s.dot} />
          <Body1>
            <strong>Mobile เจ็บสุด</strong>: drop-off หลัง OTP เพิ่ม +27%, TTI เพิ่ม +0.6s
            จากสคริปต์ heatmap
          </Body1>
        </div>
        <div className={s.bullet}>
          <span className={s.dot} />
          <Body1>
            <strong>เหตุการณ์สนับสนุน</strong>: payment provider timeout <em>5 ส.ค. 01:10–03:20</em>{' '}
            (error 8%); เปิด OTP 4 ส.ค.
          </Body1>
        </div>
        <div className={s.bullet}>
          <span className={s.dot} />
          <Body1>
            <strong>การแข่งขัน/ราคาโฆษณา</strong> ไม่เปลี่ยนมาก (CPM/CPC ใกล้เดิม) →
            ตัดข้อสงสัยเรื่อง auction
          </Body1>
        </div>
      </div>
    </div>
  );
};
