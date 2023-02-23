# 3iL EDT
This tool allow you to retrieve schedules of 3iL EDT.

The project consists of representing the timetable of a school, 3iL Ingénieurs, using objects that contain information about the courses and classrooms for each day of the week. The data is stored in a structured and easily accessible format, making it easy to integrate into your development projects.

[Link to npm package](https://www.npmjs.com/package/3il_edt)

## Installation
To use this library you must __install__ it into your Node JS project.

Install the library this way :
```console
npm i 3il_edt
```
## Use
Use like that :
```javascript
var { Timetable } = require('3il_edt');

(async () => {
    var link_edt = "https://eleves.groupe3il.fr/edt_eleves/00_index.php?idGroupe=CPI1%20Groupe%201.xml" //put your own class link

    var timetable = new Timetable(link_edt)
    await timetable.create_weeks()

    console.log(myTimetable.weeks[0]);
})();
```

You will get a scheme like this of a single week :

```javascript
Week {
    number: '04',
    year: '23',
    last_update: 'MAJ le : 23/01/23 à 15:36:28',
    raw_dates: [
        '23-01-2023',
        '24-01-2023',
        '25-01-2023',
        '26-01-2023',
        '27-01-2023'
    ],
    daily_timetable: [ [Array], [Array], [Array], [Array], [Array] ],
    daily_rooms: [ [Array], [Array], [Array], [Array], [Array] ],
    iso_dates: [
        2023-01-22T23:00:00.000Z,
        2023-01-23T23:00:00.000Z,
        2023-01-24T23:00:00.000Z,
        2023-01-25T23:00:00.000Z,
        2023-01-26T23:00:00.000Z
    ]
}
```

## Build With
This tool was built with the libraries __Cheerio__ (web-scrapping library) and __Fetch__.

## Project : [3iL EDT Project]()
- [3iL EDT API]()
