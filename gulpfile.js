require('dotenv').config();

const { upload }   = require('gulp-azure-storage');
const azureStorage = require('azure-storage');
const fetch        = require('node-fetch');
const gulp         = require('gulp');
const rename       = require('gulp-rename');

const BLOB_CONTAINER      = `pr-${ process.env.TRAVIS_PULL_REQUEST }`;
const TESTBED_GIT_CONTEXT = 'fiddler/testbed';

gulp.task('prdeploy:createcontainer', () => {
  return new Promise((resolve, reject) => {
    const blobService = azureStorage.createBlobService();

    blobService.createContainerIfNotExists(BLOB_CONTAINER, { publicAccessLevel: 'blob' }, err => {
      err ? reject(err) : resolve();
    });
  });
});

gulp.task('prdeploy:upload:asset', ['prdeploy:createcontainer', 'prdeploy:prestatus'], () => {
  return gulp
    .src('prdeploy/**/*')
    .pipe(upload({
      account  : process.env.AZURE_STORAGE_ACCOUNT,
      container: BLOB_CONTAINER,
      key      : process.env.AZURE_STORAGE_ACCESS_KEY
    }));
});

gulp.task('prdeploy:upload:dist', ['prdeploy:createcontainer', 'prdeploy:prestatus'], () => {
  const packageJSON = require('./package.json');

  return gulp
    .src(packageJSON.files.map(file => /\/$/.test(file) ? `${ file }**/*` : file), { base: __dirname })
    .pipe(upload({
      account  : process.env.AZURE_STORAGE_ACCOUNT,
      container: BLOB_CONTAINER,
      key      : process.env.AZURE_STORAGE_ACCESS_KEY
    }));
});

gulp.task('prdeploy:upload:mock_speech', ['prdeploy:createcontainer', 'prdeploy:prestatus'], () => {
  return gulp
    .src('test/mock_speech/index.js*')
    .pipe(rename(path => {
      path.basename = 'mock_speech';
    }))
    .pipe(upload({
      account  : process.env.AZURE_STORAGE_ACCOUNT,
      container: BLOB_CONTAINER,
      key      : process.env.AZURE_STORAGE_ACCESS_KEY
    }));
});

gulp.task('prdeploy:upload', ['prdeploy:upload:asset', 'prdeploy:upload:dist', 'prdeploy:upload:mock_speech']);

gulp.task('prdeploy:prestatus', () => {
  return gitStatus({
    description: 'Deploying a testbed',
    state: 'pending'
  });
});

gulp.task('prdeploy:poststatus', ['prdeploy:upload'], () => {
  return gitStatus({
    description: 'Testbed is deployed',
    state      : 'success',
    target_url : `https://${ encodeURI(process.env.AZURE_STORAGE_ACCOUNT) }.blob.core.windows.net/${ encodeURI(BLOB_CONTAINER) }/index.html`
  });
});

gulp.task('prdeploy', process.env.TRAVIS_PULL_REQUEST ? ['prdeploy:prestatus', 'prdeploy:upload', 'prdeploy:poststatus'] : []);

function gitStatus(status) {
  return fetch(
    `https://api.github.com/repos/${ process.env.TRAVIS_PULL_REQUEST_SLUG }/statuses/${ encodeURI(process.env.TRAVIS_PULL_REQUEST_SHA) }`,
    {
      body  : JSON.stringify(Object.assign({ context: TESTBED_GIT_CONTEXT }, status)),
      method: 'post',

      headers: {
        Authorization : `token ${ process.env.GITHUB_TOKEN }`,
        'Content-Type': 'application/json'
      }
    }
  ).then(res => {
    if (~~(res.status / 100) !== 2) {
      return Promise.reject(new Error(`Server returned ${ res.status }`));
    }
  });
}
