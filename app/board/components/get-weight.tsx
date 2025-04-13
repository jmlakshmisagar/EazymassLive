"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { userService } from "../services/user.service"
import { toast } from "sonner"

interface GetWeightProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
}

export function GetWeight({ open, onOpenChange, userId }: GetWeightProps) {
  const [date, setDate] = useState<Date>()
  const [weight, setWeight] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!date || !weight) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      setIsLoading(true)
      await userService.addWeightEntry({
        date,
        weight: parseFloat(`${weight.slice(0, 2)}.${weight.slice(2)}`),
        userId
      })
      
      toast.success("Weight recorded successfully")
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving weight:', error)
      toast.error("Failed to save weight")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-center">
          <DrawerTitle>Record Your Weight</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 flex items-center justify-center min-h-[40vh]">
          <div className="flex flex-col items-center space-y-2 w-full max-w-sm">
            {/* Date picker */}
            <div className="w-full space-y-4">
              <Label className="text-center block text-lg font-medium">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-center text-center font-normal py-6",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-2 w-2" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Weight input */}
            <div className="w-full space-y-4">
              <Label className="text-center block text-lg font-medium">Weight</Label>
              <div className="flex justify-center">
                <InputOTP 
                  maxLength={4} 
                  value={weight} 
                  onChange={(value) => setWeight(value)}
                  placeholder="0000"
                  className="scale-110"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator>.</InputOTPSeparator>
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div className="text-center text-sm text-muted-foreground mt-4 flex justify-center gap-8">
                <span>Kilos</span>
                <span>Grams</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-6 justify-center w-full pt-4">
              <DrawerClose asChild>
                <Button variant="outline" className="w-28">Cancel</Button>
              </DrawerClose>
              <Button onClick={handleSave} className="w-28" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}