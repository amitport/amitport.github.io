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
    "highlightjs": "github:components/highlightjs@9.6.0",
    "katex": "npm:katex@0.6.0",
    "ng-template": "npm:plugin-ng-template@0.1.1",
    "short-number": "npm:short-number@1.0.6"
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
    },
    "npm:katex@0.6.0": {
      "map": {
        "match-at": "npm:match-at@0.1.0"
      }
    }
  }
});
