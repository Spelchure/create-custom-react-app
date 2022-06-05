# Custom Create React App Template

Creating custom react app template with JS. This project creates custom react
app with specific folder structure and pre installed packages. Uses typescript
cra template and installs **@reduxjs/toolkit,sass,react-router-dom,axios**

![](./CRA.png)

## <a name='Running'></a>Running

```sh
node index.js project-name
node index.js --help
```

### <a name='Runningtests'></a>Running tests

```sh
npm test
```

### <a name='Installation'></a>Installation

```sh
npm link
#create-custom-react-app --help
```

# Steps

- 1. [Creating Templates](#CreatingTemplates)
  - 1.1. [App.test.tsx - For testing App component.](#App.test.tsx-FortestingAppcomponent.)
  - 1.2. [App.tsx - App component.](#App.tsx-Appcomponent.)
  - 1.3. [index.scss - Main scss.](#index.scss-Mainscss.)
  - 1.4. [index.tsx - Creating react root.](#index.tsx-Creatingreactroot.)
  - 1.5. [store.ts - Configuring redux store.](#store.ts-Configuringreduxstore.)
- 2. [Adding Defaults to `defaults.js`](#AddingDefaultstodefaults.js)
- 3. [Creating Tasks for Operations (`tasks.js`)](#CreatingTasksforOperationstasks.js)
- 4. [Application Entry (`index.js`)](#ApplicationEntryindex.js)
- 5. [Adding Executable To `package.json`](#AddingExecutableTopackage.json)

## 1. <a name='CreatingTemplates'></a>Creating Templates

These template files should created under `templates/` directory.

### 1.1. <a name='App.test.tsx-FortestingAppcomponent.'></a>App.test.tsx - For testing App component.

```tsx
import { render, RenderOptions, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";

export const renderWithRedux = (
  ui: React.ReactElement,
  renderOptions?: RenderOptions
) => {
  // const store = configureStore({
  //   reducer: {
  //     /* Your Reducers */
  //   },
  // });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

describe("Application healty checks.", () => {
  test("renders h1 component.", () => {
    renderWithRedux(<App />);
    const myElement = screen.getByText(/Hello World/i);
    expect(myElement).toBeInTheDocument();
  });
});
```

### 1.2. <a name='App.tsx-Appcomponent.'></a>App.tsx - App component.

```tsx
import React from "react";

export default function App() {
  return <h1>Hello World</h1>;
}
```

### 1.3. <a name='index.scss-Mainscss.'></a>index.scss - Main scss.

```scss
*,
*::after,
*::before {
  box-sizing: inherit;
}

body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

### 1.4. <a name='index.tsx-Creatingreactroot.'></a>index.tsx - Creating react root.

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

### 1.5. <a name='store.ts-Configuringreduxstore.'></a>store.ts - Configuring redux store.

```ts
/**
 * Documentation
 */
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    /** Reducers */
    // counter: counterSlice,
  },
  /**  middleware: (getDefaultMiddleware)
   *    => getDefaultMiddleware().concat(logger),
   */
  devTools: process.env.NODE_ENV !== "production",
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## 2. <a name='AddingDefaultstodefaults.js'></a>Adding Defaults to `defaults.js`

```js
exports.packagesToInstall = {
  save: [
    "react-redux",
    "react-router-dom",
    "@reduxjs/toolkit",
    "axios",
    "sass",
  ],
  dev: [],
};

exports.filesToDelete = [
  "src/index.css",
  "src/logo.svg",
  "src/App.css",
  "public/logo192.png",
  "public/logo512.png",
  "src/reportWebVitals.ts",
];

exports.directoriesToCreate = [
  "src/components",
  "src/features",
  "src/styles/partials",
  "src/components",
  "src/contexts",
  "src/hooks",
  "src/pages",
  "src/services",
  "src/layouts",
  "src/utility",
];

//Path:TemplatePath
exports.filesToCopy = {
  "index.scss": "src/index.scss",
  "App.tsx": "src/App.tsx",
  "index.tsx": "src/index.tsx",
  "App.test.tsx": "src/App.test.tsx",
  "README.md": "README.md",
  "ChangeLog.md": "ChangeLog.md",
  "store.ts": "src/store.ts",
};
```

## 3. <a name='CreatingTasksforOperationstasks.js'></a>Creating Tasks for Operations (`tasks.js`)

```js
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

let dirPrefix = "";

exports.deleteFiles = async (fileList) => {
  let promises = [];
  console.log("[*] Deleting files...".cyan);
  for (let i = 0; i < fileList.length; i++) {
    let fpath = path.join(process.cwd(), dirPrefix, fileList[i]);
    await fs.promises
      .stat(fpath)
      .then((_) => {
        promises.push(fs.promises.unlink(fpath));
      })
      .catch((err) => {
        if (err.code !== "ENOENT") throw new Error(err);
      });
  }
  return Promise.all(promises);
};

//{file:destFile}
exports.copyFiles = (fileList) => {
  let promises = [];
  console.log("[*] Copying files...".cyan);
  Object.keys(fileList).forEach((key) => {
    let filePath = path.join(process.cwd(), dirPrefix, fileList[key]);
    let templateFilePath = path.join(__dirname, "templates", key);
    promises.push(fs.promises.copyFile(templateFilePath, filePath));
  });
  return Promise.all(promises).catch((error) => console.log("error: ", error));
};

exports.createDirectories = (directoryList) => {
  let promises = [];
  console.log("[*] Creating directories...".cyan);
  directoryList.forEach((directory) => {
    let newDirectoryLocation = path.join(process.cwd(), dirPrefix, directory);
    promises.push(fs.promises.mkdir(newDirectoryLocation, { recursive: true }));
  });
  return Promise.all(promises);
};

exports.createReactApp = (appName) => {
  return new Promise((resolve, reject) => {
    console.log("[*] Creating react app for: ".cyan, appName);
    exec(`npx create-react-app ${appName} --template typescript`, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

exports.installPackages = (packages) => {
  return new Promise((resolve, reject) => {
    console.log("[*] Installing required packages...".cyan);
    let command = `npm install --save ${packages.save.join(
      " "
    )} -D ${packages.dev.join(" ")}`;
    exec(command, { cwd: path.join(process.cwd(), dirPrefix) }, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

// Add your own tasks

exports.taskRunner = async (tasks) => {
  /**
   * { preTasks: [{method,args}], tasks:[], postTasks: []}
   */
  let taskCount = tasks.length;
  for (let i = 0; i < taskCount; i++) {
    await tasks[i].method(tasks[i].args);
  }
};

exports.initialize = (prefix) => (dirPrefix = prefix);
```

## 4. <a name='ApplicationEntryindex.js'></a>Application Entry (`index.js`)

```js
#!/usr/bin/env node

const packageJson = require("./package.json");
const defaults = require("./defaults");
const { program } = require("commander");
const colors = require("colors");
const tasks = require("./tasks");

program
  .name("create-custom-react-app")
  .description("Creates react application template with typescript redux")
  .version(packageJson.version);

program
  .argument("<project_name>", "Project name to created with cra.")
  .option("--with-mui", "Add material ui component library.", false)
  .option("--with-antd", "Add ant design component library", false)
  .option("-s, --show", "Show default packages to install")
  .option("-r, --remove", "Remove package from default installation list")
  .option(
    "-e, --extra-packages <packages...>",
    `Extra packages to install. 
(space seperated, add double colon dev as suffix for installing as a development 
dependency. For example: cypress::dev`
  );

program.parse();

let programOptions = program.opts();
let projectName = program.args[0];

if (programOptions.withMui) {
  defaults.packagesToInstall.save.push(
    "@emotion/react",
    "@emotion/styled",
    "@mui/icons-material",
    "@mui/material"
  );
}

if (programOptions.withAntd) {
  defaults.packagesToInstall.save.push("antd");
}

if (
  Array.isArray(programOptions.extraPackages) &&
  programOptions.extraPackages.length > 0
) {
  programOptions.extraPackages.forEach((package) => {
    let match = package.match(/^(.+)\:\:dev$/);
    if (match) {
      // save development
      defaults.packagesToInstall.dev.push(match[1]);
    } else {
      // save production
      defaults.packagesToInstall.save.push(package);
    }
  });
}

const showPackagesToInstall = () => {
  console.log("- Packages to install for production: ".cyan);
  defaults.packagesToInstall.save.forEach((package) => {
    console.log("\t[+] ", package);
  });
  console.log("- Packages to install for development: ".cyan);
  defaults.packagesToInstall.dev.forEach((package) => {
    console.log("\t[x] ", package);
  });
};

const showConfig = () => {
  console.log(
    "- Project will be created with name: ".cyan,
    `${projectName}`.yellow
  );
  showPackagesToInstall();
};

function keyPress(value) {
  return new Promise((resolve, reject) => {
    let withKeyCodes = value.map((item) => item.charCodeAt(0));
    process.stdin.setRawMode(true);
    process.stdin.once("data", (keystroke) => {
      process.stdin.setRawMode(false);
      if (withKeyCodes.indexOf(keystroke[0]) >= 0) resolve();
      return reject();
    });
  });
}

const run = async () => {
  showConfig();
  console.log("- All this information will ok for you? [y/N]".yellow);
  try {
    await keyPress(["y", "Y"]);
    const taskList = [
      { method: tasks.createReactApp, args: projectName },
      { method: tasks.installPackages, args: defaults.packagesToInstall },
      { method: tasks.createDirectories, args: defaults.directoriesToCreate },
      { method: tasks.deleteFiles, args: defaults.filesToDelete },
      { method: tasks.copyFiles, args: defaults.filesToCopy },
    ];
    tasks.initialize(projectName);
    await tasks.taskRunner(taskList);
    console.log("All done. Good luck".green);
    process.exit(0);
  } catch (err) {
    if (err) {
      console.error(`${err}`.red);
    }
    console.error("Terminated".red);
    process.exit(1);
  }
};

if (programOptions.show) {
  showPackagesToInstall();
} else {
  run();
}
```

## 5. <a name='AddingExecutableTopackage.json'></a>Adding Executable To `package.json`

```json
{
    ...,
    "bin": {
        "create-custom-react-app":"index.js"
    },
    ...
}
```
