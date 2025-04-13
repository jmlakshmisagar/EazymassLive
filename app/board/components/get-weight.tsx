"use client"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"

export function GetWeight() {
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date>()
    const [weight, setWeight] = useState(['', '', '', ''])

    const handleWeightChange = (index: number, value: string) => {
        const newWeight = [...weight]
        newWeight[index] = value
        setWeight(newWeight)
    }

    const handleSave = () => {
        const weightValue = weight.join('')
        console.log('Date:', date)
        console.log('Weight:', weightValue)
        setOpen(false)
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline">Record Weight</Button>
            </DrawerTrigger>
            <DrawerContent className="p-4">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Record Your Weight</h3>
                    
                    <div className="space-y-2">
                        <Label>Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : "Pick a date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label>Weight (kg)</Label>
                        <div className="flex gap-2">
                            {[0, 1, 2, 3].map((index) => (
                                <Input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    className="w-12 text-center"
                                    value={weight[index]}
                                    onChange={(e) => handleWeightChange(index, e.target.value)}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save</Button>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}