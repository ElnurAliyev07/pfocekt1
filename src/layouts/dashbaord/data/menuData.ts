import React from 'react';
import File from "@/layouts/dashbaord/components/icons/File";
import Job from "@/layouts/dashbaord/components/icons/Job";
import Overview from "@/layouts/dashbaord/components/icons/Overview";
import CurrentSituation from "../components/icons/CurrentSituation";
import Workspace from "../components/icons/Workspace";
// import Project from "../components/icons/Project";
// import Task from "../components/icons/Task";
import Paket from "../components/icons/Paket";
import Rating from "../components/icons/Rating";
import Document from "../components/icons/Document";
import Image from "../components/icons/Image";
import Audio from "../components/icons/Audio";
import Video from "../components/icons/Video";
import Message from "../components/icons/Message";
import Wallet from "../components/icons/Wallet";
import Salary from "../components/icons/Salary";
import Attendance from "../components/icons/Attendance";
import Kpi from "../components/icons/Kpi";
import Cv from "../components/icons/Cv";
import Setting from "../components/icons/Setting";
import Project from "../components/icons/Project";
import Task from "../components/icons/Task";
import Reserve from '../components/icons/Reserve';

// Icon tipini güncelleyelim
type IconComponent = (props: { [key: string]: unknown }) => React.ReactNode;

export interface SubmenuItem {
  title: string;
  href: string;
  icon: IconComponent;
  size?: string;
  isDisabled?: boolean;
}

export interface MenuItem {
  title: string;
  icon: IconComponent;
  submenu: SubmenuItem[] | null;
  gap: boolean;
  href: string | null;
  size?: string;
  isDisabled?: boolean;
}

// Menüler
export const Menus: MenuItem[] = [
  {
    title: "İdarə Paneli",
    icon: Overview,
    submenu: null,
    gap: false,
    href: "/dashboard",
  },
  {
    title: "Cari Durum",
    icon: CurrentSituation,
    submenu: null,
    gap: false,
    href: "/dashboard/statistic",
    isDisabled: false
  },
  {
    title: "İş axını",
    icon: Job,
    submenu: [
      {
        title: "Virtual ofislər",
        href: "/dashboard/workspaces",
        icon: Workspace,
      },
      {
        title: "Proyektlər",
        href: "/dashboard/projects",
        icon: Project,
        isDisabled: true
      },
      {
        title: "Tasklar",
        href: "/dashboard/tasks",
        icon: Task,
        isDisabled: true

      },
    ],
    gap: false,
    href: null,
  },
  {
    title: "Reservlər",
    icon: Reserve,
    submenu: null,
    gap: false,
    href: "/dashboard/reserves",
  },
  {
    title: "Paketlər",
    icon: Paket,
    submenu: null,
    gap: false,
    href: "/dashboard/packages",
  },
  {
    title: "Reytinq",
    icon: Rating,
    submenu: null,
    gap: false,
    href: "/dashboard/rating",
    isDisabled: false
  },
  {
    title: "Fayllar",
    icon: File,
    submenu: [
      {
        title: "Sənədlər",
        href: "/dashboard/files/documents",
        icon: Document,
      },
      {
        title: "Şəkillər",
        href: "/dashboard/files/pictures",
        icon: Image,
      },
      {
        title: "Audiolar",
        href: "/dashboard/files/audios",
        icon: Audio,
      },
      {
        title: "Videolar",
        href: "/dashboard/files/videos",
        icon: Video,
      },
    ],
    gap: false,
    href: null,
  },
  {
    title: "Mesajlar",
    icon: Message,
    submenu: null,
    gap: false,
    href: "/dashboard/chat",
    isDisabled: true

  },
  {
    title: "Cüzdan",
    icon: Wallet,
    submenu: null,
    gap: false,
    href: "/dashboard/wallet",
    isDisabled: false

  },
  {
    title: "Əməkhaqqı",
    icon: Salary,
    submenu: null,
    gap: false,
    href: "/dashboard/salary",
    isDisabled: true
  },
  {
    title: "Davamiyyət",
    icon: Attendance,
    submenu: null,
    gap: false,
    href: "/dashboard/attendance",
    isDisabled: true
  },
  {
    title: "İcazələr",
    icon: Document,
    submenu: null,
    gap: false,
    href: "/dashboard/permits",
    isDisabled: true
  },
  {
    title: "KPİ",
    icon: Kpi,
    submenu: null,
    gap: false,
    href: "/dashboard/kpi",
    isDisabled: false
  },
  {
    title: "Online CV",
    icon: Cv,
    submenu: null,
    gap: false,
    href: "/dashboard/online",
    isDisabled: true
  },
  {
    title: "Ayarlar",
    icon: Setting,
    submenu: null,
    gap: false,
    href: "/dashboard/settings/profile",
  },
];
