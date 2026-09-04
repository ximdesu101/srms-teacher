import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { UserPen,ChevronDownIcon } from "lucide-react"
import { format } from "date-fns"
import { input_class, icon_class } from "@/components/common/constant"

const AddRequestForm = () => {
    const [date, setDate] = useState(undefined);
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    Create Request
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Document Request</DialogTitle>
                    <DialogDescription>
                        Fill up
                    </DialogDescription>
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Document</FieldLabel>
                            <div className="relative">
                                <div className={icon_class}><UserPen className="w-4.5 h-4.5" /></div>
                                <Select>
                                    <SelectTrigger className={input_class}>
                                        <SelectValue placeholder="Select Document" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectGroup>
                                            <SelectItem value="SF1">SF 1 - School Register</SelectItem>
                                            <SelectItem value="SF2">SF 2 - Daily Attendance Report of Learners</SelectItem>
                                            <SelectItem value="SF3">SF 3 - Books Issued and Returned</SelectItem>
                                            <SelectItem value="SF4">SF 4 - Monthly Learner's Movement and Attendance</SelectItem>
                                            <SelectItem value="SF5">SF 5 - Report on Promotion and Level of Proficiency</SelectItem>
                                            <SelectItem value="SF6">SF 6 - Summarized Report on Promotion and Level of Proficiency</SelectItem>
                                            <SelectItem value="SF7">SF 7 - School Personnel Assignment and Profile</SelectItem>
                                            <SelectItem value="SF8">SF 8 - Learner Basic Health and Nutrition Profile</SelectItem>
                                            <SelectItem value="SF9">SF 9 - Learner Progress Report Card</SelectItem>
                                            <SelectItem value="SF10">SF 10 - Learner's Permanent Academic Record</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </Field>
                        <Field>
                            <FieldLabel>Purpose</FieldLabel>
                            <InputGroup>
                                <InputGroupTextarea
                                    id="purpose"
                                    placeholder="Write your purpose..."
                                    required
                                />
                                <InputGroupAddon align="block-end">
                                    <InputGroupText className="text-xs text-muted-foreground ml-auto">
                                        0/300
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                        </Field>
                        <Field>
                            <FieldLabel>Due Date</FieldLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        data-empty={!date}
                                        className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                                    >
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        defaultMonth={date}
                                    />
                                </PopoverContent>
                            </Popover>
                        </Field>
                    </FieldGroup>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default AddRequestForm