const puppeteer = require("puppeteer");
const _ = require("lodash");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome-stable",
    headless: false
  });

  const params = { version: "gold", position: "LM,LW,LF" };
  let playersByClub = await searchPlayers(params);

  console.log(
    _.reduce(
      playersByClub,
      (result, value, key) => {
        if (value.length >= 2) {
          result[key] = value;
        }
        return result;
      },
      {}
    )
  );

  await browser.close();

  async function searchPlayers(params) {
    let playersByClub = {};
    const base_url = "https://www.futbin.com/20/players?page=";
    const page = await browser.newPage();
    await page.authenticate({
      username: "gustavo.mendonca",
      password: "Gmrb1808gmrb!3"
    });
    for (let i = 1; i < 7; i++) {
      await page.goto(
        base_url +
          i +
          _.reduce(
            params,
            (result, value, key) => result + "&" + key + "=" + value,
            "&"
          )
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
    return playersByClub;
  }
})();
