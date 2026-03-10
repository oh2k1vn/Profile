import { atom } from "jotai";

export interface Campaign {
  id: string;
  title: string;
  description: string;
  image: string;
  rewardPoints: number;
  endDate: string;
  status: "active" | "ended" | "upcoming";
  participants: number;
}

export const CAMPAIGNS: Campaign[] = [
  {
    id: "1",
    title: "Săn Voucher Shopee 500k",
    description:
      "Hoàn thành 5 nhiệm vụ mua sắm để có cơ hội nhận voucher 500k cực hot.",
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800",
    rewardPoints: 500,
    endDate: "2026-03-15",
    status: "active",
    participants: 1250,
  },
  {
    id: "2",
    title: "Thử Thách Ăn Uống Highlands",
    description:
      "Check-in tại 3 cửa hàng Highlands Coffee bất kỳ để nhận ngay 1000 điểm thưởng.",
    image:
      "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=800",
    rewardPoints: 1000,
    endDate: "2026-03-20",
    status: "active",
    participants: 840,
  },
  {
    id: "3",
    title: "Đua Top Tích Điểm Tháng 3",
    description:
      "10 người có số điểm cao nhất tháng sẽ nhận phần quà đặc biệt từ Zalo Mini App.",
    image:
      "https://images.unsplash.com/photo-1513116894289-5301937e5c5a?auto=format&fit=crop&q=80&w=800",
    rewardPoints: 5000,
    endDate: "2026-03-31",
    status: "active",
    participants: 3200,
  },
];

export const selectedCampaignIdAtom = atom<string | null>(null);
