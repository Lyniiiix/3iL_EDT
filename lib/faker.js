"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timetable = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const cheerio_1 = __importDefault(require("cheerio"));
//Timetable instance -> all weeks in http://eleves.groupe3il.fr/edt_eleves/00_index.php /your_class
class Timetable {
    constructor(link_edt) {
        this.link_edt = link_edt; //:str -> EDT link
        this.full_timetable = []; //:array -> weeks timetable
        this.timetable_len = 0; //:int -> N° weeks
        this.weeks; //:array -> instances of class Week
        this.week_numbers = []; //:array -> N° ISO 8601 of weeks
        this.week_years = []; //:array -> {YY} years of weeks
        this.week_dates; //:array -> dates of week days
        this.week_rooms; //:array -> rooms
        this.last_update = ""; //:str -> last update date
        this.init_timetable(); //:method async -> fetch EDT
        this.create_weeks(); //:method async -> init instances of Week
    }
    //
    fetch_full_timetable() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, node_fetch_1.default)(this.link_edt)
                .then((res) => {
                return res.text();
            })
                .then(html => {
                const $ = cheerio_1.default.load(html);
                var tab = [];
                $(".activite-titre", html).each(function () {
                    tab.push($(this).text());
                });
                this.full_timetable = tab;
            });
        });
    }
    fetch_week_data() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, node_fetch_1.default)(this.link_edt)
                .then(res => {
                return res.text();
            })
                .then(html => {
                const $ = cheerio_1.default.load(html);
                var tab_years = [];
                var tab_numbers = [];
                $("h1", html).each(function () {
                    var header = $(this).text();
                    header = header.split(": ");
                    header = header[1]; // {YY/WW}
                    header = header.split('/');
                    var year = header[0]; // year of week
                    var week_number = header[1]; // N° of week
                    tab_years.push(year);
                    tab_numbers.push(week_number);
                });
                this.week_numbers = tab_numbers;
                this.week_years = tab_years;
                this.timetable_len = $("h1").length; // amount of week in timetable
                const texte = $('.navbar-right').find('a').eq(0).contents().filter(function () { return this.nodeType === 3; }).text().trim();
                this.last_update = texte; //$('.navbar-right').find('a')[0].children[0].data // last update date
            });
        });
    }
    fetch_week_dates() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, node_fetch_1.default)(this.link_edt)
                .then(res => {
                return res.text();
            })
                .then(html => {
                const $ = cheerio_1.default.load(html);
                var tab_week_dates = Array.from({ length: this.timetable_len }, () => []);
                var temp_count_start = 0;
                var temp_count_end = 5;
                for (var x = 0; x < this.timetable_len; x++) {
                    for (var i = temp_count_start; i < temp_count_end; i++) {
                        try {
                            var date_first_day = $(".col-sm-2")[i].attribs.id.split("date-");
                        }
                        catch (e) {
                            date_first_day = ["null", "null"];
                        }
                        tab_week_dates[x].push(date_first_day[1]); // date in format ISO standard -> {DD-MM-YYYY}
                    }
                    temp_count_start += 5;
                    temp_count_end += 5;
                }
                this.week_dates = tab_week_dates;
            });
        });
    }
    fetch_week_rooms() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, node_fetch_1.default)(this.link_edt)
                .then(res => {
                return res.text();
            })
                .then(html => {
                const $ = cheerio_1.default.load(html);
                var tab_rooms = Array.from({ length: this.timetable_len }, () => []);
                var index_start = 0;
                var index_end = 60;
                for (var x = 0; x < this.timetable_len; x++) {
                    for (var i = index_start; i < index_end; i++) {
                        if (i % 2 != 0) {
                            try {
                                const TextNode = $('.edt-data')[i].childNodes[0];
                                tab_rooms[x].push(TextNode.data.trim());
                            }
                            catch (e) {
                                tab_rooms[x].push('');
                            }
                        }
                    }
                    index_start += 60;
                    index_end += 60;
                }
                var flatted = tab_rooms.flat();
                this.week_rooms = flatted;
            });
        });
    }
    //
    init_timetable() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.fetch_full_timetable(); //:method async -> fetch EDT
            yield this.fetch_week_data(); //:method async -> fetch data
            yield this.fetch_week_dates(); //:method async -> fetch dates
            yield this.fetch_week_rooms(); //:method async -> fetch rooms
        });
    }
    create_weeks() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.init_timetable();
            // set as matrice 5 / 6 - timetable daily
            var temp_weeks_timetable = Array.from({ length: this.timetable_len }, () => []);
            var index_start = 0;
            var index_end = 30;
            for (var i = 0; i < this.timetable_len; i++) {
                for (var j = index_start; j < index_end; j++) {
                    temp_weeks_timetable[i].push(this.full_timetable[j]);
                }
                const perChunk = 6;
                const inputArray = temp_weeks_timetable[i];
                const result = inputArray.reduce((resultArray, item, index) => {
                    const chunkIndex = Math.floor(index / perChunk);
                    if (!resultArray[chunkIndex]) {
                        resultArray[chunkIndex] = [];
                    }
                    resultArray[chunkIndex].push(item);
                    return resultArray;
                }, []);
                temp_weeks_timetable[i] = result;
                index_end += 30;
                index_start += 30;
            }
            // set as matrice 5 / 6 - rooms daily
            var temp_weeks_rooms = Array.from({ length: this.timetable_len }, () => []);
            var index_start = 0;
            var index_end = 30;
            for (var i = 0; i < this.timetable_len; i++) {
                for (var j = index_start; j < index_end; j++) {
                    temp_weeks_rooms[i].push(this.week_rooms[j]);
                }
                const perChunk = 6;
                const inputArray = temp_weeks_rooms[i];
                const result = inputArray.reduce((resultArray, item, index) => {
                    const chunkIndex = Math.floor(index / perChunk);
                    if (!resultArray[chunkIndex]) {
                        resultArray[chunkIndex] = [];
                    }
                    resultArray[chunkIndex].push(item);
                    return resultArray;
                }, []);
                temp_weeks_rooms[i] = result;
                index_end += 30;
                index_start += 30;
            }
            var temp_weeks = [];
            for (var x = 0; x < this.timetable_len; x++) {
                var week = new Week(this.week_numbers[x], this.week_years[x], this.last_update, temp_weeks_timetable[x], this.week_dates[x], temp_weeks_rooms[x]);
                temp_weeks.push(week);
            }
            this.weeks = temp_weeks;
        });
    }
}
exports.Timetable = Timetable;
//instance of Week -> a week of Timetable
class Week {
    constructor(number, year, last_update, week_timetable, week_dates, week_rooms) {
        this.number = number; //:int -> N°
        this.year = year; //:int {YY} -> year
        this.last_update = last_update; //:str -> last update date
        this.raw_dates = week_dates; //:array -> days date
        this.daily_timetable = week_timetable; //:array -> daily timetable
        this.daily_rooms = week_rooms; //:array -> daily rooms
        this.iso_dates; //:array -> ISO 8601 dates
        this.daily_hours; //:array -> daily hours
        this.set_date_format(); //:method -> set dates format from local to ISO 8601
    }
    set_date_format() {
        var tab_dates = [];
        for (var x = 0; x < 5; x++) {
            var date_raw = this.raw_dates[x].split('-');
            var date = new Date(Number(date_raw[2]), (Number(date_raw[1]) - 1), (Number(date_raw[0])));
            tab_dates.push(date);
        }
        this.iso_dates = tab_dates;
    }
}
