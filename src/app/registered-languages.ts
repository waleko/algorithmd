import escapeStringRegexp from "escape-string-regexp";


interface Language {
  name: string,
  mode: string[],
  fileExtensions: string[],
  fileNames?: string[]
}

const registeredLanguages: { [simpleName: string]: Language} = {
    "groovy": {
      "name": "Groovy",
      "mode": ["groovy"],
      "fileExtensions": ["groovy", "gradle"],
    },

    "properties": {
      "name": "Properties",
      "mode": ["properties", "text/x-properties"],
      "fileExtensions": ["ini", "properties"]
    },

    "css": {
      "name": "CSS",
      "mode": ["css"],
      "fileExtensions": ["css", "css.erb"],
    },

    "scss": {
      "name": "SCSS",
      "mode": ["css", "text/x-scss"],
      "fileExtensions": ["scss", "scss.erb"],
    },

    "stylus": {
      "name": "Stylus",
      "mode": ["stylus", "text/x-styl"],
      "fileExtensions": ["styl"],
    },

    "html": {
      "name": "HTML",
      "mode": ["text/html"],
      "fileExtensions": ["html", "htm", "shtm", "shtml", "xhtml", "cfm", "cfml", "cfc", "dhtml", "xht", "tpl", "twig", "kit", "jsp", "aspx", "ascx", "asp", "master", "cshtml", "vbhtml"],
    },

    "jsx": {
      "name": "JSX",
      "mode": ["jsx"],
      "fileExtensions": ["jsx"],
    },

    "dart": {
      "name": "Dart",
      "mode": ["dart", "application/dart"],
      "fileExtensions": ["dart"],
    },

    "vbscript": {
      "name": "VBScript",
      "mode": ["vbscript"],
      "fileExtensions": ["vbs"],
    },

    "vb": {
      "name": "VB",
      "mode": ["vb", "text/x-vb"],
      "fileExtensions": ["vb"],
    },

    "json": {
      "name": "JSON",
      "mode": ["javascript", "application/json"],
      "fileExtensions": ["json"],
      "fileNames": [".jshintrc", ".bowerrc"]
    },

    "xml": {
      "name": "XML",
      "mode": ["xml"],
      "fileExtensions": ["xml", "wxs", "wxl", "wsdl", "rss", "atom", "rdf", "xslt", "xsl", "xul", "xsd", "xbl", "mathml", "config", "plist", "xaml"],
    },

    "svg": {
      "name": "SVG",
      "mode": ["xml", "image/svg+xml"],
      "fileExtensions": ["svg"],
    },

    "php": {
      "name": "PHP",
      "mode": ["php"],
      "fileExtensions": ["php", "php3", "php4", "php5", "phtm", "phtml", "ctp"],
    },

    "c": {
      "name": "C",
      "mode": ["clike", "text/x-csrc"],
      "fileExtensions": ["c", "h", "i"],
    },

    "cpp": {
      "name": "C++",
      "mode": ["clike", "text/x-c++src"],
      "fileExtensions": ["cc", "cp", "cpp", "c++", "cxx", "hh", "hpp", "hxx", "h++", "ii", "ino"],
    },

    "csharp": {
      "name": "C#",
      "mode": ["clike", "text/x-csharp"],
      "fileExtensions": ["cs", "asax", "ashx"],
    },

    "java": {
      "name": "Java",
      "mode": ["clike", "text/x-java"],
      "fileExtensions": ["java"],
    },

    "scala": {
      "name": "Scala",
      "mode": ["clike", "text/x-scala"],
      "fileExtensions": ["scala", "sbt"],
    },

    "coffeescript": {
      "name": "CoffeeScript",
      "mode": ["coffeescript"],
      "fileExtensions": ["coffee", "cf", "cson", "_coffee"],
      "fileNames": ["Cakefile"],
    },

    "clojure": {
      "name": "Clojure",
      "mode": ["clojure"],
      "fileExtensions": ["clj", "cljs", "cljx"],
    },

    "perl": {
      "name": "Perl",
      "mode": ["perl"],
      "fileExtensions": ["pl", "pm", "t"],
    },

    "ruby": {
      "name": "Ruby",
      "mode": ["ruby"],
      "fileExtensions": ["rb", "ru", "gemspec", "rake"],
      "fileNames": ["Gemfile", "Rakefile", "Guardfile", "Vagrantfile"],
    },

    "python": {
      "name": "Python",
      "mode": ["python"],
      "fileExtensions": ["py", "pyw", "wsgi", "gyp", "gypi"],
    },

    "sass": {
      "name": "SASS",
      "mode": ["sass"],
      "fileExtensions": ["sass"],
    },

    "lua": {
      "name": "Lua",
      "mode": ["lua"],
      "fileExtensions": ["lua"],
    },

    "sql": {
      "name": "SQL",
      "mode": ["sql", "text/x-mysql"],
      "fileExtensions": ["sql"]
    },

    "diff": {
      "name": "Diff",
      "mode": ["diff"],
      "fileExtensions": ["diff", "patch"]
    },

    "markdown": {
      "name": "Markdown",
      "mode": ["markdown"],
      "fileExtensions": ["md", "markdown", "mdown", "mkdn"],
    },

    "yaml": {
      "name": "YAML",
      "mode": ["yaml"],
      "fileExtensions": ["yaml", "yml"],
    },

    "hx": {
      "name": "Haxe",
      "mode": ["haxe"],
      "fileExtensions": ["hx"],
    },

    "bash": {
      "name": "Bash",
      "mode": ["shell", "text/x-sh"],
      "fileExtensions": ["sh", "command", "bash"],
      "fileNames": [".bash_login", ".bash_logout", ".bash_profile", ".bashrc", ".profile"],
    },

    "haskell": {
      "name": "Haskell",
      "mode": ["haskell"],
      "fileExtensions": ["hs"],
    },

    "turtle": {
      "name": "RDF Turtle",
      "mode": ["turtle"],
      "fileExtensions": ["ttl"],
    },

    "go": {
      "name": "Go",
      "mode": ["go"],
      "fileExtensions": ["go"],
    },

    "pug": {
      "name": "Pug",
      "mode": ["pug"],
      "fileExtensions": ["pug", "jade"],
    },

    "kotlin": {
      "name": "Kotlin",
      "mode": ["clike", "text/x-kotlin"],
      "fileExtensions": ["kt", "kts", "ktm"]
    },

    "javascript": {
      "name": "Javascript",
      "mode": ["text/javascript"],
      "fileExtensions": ["js", "cjs", "mjs"]
    },

    "typescript": {
      "name": "Typescript",
      "mode": ["text/typescript"],
      "fileExtensions": ["ts", "tsx"]
    }
}

const registeredLanguagesMap = new Map(Object.entries(registeredLanguages))

// TODO: replace with some external library like `mime`
//  but if enough programming languages (e.g. go and kotlin) are included
export function getMimeByFilename(filename: string): string[] {
  // for all languages
  for (const [_, language] of registeredLanguagesMap.entries()) {
    // check if matches exactly
    if (language.fileNames && language.fileNames.includes(filename))
      return language.mode

    // check file extension
    for (const extension of language.fileExtensions) {
      // if the end of the filename matches
      if (new RegExp(`.+\\.${escapeStringRegexp(extension)}$`).test(filename))
        return language.mode
    }
  }
  // return nothing
  return []
}
