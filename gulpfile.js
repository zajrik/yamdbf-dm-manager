/* eslint-disable @typescript-eslint/typedef */
const gulp = require('gulp');
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const eslint = require('gulp-eslint');
const del = require('del');
const path = require('path');

const project = typescript.createProject('tsconfig.json');

gulp.task('lint', () =>
	gulp.src('src/**/*.ts')
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError()));

gulp.task('build', () =>
{
	del.sync(['bin/**/*.*']);
	const tsCompile = gulp.src('src/**/*.ts')
		.pipe(sourcemaps.init({ base: 'src' }))
		.pipe(project());

	tsCompile.pipe(gulp.dest('bin/'));

	gulp.src('src/**/*.js').pipe(gulp.dest('bin/'));
	gulp.src('src/**/*.json').pipe(gulp.dest('bin/'));
	gulp.src('src/**/*.lang').pipe(gulp.dest('bin/'));

	return tsCompile.js
		.pipe(sourcemaps.write('.', { sourceRoot: '../src' }))
		.pipe(gulp.dest('bin/'));
});

gulp.task('build:tests', () =>
{
	del.sync(['test/**/*.js']);
	const tsCompile = gulp.src('test/**/*.ts')
		.pipe(sourcemaps.init({ base: 'test' }))
		.pipe(project());

	tsCompile.pipe(gulp.dest('test/'));

	return tsCompile.js
		.pipe(sourcemaps.mapSources(sourcePath => path.join(__dirname, 'test', sourcePath)))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('test/'));
});

gulp.task('default', gulp.series('build'));
gulp.task('build:vscode', gulp.series('lint', 'build'));
gulp.task('pause', cb => setTimeout(cb, 1e3));
gulp.task('tests', gulp.series('lint', 'build', 'pause', 'build:tests'));
