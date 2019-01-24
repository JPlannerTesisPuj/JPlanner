var gulp = require('gulp');
var sassDir = 'src/app/styles.scss';
var sass = require('gulp-sass');
var targetCssDir = 'src/app/styles/';
var autoprefix = require('gulp-autoprefixer');
var sassFiles = [
    sassDir,
    './src/app/display-class/display-class.component.scss',
    './src/app/display-classes/display-classes.component.scss',
    './src/app/class-modal/class-modal.component.scss',
    './src/app/filter/filter.component.scss',
    'src/app/app.component.scss'
]


gulp.task('css', function(){
    return gulp.src(sassDir)
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefix('last 10 version'))
        .pipe(gulp.dest(targetCssDir))
});

gulp.task('watch',function() {
    return gulp.watch(sassFiles,gulp.series('css'));
});

gulp.task('default', gulp.parallel('css','watch'));