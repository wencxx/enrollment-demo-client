import { format, parse } from "date-fns";

export const formatTime = (time: string): string => {
    if (!time) return "";

    try {
        const parsed = parse(time, "HH:mm:ss", new Date());
        return format(parsed, "h:mm a");
    } catch (error) {
        console.error("Error formatting time:", time, error);
        return time;
    }
};
