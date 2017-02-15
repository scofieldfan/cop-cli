'use strict'
const co = require('co')
const prompt = require('co-prompt')
const config = require('../templates')
const chalk = require('chalk')
const fs = require('fs')
const doT = require('dot')
const mkpath = require('mkpath');
var path = require('path');


require.extensions['.tpl'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
require.extensions['.js'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
require.extensions['.php'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
const lessTpl = require('../templates/less.tpl');
const jsTpl = require('../templates/tpl.js');
const phpTpl = require('../templates/tpl.php');
doT.templateSettings.strip = false;
const DEFAULT_CONTROLLER = 'appset';
const DEFAULT_METHOD = 'landingpage';
const DEFAULT_API = '/route/index_new/financial/querytransactionlist';
const DEFAULT_LIST = 'TransactionList';

module.exports = () => {
    co(function *() {

        // 分步接收用户输入的参数
        let controller = yield prompt(`? controller名称 (${DEFAULT_CONTROLLER}) `) ;
        controller = controller || DEFAULT_CONTROLLER;

        let method = yield prompt(`? 方法名称 (${DEFAULT_METHOD}) `);
        method = method || DEFAULT_METHOD;

        let api = yield prompt(`? ajax请求的Api地址 (${DEFAULT_API}) `);
        api = api || DEFAULT_API;

        let listName = yield prompt(`? 返回结果List的名称 (${DEFAULT_LIST}) `);
        listName = listName || DEFAULT_LIST;


        var data =  {
             controller:controller,
             method:method,
             api:api,
             listName:listName
        };

        yield prompt('您的输入是：'+JSON.stringify(data));
        var lessOutput = doT.template(lessTpl)(data);
        var jsOutput = doT.template(jsTpl)(data);
        var phpOutput = doT.template(phpTpl)(data);

        var dir = process.cwd();
        console.log("process cwd",process.cwd());
        console.log("path.resolve",path.resolve('./'));

        mkdir(dir+'/static/css/pages').then(()=>{
            return writeFile(dir+'/static/css/pages/',`${data.controller}_${data.method}.less`,lessOutput);
        }).then(()=>{
            return mkdir(dir+'/static/js/pages');
        }).then(()=>{
            return writeFile(dir+'/static/js/pages/',`${data.controller}_${data.method}.js`,jsOutput);
        }).then(()=>{
            return mkdir(dir+`/views/${data.controller}/`);
        }).then(()=>{
            return writeFile(dir+`/views/${data.controller}/`,`${data.controller}_${data.method}_list-new.php`,phpOutput);
        }).then(()=>{
            process.exit();
        });
    })
}
const mkdir = (directory) => {
    return new Promise((resolve, reject) => {
        mkpath(directory, function (err) {
            if (err){
              throw err;
               reject();
            }else{
               resolve();
            }
        });
    });
}
const writeFile = (dirName,fileName,content) => {
     return new Promise((resolve, reject) => {
         fs.writeFile(dirName + fileName, content, 'utf-8', (err) => {
             if (err) {
                 console.error("文件fileName生成错误");
                 throw err;
                 reject();
             }else{
                 resolve();
             }
             console.log('\n')
         });

    });
}
