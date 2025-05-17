import { Settings, BookOpen, Calendar, MessageSquare, User, Folder, BarChart, Clock, Star, LogOut, Home } from "lucide-react";

export const Icons = {
  settings: Settings,
  courses: BookOpen,
  calendar: Calendar,
  messages: MessageSquare,
  profile: User,
  folder: Folder,
  stats: BarChart,
  schedule: Clock,
  star: Star,
  logout: LogOut,
  home: Home,
};

// Vietnamese subject category icons
export const CategoryIcons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  mathematics: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5z"/>
      <path d="M9 12h6"/>
      <path d="M12 9v6"/>
    </svg>
  ),
  languages: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 12h20"/>
      <path d="M12 2v20"/>
      <path d="m4.93 4.93 4.24 4.24"/>
      <path d="m14.83 14.83 4.24 4.24"/>
      <path d="m14.83 9.17-4.24 4.24"/>
      <path d="m4.93 19.07 4.24-4.24"/>
    </svg>
  ),
  programming: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  music: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="16" r="3"/>
    </svg>
  ),
  science: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 3h6v11h4l-7 7-7-7h4V3z"/>
    </svg>
  ),
  art: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="13.5" cy="6.5" r=".5"/>
      <circle cx="17.5" cy="10.5" r=".5"/>
      <circle cx="8.5" cy="7.5" r=".5"/>
      <circle cx="6.5" cy="12.5" r=".5"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.828-.139 2.679-.39L12 14l7.5-7.5c.251-.851.39-1.753.39-2.679C19.962 7.364 21 9.6 21 12a9 9 0 0 1-9 9h0a9 9 0 0 1-9-9h0a9 9 0 0 1 9-9Z"/>
    </svg>
  ),
};

// Vietnamese cultural icons
export const CulturalIcons = {
  lotus: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2c3 3 3 9 0 12 3-3 9-3 12 0-3-3-3-9 0-12-3 3-9 3-12 0ZM12 17c-3-3-3-9 0-12-3 3-9 3-12 0 3 3 3 9 0 12 3-3 9-3 12 0Z"/>
      <path d="M12 5v6"/>
      <path d="M12 13v8"/>
    </svg>
  ),
  bronzeDrum: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
      <path d="M12 2v2"/>
      <path d="M12 20v2"/>
      <path d="m2 12 2 0"/>
      <path d="m20 12 2 0"/>
      <path d="m4.93 4.93 1.41 1.41"/>
      <path d="m17.66 17.66 1.41 1.41"/>
      <path d="m19.07 4.93-1.41 1.41"/>
      <path d="m6.34 17.66-1.41 1.41"/>
    </svg>
  ),
};
