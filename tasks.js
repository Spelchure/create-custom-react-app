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
  return Promise.all(promises);
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
