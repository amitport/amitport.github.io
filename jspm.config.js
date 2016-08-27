SystemJS.config({
  paths: {
    "github:": "jspm_packages/github/",
    "npm:": "jspm_packages/npm/",
    "amitport.github.io/": "src/"
  },
  browserConfig: {
    "baseURL": "/"
  },
  transpiler: "plugin-typescript",
  packages: {
    "amitport.github.io": {
      "main": "amitport.github.io.js",
      "meta": {
        "*.ts": {
          "loader": "plugin-typescript"
        }
      }
    }
  }
});

SystemJS.config({
  packageConfigPaths: [
    "github:*/*.json",
    "npm:@*/*.json",
    "npm:*.json"
  ],
  map: {},
  packages: {}
});
