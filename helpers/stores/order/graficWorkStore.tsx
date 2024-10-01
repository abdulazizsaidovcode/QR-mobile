import {create} from "zustand";

interface ClaendarStoryDate {
    calendarDate: string,
    setCalendarDate: (val: string) => void;
}

const calenderStory = create<ClaendarStoryDate>((set) => ({
    calendarDate: '',
    setCalendarDate: (val: string) => set({calendarDate: val}),
}));

export default calenderStory;
