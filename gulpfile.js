var gulp = require('gulp');
postcss = require('gulp-postcss');
autoprefixer = require('gulp-autoprefixer');
sourcemaps = require('gulp-sourcemaps');
atImport = require('postcss-import');
selector = require('postcss-custom-selectors')
customProperties = require("postcss-custom-properties")
sorting = require('postcss-sorting');
nested = require('postcss-nested');
reporter = require('postcss-reporter');
imagemin = require('gulp-imagemin');
newer = require('gulp-newer');
nano = require('gulp-cssnano');
terser = require('gulp-terser');
notify = require('gulp-notify');
stylelint = require('stylelint');
browserSync = require('browser-sync');
babel = require('gulp-babel');
postcssNormalize = require('postcss-normalize');

var paths = {
  js: 'src/js',
  css: 'src/css',
  images: 'src/img/*',
  buildCss: 'css/',
  buildJs: 'js/',
  buildImages: 'img/'
};

var watch = {
  js: [
    paths.js + '/**/*.js'
  ],
  css: [
    paths.css + '/**/*.css'
  ],
  minifycss: [
    paths.buildCss + '/**/*.css'
  ],
  images: [
    paths.images + '/**/*.*'
  ],
  html: [
  '/*.html'
  ]
};

gulp.task('babel', () =>
    gulp.src(watch.js)
        .pipe(newer(paths.js))
        .pipe(babel({
            presets: ["@babel/preset-env"]
        }))
        .on("error", errorAlertJS)
        .pipe(gulp.dest(paths.buildJs))
        .pipe(notify({
            message: 'JavaScript complete'
        }))
);

gulp.task("browserSync", function() {
    browserSync({
        server: {
            baseDir: "./",
            reloadDelay: 2000
        },
        online: true
    })
});

/* Notificando errores de JavaScript */
function errorAlertJS(error) {
    notify.onError({
        title: "Gulp JavaScript",
        subtitle: "Algo esta mal en tu JavaScript!",
        sound: "Basso"
    })(error);
    console.log(error.toString());
    this.emit("end");
};

/* Notificando errores de CSS */
function errorAlertPost(error) {
    notify.onError({
        title: "Gulp postCSS",
        subtitle: "Algo esta mal en tu CSS!",
        sound: "Basso"
    })(error);
    console.log(error.toString());
    this.emit("end");
};

/* Comprimiendo JavaScript */
gulp.task('compress', function() {
   return gulp.src(watch.js)
     .pipe(terser())
     .on("error", errorAlertJS)
     .pipe(gulp.dest(paths.buildJs))
     .pipe(notify({
         message: 'JavaScript complete'
     }))
});

/* ==========================================================================
   Lanzando postCSS
   ========================================================================== */

/*
 * El orden de los plugins debe ser respetado.
 *
 * Antes de que nuestro CSS empiece a ser transformado por los diferentes
 * plugins vamos a 'lintear' nuestro CSS para seguir un orden y concierto.
 *
 *
 */

gulp.task('css', function() {
    var processors = [
        atImport({
            plugins: [stylelint]
        }),
        stylelint,
        reporter({
            clearMessages: true
        }),
        nested,
        customProperties,
        selector,
        sorting({
            "sort-order": "csscomb"
        }),
        autoprefixer,
        postcssNormalize({
            browsers: 'last 2 versions',
            forceImport: true
        }),
    ];
    return gulp.src('src/css/styles.css')

    .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .on("error", errorAlertPost)
        .pipe(sourcemaps.write('./', {
            sourceRoot: '/src'
        }))
        .pipe(gulp.dest(paths.buildCss))
        .pipe(browserSync.stream())
        .pipe(notify({
            message: 'postCSS complete'
        }));
});

/* Lanzando CSSnano para comprimir CSS */
gulp.task('minify', function() {
    return gulp.src(watch.minifycss)
    //Remove comments false //Z index
        .pipe(nano())
        .pipe(gulp.dest(paths.buildCss))
        .pipe(notify({
            message: 'CSSnano task complete'
        }));
});

/* Comprimiendo imagenes */
gulp.task('imagemin', function() {
    return gulp.src(paths.images)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(paths.buildImages));
});

gulp.task('images', function() {
    return gulp.src(paths.images)
        .pipe(newer(paths.images))
        .pipe(imagemin())
        .pipe(gulp.dest(paths.buildImages));
});


/* Tarea por defecto para compilar CSS y comprimir imagenes */
gulp.task('default', ["browserSync"], function() {
    //Add interval to watcher!
    gulp.watch(watch.css, { interval: 300 }, ['css']);
    gulp.watch(watch.images, { interval: 300 }, ['images']);
    gulp.watch(watch.js, { interval: 300 }, ['babel', 'compress']);
    gulp.watch(["./*.html", "css/*.css", "js/*.js"]).on("change", browserSync.reload);
});


// Build para un proyecto sin imágenes
gulp.task('build', ['minify', 'compress']);
