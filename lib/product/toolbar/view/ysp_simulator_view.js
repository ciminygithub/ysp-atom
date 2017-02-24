'use babel';

import ProjectConfig from './../../../project-config.js';
import YSPMacSimulator from './../../mac_simulator';

export default class YSPSettingSimulatorView {

    simulator_tool: null;

    constructor(serializedState) {
        simulator_tool = new YSPMacSimulator();
    }

    show(htmltag) {
        if (document.getElementById("ysp_simulator_parent_view") != null) {
            document.getElementById("ysp_simulator_parent_view").remove();
        }
        var body = document.body;
        var html = "\
        <div id='ysp_simulator_view_bg' style='margin-top:10px'>\
          <label class='input-label' style='margin-bottom:20px'><input id='ysp_is_local_simulator' class='input-checkbox' type='checkbox' style='width:16px;'>是否为本地模拟器</label> <br/>\
          <div class='block' id='ysp_simulator_view_ios' style='float:left;'>\
                    <label id='begin_download_label_ios'>iOS Simulator：</label><br/>\
          </div>\
           <div class='block' id='ysp_simulator_view_android' style='float:left;margin-left:50px'>\
                     <label id='begin_download_label_ios'>Android Simulator：</label><br/>\
           </div>\
        </div>";
        // <div class='block' id='ysp_simulator_view_android' style='margin-top:20px'>\
        //           <label id='begin_download_label_ios'>Android Simulator：</label><br/>\
        // </div>\

        var div = document.createElement("div");
        div.setAttribute('id', 'ysp_simulator_parent_view');
        div.innerHTML = html;
        document.getElementById(htmltag).innerHTML = "";
        document.getElementById(htmltag).appendChild(div);

        loadAllSimulator();
    }
}

function loadAllSimulator() {
    simulator_tool.iPhoneSimulators(function(nameArr, deviceArr) {
        showIosSimulator(nameArr, deviceArr);
    });
    simulator_tool.AndroidSimulators(function(nameArr, deviceArr) {
        showAndroidSimulator(nameArr, deviceArr);
    });

    console.warn("啦啦啦");
console.warn(ProjectConfig.isLocalSimulator());
    document.getElementById('ysp_is_local_simulator').checked = ProjectConfig.isLocalSimulator();
    document.getElementById('ysp_is_local_simulator').onclick = function() {
    console.warn("set");
    console.warn(document.getElementById('ysp_is_local_simulator').checked);
        ProjectConfig.setIsLocalSimulator(document.getElementById('ysp_is_local_simulator').checked);
    }

}

function showIosSimulator(nameArr, deviceArr) {
    //排个序
    for (var i = 0; i < nameArr.length - 1; i++) {
        for (var x = 0; x < nameArr.length - 1 - i; x++) {
            if (nameArr[x] < nameArr[x + 1]) {
                var a = nameArr[x + 1];
                nameArr[x + 1] = nameArr[x];
                nameArr[x] = a;

                var b = deviceArr[x + 1];
                deviceArr[x + 1] = deviceArr[x];
                deviceArr[x] = b;
            }
        }
    }

    var html = "<ul id='ios_simulators'>";
    for (var i in nameArr) {
        html += "<li>\
                              <a href='#'>" + nameArr[i] + "</a>\
                              <button class='btn icon-playback-play' name='run_ios_simulator_btn' d='" + deviceArr[i] + "'></button>\
                    </li>";
    }
    html += "</ul>";

    document.getElementById('ysp_simulator_view_ios').innerHTML += html;

    var btns = document.getElementsByTagName("button");
    var li_click = function(i) {
        btns[i].onclick = function() {
            simulator_tool.runiOSSimulator(btns[i].getAttribute("d"));
        }
    }
    for (var i in btns) {
        if (btns[i].name == 'run_ios_simulator_btn') {
            li_click(i);
        }
    }
}

function showAndroidSimulator(nameArr, deviceArr) {
    var html = "<ul id='android_simulators'>";
    for (var i in nameArr) {
        html += "<li>\
                              <a href='#'>" + nameArr[i] + "</a>\
                              <button class='btn icon-playback-play' name='run_android_simulator_btn' d='" + deviceArr[i] + "'></button>\
                    </li>";
    }
    html += "</ul>";

    document.getElementById('ysp_simulator_view_android').innerHTML += html;

    var btns = document.getElementsByTagName("button");
    var li_click = function(i) {
        btns[i].onclick = function() {
            simulator_tool.runAndroidSimulator(btns[i].getAttribute("d"));
        }
    }
    for (var i in btns) {
        if (btns[i].name == 'run_android_simulator_btn') {
            li_click(i);
        }
    }
}
