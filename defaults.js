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
