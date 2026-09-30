export type SystemTool = { slug: string; name: string };

export type System = {
  slug: string;
  position: number;
  name: string;
  shortName: string;
  displayTop: string;
  displayBottom: string;
  summary: string;
  setupPrice: string;
  monthlyPrice: string | null;
  badge: string | null;
  accent: string;
  artBg: string;
  flow: string[];
  outcomes: string[];
  tools: SystemTool[];
};

export type Integration = {
  slug: string;
  name: string;
  category: string;
  description: string;
  usedIn: { slug: string; name: string }[];
};

export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type LeadStatus = 'new' | 'contacted' | 'booked' | 'won' | 'lost';

export type Lead = {
  id: string;
  name: string;
  email: string;
  agency: string;
  website: string | null;
  teamSize: string;
  interest: string;
  message: string | null;
  status: LeadStatus;
  createdAt: string;
};
