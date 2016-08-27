SystemJS.config({
  paths: {
    "github:": "jspm_packages/github/",
    "npm:": "jspm_packages/npm/",
    "amitport/": "src/"
  },
  browserConfig: {
    "baseURL": "/"
  },
  transpiler: "plugin-typescript",
  typescriptOptions: {
    "tsconfig": true
  },
  packages: {
    "amitport": {
      "main": "index.ts",
      "defaultExtension": "ts",
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
  map: {
    "angular": "github:angular/bower-angular@1.5.8",
    "angular-material": "github:angular/bower-material@1.1.0",
    "css": "github:systemjs/plugin-css@0.1.27",
    "ng-template": "npm:plugin-ng-template@0.1.1"
  },
  packages: {
    "github:angular/bower-material@1.1.0": {
      "map": {
        "css": "github:systemjs/plugin-css@0.1.27",
        "angular-aria": "github:angular/bower-angular-aria@1.5.8",
        "angular": "github:angular/bower-angular@1.5.8",
        "angular-animate": "github:angular/bower-angular-animate@1.5.8"
      }
    },
    "github:angular/bower-angular-aria@1.5.8": {
      "map": {
        "angular": "github:angular/bower-angular@1.5.8"
      }
    },
    "github:angular/bower-angular-animate@1.5.8": {
      "map": {
        "angular": "github:angular/bower-angular@1.5.8"
      }
    }
  }
});
