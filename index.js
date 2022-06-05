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
