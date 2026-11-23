# Hameed's Arcade

A small static website with three playable games: Memory Match, Tic-Tac-Toe (two people on one screen), and Quick Reflex. Built with HTML, CSS, and JavaScript. No API keys, account, backend, or build step required.

## How the website works

- `index.html` supplies the content, links, and game dialog.
- `style.css` supplies colors, typography, illustrations, and mobile layouts.
- `app.js` responds to clicks and manages each game.
- `engine.js` contains the reusable game rules.
- Personal bests are saved only in the current browser using localStorage.
- Google Fonts is optional; system fonts are used if the font service is unavailable.

## Run locally

Install Node.js, open a terminal in this folder, and run:

```sh
npm start
```

Open http://127.0.0.1:4173. Run the game-rule tests with `npm test`. There are no packages to install.

## Publish with GitHub Pages

1. Push these files to the repository's `main` branch.
2. Open the repository on GitHub → **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select **main** and **/(root)**, then **Save**.
5. Open https://hameed-kurla.github.io/game/ once the Pages deployment finishes.

The `.nojekyll` file tells GitHub to serve these static files directly. All asset URLs are relative (`./style.css`), so they work under the `/game/` project path.

## Your first learning exercise

Change the big headline in `index.html`, preview it, and then commit and push:

```sh
git add index.html
git commit -m "Personalize the arcade headline"
git push origin main
```

A **repository** holds your files and their history. A **commit** is a named snapshot of changes. A **push** uploads your commits. **GitHub Pages** publishes the files from your selected branch and folder. Future pushes to that source automatically update the website.

Official guide: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Add another game

Add a card in `index.html` with a unique `data-game` value. Create a game function in `app.js` using `prepare()` and register it in the `games` object. If the game starts timers or attaches global listeners, release them in `cleanup` so closing the dialog stops the game.
