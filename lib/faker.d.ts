export declare class Timetable {
    link_edt: string;
    full_timetable: string[];
    timetable_len: number;
    weeks: any;
    week_numbers: string[];
    week_years: string[];
    week_dates: any;
    week_rooms: any;
    last_update: string;
    constructor(link_edt: any);
    fetch_full_timetable(): Promise<void>;
    fetch_week_data(): Promise<void>;
    fetch_week_dates(): Promise<void>;
    fetch_week_rooms(): Promise<void>;
    init_timetable(): Promise<void>;
    create_weeks(): Promise<void>;
}
