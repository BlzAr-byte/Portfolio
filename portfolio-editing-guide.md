# Your Portfolio Site: Editing and Deployment Guide

This project runs on React, TypeScript, Vite, and Tailwind. That setup gives you fast development and a small final bundle, but it also means you can't just open `index.html` in a browser. This guide covers running the site locally, editing your content, and putting it live on GitHub Pages.

## Why index.html Won't Open on Its Own

Your `index.html` loads `/src/main.tsx` as a module. That file is TypeScript with JSX in it, and browsers can't read that format directly. Vite converts it into plain JavaScript when you run the dev server or build the project. Until that happens, opening the file just gives you a blank page.

## Step 1: Install What You Need

You need Node.js installed on your computer. Grab the LTS version from nodejs.org if you don't have it already. Check your version in a terminal with this command.

```
node -v
```

Anything at version 18 or higher works fine.

## Step 2: Install the Project Dependencies

Open a terminal, move into your project folder, and run this command once.

```
npm install
```

This reads `package.json` and downloads every library the project needs into a `node_modules` folder.

## Step 3: Run the Site Locally

Start the dev server with this command.

```
npm run dev
```

Your terminal shows a local address, usually something like `http://localhost:5173`. Open that link in your browser and you'll see the actual site. The dev server watches your files, so any edit you save shows up right away without a restart.

## Step 4: Find the Missing Component Files

Your `App.tsx` imports several files that weren't included in your upload.

```
./components/Boot
./components/Hud
./components/PauseMenu
./components/Pixel
./lib/game
./three/HouseScene
```

These need to exist inside a `src` folder next to `App.tsx` and `main.tsx`, organized like this.

```
src/
  App.tsx
  main.tsx
  index.css
  components/
    Boot.tsx
    Hud.tsx
    PauseMenu.tsx
    Pixel.tsx
  lib/
    game.ts
  three/
    HouseScene.tsx
```

If any of these are missing, the dev server throws an error telling you exactly which import failed. Grab the file from wherever you originally saved it and drop it into the matching folder.

## Step 5: Edit Your Content

Everything personal to you lives near the top of `App.tsx`, before any of the page layout starts.

**Your name, email, and links.** Look for the `PROFILE` object. Change the values there and every place they appear on the site updates automatically, including your email button, GitHub link, and footer.

**Your projects.** Look for the `PROJECTS` array. Each entry has an id, a code label, a title, a description, and a list of technologies. Add a new entry to add a new project card, or edit the text in place to update one.

**Your skill bars.** Look for the `STATS` array. Each entry has a label, a percentage value, and a color class. Change the number to move the bar.

**Your toolbox chips.** Look for the `TOOLBOX` array. It's a plain list of strings. Add or remove items freely.

**Colors and fonts.** Open `index.css` and look at the `@theme` block near the top. Every color used across the site is defined there as a variable, so changing one value updates it everywhere that color gets used.

**Page text.** Section headings, paragraphs, and section order all live further down in `App.tsx`, inside the `return` statement of the `App` function. Search for the text you want to change and edit it directly.

After any edit, save the file and check your browser tab running the dev server. It updates on its own.

## Step 6: Build for Production

Once you're happy with the site, create the optimized version with this command.

```
npm run build
```

This outputs a `dist` folder containing your finished site as plain HTML, CSS, and JavaScript. Because this project uses the single file plugin, most of the site compiles into one HTML file inside that folder.

## Step 7: Put It on GitHub Pages

GitHub Pages gives you a free link that looks like `https://yourusername.github.io/your-repo-name`.

1. Create a new repository on GitHub and push your project code to it.
2. Open `vite.config.ts` and add a `base` option matching your repo name, so links inside the built site point to the right place.

```
export default defineConfig({
  base: "/your-repo-name/",
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
```

3. Install the `gh-pages` package as a dev dependency.

```
npm install gh-pages --save-dev
```

4. Add two scripts to `package.json`, inside the `scripts` section.

```
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

5. Run the deploy command.

```
npm run deploy
```

This builds the project and pushes the `dist` folder to a branch called `gh-pages` on your repository.

6. On GitHub, go to your repository settings, open the Pages section, and set the source to the `gh-pages` branch.

Give it a minute or two, then visit `https://yourusername.github.io/your-repo-name` to see your live site. Every time you want to update the live version after making edits, just run `npm run deploy` again.

## Quick Reference

| Task | Command |
|---|---|
| Install dependencies | `npm install` |
| Run locally | `npm run dev` |
| Build for production | `npm run build` |
| Deploy to GitHub Pages | `npm run deploy` |
