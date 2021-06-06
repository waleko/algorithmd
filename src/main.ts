import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from "@sentry/angular";
import { Integrations } from "@sentry/tracing";

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


import "codemirror/mode/groovy/groovy"
import "codemirror/mode/properties/properties"
import "codemirror/mode/css/css"
import "codemirror/mode/stylus/stylus"
import "codemirror/mode/htmlmixed/htmlmixed"
import "codemirror/mode/jsx/jsx"
import "codemirror/mode/dart/dart"
import "codemirror/mode/vbscript/vbscript"
import "codemirror/mode/vb/vb"
import "codemirror/mode/xml/xml"
import "codemirror/mode/php/php"
import "codemirror/mode/clike/clike"
import "codemirror/mode/coffeescript/coffeescript"
import "codemirror/mode/clojure/clojure"
import "codemirror/mode/perl/perl"
import "codemirror/mode/ruby/ruby"
import "codemirror/mode/python/python"
import "codemirror/mode/sass/sass"
import "codemirror/mode/lua/lua"
import "codemirror/mode/sql/sql"
import "codemirror/mode/diff/diff"
import "codemirror/mode/markdown/markdown"
import "codemirror/mode/yaml/yaml"
import "codemirror/mode/haskell/haskell"
import "codemirror/mode/turtle/turtle"
import "codemirror/mode/go/go"
import "codemirror/mode/pug/pug"


Sentry.init({
  dsn: environment.sentryDSNUrl,
  integrations: [
    new Integrations.BrowserTracing({
      tracingOrigins: ["localhost", "https://algorithmd.wlko.me"],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
