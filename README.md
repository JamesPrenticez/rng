<!-- ![logo](apps/website/frontend/public/favicon.ico) -->

# 🌊🌊🌊 Buildflo 🌊🌊🌊

👷👷👷

## 🔨 Get Started

Go to _initial setup_ if you havn't already.

TODO serve apps on different ports
TODO husky

```bash
git clone https://github.com/buildflo/web-services.git
```

```bash
cd web-services
npm i
```

### 🚀 Website

```bash
npm run website

http://localhost:4200/
```

### 🏗️ Lobby

```bash
npm run lobby
http://localhost:4200/ frontend
http://localhost:5000/ backend
```

## 🚧 Making Changes

🛑🛑🛑 <b style="color:red">NEVER PUSH TO MASTER UNLESS YOU WANT TRIGGER A DEPLOYMENT!!!</b> 🛑🛑🛑

```bash
git checkout master (your probably already here)
git pull origin master (get the latest changes)
git checkout -B your-branch-name (make your own branch and go hard)
```

Make your changes then:

```bash
nx format:write
```

Commit, Stage, Push

```bash
git add -A
git commit -m"feature | style | chore - path/to/what/you/changed - your meaningful description"
git push origin your-banch-name
```

### Initial Setup

Install:

- **_VSCode_**
  - Extensions:
    - Prettier - Code formatter
    - ESLint
    - IntelliSense for CSS class names (might need the SCSS one aswell?)
    - vscode-styled-components
    - JavaScript (ES6) code snippets
    - Simple React Snippets (if your working in React...)
    - markdown all in one
    - Svg Preview
    - color info
    - Todo Tree (highlights TODO comments in the codebase green)
    - Prisma (if your working on the database)
    - SQLite (if your working on the DB)
- **_Node.js_** (version 20.x.LTS)
- **_bash_** terminal (Congratz! Setup complete! return the Get Started and type those command in your new shiny terminal)

### Extra Terminal Commands

```bash
mkdir (make directory)
cd (change directories)
cd .. (go backwards)
cd ../.. (more backwards)
cd ~ (root dir)
ls (list files in dir)
touch (well you get the idea...)
```

### VSCode

# There are a few handy shortcut keys

- ctrl + j = open and close the terminal (have play here on the right hand side you can + and spawn new terminals like a powershell)
- ctrl + b = open and close the left nav
- ctrl + k + c = comment out <!-- this code wont do anything -->
- ctrl + k + u = uncomment
- alt + arrow right/left = takes you back in time to the file where you cursor last was

# Here are some gottchyas

clicking on a file once will only _temp_ open it you gotta click twice or click on it up in the tabs accross the top to keep it open.
you can click and drag the tabs and smash them to the right for split screen

### 💎 mprocs

This little gem is what you see in the terminal after spinning up and app, so neat and tidy.

There are a few commands you can see down the bottom **_Q_** being the only only you really need.

You can also move up and down the apps on the left with the arrow keys and **_S_** if its not running.

### Resources

[markdown cheatsheet](https://www.markdownguide.org/cheat-sheet/)

[emojis](https://emojicopy.com/)

---

🐳🐋🐬🐟🐠🐡🦀🦞🦐🦑🐙🐍🐢
