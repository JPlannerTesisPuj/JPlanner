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
    './src/app/use-guide/use-guide.component.scss',
    'src/app/app.component.scss',
    './src/app/calendar/calendar.component.scss',
    './src/app/block-modal/block-modal.component.scss',
    './src/app/display-subjects/display-subjects.component.scss',
    './src/app/autocomplete-horary/autocomplete-horary.component.scss',
    './src/app/styles/atomic-styles/*',
    './src/app/styles/molecular-styles/*',
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