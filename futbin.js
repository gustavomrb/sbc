const puppeteer = require("puppeteer");
const _ = require("lodash");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome-stable",
    headless: false
  });
  const page = await browser.newPage();
  let playersByClub = {};
  for (let i = 1; i < 7; i++) {
    await page.goto(
      "https://www.futbin.com/20/players?page=" +
        i +
        "&position=LM,LW,LF&version=gold"
    );
    let names = await page.$$eval(".player_name_players_table", namesNodes =>
      namesNodes.map(n => n.innerText)
    );
    let clubs = await page.$$eval(
      ".players_club_nation > a:first-child",
      clubsNodes => clubsNodes.map(n => n.dataset["originalTitle"])
    );
    for (let j = 0; j < names.length; j++) {
      if (playersByClub[clubs[j]] == null) {
        playersByClub[clubs[j]] = [names[j]];
      } else {
        playersByClub[clubs[j]].push(names[j]);
      }
    }
  }

  console.log(_.filter(playersByClub, c => c.length >= 2));

  await browser.close();
})();
