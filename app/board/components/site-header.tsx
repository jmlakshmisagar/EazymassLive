import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { User } from "firebase/auth"

interface SiteHeaderProps {
  userDetails: User | null
}

export function SiteHeader({ userDetails }: SiteHeaderProps) {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Documents</h1>
        <div className="flex items-center gap-2 ml-auto">
          {userDetails?.photoURL && (
            <img 
              src={userDetails.photoURL} 
              alt={userDetails.displayName || "User"} 
              className="w-8 h-8 rounded-full"
            />
          )}
          <span>{userDetails?.displayName}</span>
        </div>
      </div>
    </header>
  )
}
