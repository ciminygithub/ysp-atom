const os = require('os');
var projectPath = require('./../common').rootPath();
var child = require('child_process');
var exec = child.exec;
class AndroidBuild {
    build(callback) {
        var mPlatform = os.platform();
        if (mPlatform == "darwin") {
            exec("cd " + projectPath + "/android && chmod +x gradlew && ./gradlew buildBundle", function(err, stdout, stderr) {
                if (!err) {
                  console.log('打包成功');
                } else {
                  console.log('打包失败, erroInfo = ' + err);
                  // exec("cd " + projectPath + "/android && gradle wrapper", function(err, stdout, stderr) {
                  //     if (!err) {
                  //       exec("cd " + projectPath + "/android && ./gradlew buildBundle", function(err, stdout, stderr) {
                  //           if (!err) {
                  //               console.log('打包成功');
                  //           } else {
                  //               console.log('打包失败,erroInfo = '+err);
                  //           }
                  //           callback(err);
                  //       });
                  //     } else {
                  //         console.log('打包失败,erroInfo = '+err);
                  //         callback(err);
                  //     }
                  // });
                }
                callback(err);
            });
        } else {
            exec("cd " + projectPath + "/android && gradlew.bat buildBundle", function(err, stdout, stderr) {
                if (!err) {
                    console.log('打包成功');
                } else {
                    console.log('打包失败, erroInfo = ' + err);
                }
                callback(err);
            });
        }
    }
}

function buildWithAtom(callback){
	new AndroidBuild().build(callback);
}
exports.buildWithAtom = buildWithAtom;
