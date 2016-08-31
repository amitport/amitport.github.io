SystemJS.config({
  paths: {
    "github:": "jspm_packages/github/",
    "npm:": "jspm_packages/npm/",
    "amitport/": "src/"
  },
  browserConfig: {
    "baseURL": "/",
    "bundles": {
      "build.js": [
        "amitport/index.ts",
        "amitport/main-component.ts",
        "npm:katex@0.6.0/dist/katex.min.js",
        "npm:katex@0.6.0.json",
        "npm:katex@0.6.0/dist/katex.min.css!github:systemjs/plugin-css@0.1.27/css.js",
        "github:systemjs/plugin-css@0.1.27.json",
        "amitport/main.css!github:systemjs/plugin-css@0.1.27/css.js",
        "amitport/main.html!npm:plugin-ng-template@0.1.1/ng-template.js",
        "github:angular/bower-angular@1.5.8/angular.js",
        "github:angular/bower-angular@1.5.8.json",
        "npm:plugin-ng-template@0.1.1.json",
        "amitport/module.ts",
        "npm:short-number@1.0.6/index.js",
        "npm:short-number@1.0.6.json",
        "github:angular/bower-material@1.1.0/angular-material.js",
        "github:angular/bower-material@1.1.0.json",
        "github:angular/bower-angular-aria@1.5.8/angular-aria.js",
        "github:angular/bower-angular-aria@1.5.8.json",
        "github:angular/bower-angular-animate@1.5.8/angular-animate.js",
        "github:angular/bower-angular-animate@1.5.8.json",
        "github:angular/bower-material@1.1.0/angular-material.css!github:systemjs/plugin-css@0.1.27/css.js",
        "github:frankwallis/plugin-typescript@5.0.19.json"
      ]
    }
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
