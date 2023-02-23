var { Timetable } = require('../lib/index.js');

var timetable = new Timetable("https://eleves.groupe3il.fr/edt_eleves/00_index.php?idGroupe=CPI1%20Groupe%201.xml");

(async () => {
    await timetable.create_weeks();
    console.log(timetable.weeks[0]);
})();