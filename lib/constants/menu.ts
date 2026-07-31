import {
  Home,
  Users,
  Briefcase,
  MessageCircle,
  Bell,
  Settings,
  UserCircle,
  Award,
  FileText,
  Clock,
  Plus,
} from "lucide-react";
export const navbarItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "My Network", href: "/network", icon: Users },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Messaging", href: "/messages", icon: MessageCircle },
  { name: "Notifications", href: "/notifications", icon: Bell },
];
export const businessTools = [
  { name: "Post a job", icon: Plus, href: "/jobs/post" },
  { name: "Advertise", icon: FileText, href: "/advertise" },
  { name: "Analytics", icon: Clock, href: "/analytics" },
];
export const profileMenu = [
  { name: "Profile", icon: UserCircle, href: "/profile" },
  { name: "Settings & Privacy", icon: Settings, href: "/settings" },
  { name: "Try Premium", icon: Award, href: "/premium" },
  { name: "Help", icon: FileText, href: "/help" },
];
