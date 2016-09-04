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
        "github:components/highlightjs@9.6.0/styles/darcula.css!github:systemjs/plugin-css@0.1.27/css.js",
        "github:components/highlightjs@9.6.0.json",
        "github:systemjs/plugin-css@0.1.27.json",
        "github:components/highlightjs@9.6.0/highlight.pack.js",
        "npm:katex@0.6.0/dist/katex.min.js",
        "npm:katex@0.6.0.json",
        "npm:katex@0.6.0/dist/katex.min.css!github:systemjs/plugin-css@0.1.27/css.js",
        "amitport/main.css!github:systemjs/plugin-css@0.1.27/css.js",
        "amitport/main.html!npm:plugin-ng-template@0.1.1/ng-template.js",
        "github:angular/bower-angular@1.5.8/angular.js",
        "github:angular/bower-angular@1.5.8.json",
        "npm:plugin-ng-template@0.1.1.json",
        "amitport/module.ts",
        "npm:short-number@1.0.6/index.js",
        "npm:short-number@1.0.6.json",
        "github:angular/bower-material@1.1.1/angular-material.js",
        "github:angular/bower-material@1.1.1.json",
        "github:angular/bower-angular-aria@1.5.8/angular-aria.js",
        "github:angular/bower-angular-aria@1.5.8.json",
        "github:angular/bower-angular-animate@1.5.8/angular-animate.js",
        "github:angular/bower-angular-animate@1.5.8.json",
        "github:angular/bower-material@1.1.1/angular-material.css!github:systemjs/plugin-css@0.1.27/css.js",
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
    "angular-material": "github:angular/bower-material@1.1.1",
    "css": "github:systemjs/plugin-css@0.1.27",
    "highlightjs": "github:components/highlightjs@9.6.0",
    "katex": "npm:katex@0.6.0",
    "ng-template": "npm:plugin-ng-template@0.1.1",
    "short-number": "npm:short-number@1.0.6"
  },
  packages: {
    "npm:katex@0.6.0": {
      "map": {
        "match-at": "npm:match-at@0.1.0"
      }
    },
    "github:angular/bower-material@1.1.1": {
      "map": {
        "angular-aria": "github:angular/bower-angular-aria@1.5.8",
        "css": "github:systemjs/plugin-css@0.1.27",
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
