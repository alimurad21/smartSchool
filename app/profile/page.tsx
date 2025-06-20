import { UserProfile } from "@/components/auth/user-profile";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function ProfilePage() {
  return (
    <>
      <UserProfile />
    </>
  );
}
