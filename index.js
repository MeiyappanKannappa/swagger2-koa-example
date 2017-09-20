/**
 * Module dependencies.
 */

var koa = require('koa')
  , Router = require('koa-router')
  , views = require('koa-render')
  , serve = require('koa-static')
  , api = require('./api')
  , path = require('path')
  , bodyParser = require('koa-bodyparser')
  , validate = require('swagger2-koa').validate
  , ui =  require('swagger2-koa').ui
  , swagger = require('swagger2');
  var jade = require('koa-jade-render');
var app = new koa(),
  port = 9000;
  const body = require('koa-json-body')
  const router = new Router();
 app.use(body({ limit: '100kb', fallback: true }))
 const swaggerSpec = swagger.loadDocumentSync(__dirname + '/api.yml');
 


app.use(views('views', { default: 'jade' }));
app.use(serve(path.join(__dirname, 'public')));
app.use(jade(path.join(__dirname, 'views')));

router.get('/', async function (ctx,next) {
  //ctx.response.body = ctx.render('index', { title: 'Koa' });
  //ctx.render('index', { title: 'Koa' });
  return next().then(()=>{
    ctx.render('index.jade');
});
});


router.post('/login', api.login);
router.get('/hello', api.hello);

app
.use(bodyParser())
.use(ui(swaggerSpec, "/swaggerspec"))
.use(validate(swaggerSpec))
.use(router.routes());

app.listen(port, function () {
  console.log('Server running on port ' + port);
});