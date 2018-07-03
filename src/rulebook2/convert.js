const fs = require('fs');
const cheerio = require('cheerio');

fs.readFile('src/rulebook2/HE2E/SKLS.html', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    const sheet = cheerio.load(data);

    const skills = [];

    sheet('table tbody').find('td.s27').each((index, sheetTd) => {
        skills.push({
            name: sheet(sheetTd).text(),
            characteristic: sheet(sheetTd.parent.next.next).find('td.s32').first().text(),
            apptitudes: [
                sheet(sheetTd.parent.next.next.next.next).find('td.s34').first().text(),
                sheet(sheetTd.parent.next.next.next.next.next).find('td.s34').first().text(),
            ]
        });
    });

    console.log(JSON.stringify(skills));
});