
// 对日期 填充0操作，如4.2 显示为04.02
function getzf(num) {
    if (parseInt(num) < 10) {
        num = '0' + num;
    }
    return num;
}


function GetUrlParam(paraName) {
    var url = document.location.toString();
    var arrObj = url.split("?");

    if (arrObj.length > 1) {
        var arrPara = arrObj[1].split("&");
        var arr;

        for (var i = 0; i < arrPara.length; i++) {
            arr = arrPara[i].split("=");

            if (arr != null && arr[0] == paraName) {
                return arr[1];
            }
        }
        return "";
    }
    else {
        return "";
    }
}


function isRole(thisRole,role) {
    for(var i=0;i<thisRole.length;i++){
        if(thisRole[i].roleName==role){
            return true;
        }
    }
    return false;
}
// 拼接日期 以 年月日
function getMyDate(str) {
    if(str==null) {
        return "-";
    }
    var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSen = oDate.getSeconds(),
        oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + "  " + oHour + ":" + oMin + ":" + oSen;
    return oTime;
}

/**
 * 分页样式 用于显示分页样式的 dom调用
 * @param parameter ajax访问url的参数
 * @param url   ajax调用的url
 * @param res   用于fn处理的数据
 * @param fn    处理数据的方法
 */
function setPage(parameter, url, res,app,attribute) {

    var options = {
        bootstrapMajorVersion: 3, //对应的bootstrap版本
        currentPage: res.number , //
        size: "normal",
        numberOfPages: 1,
        totalPages: res.totalPages,
        itemTexts: function (type, page, current) {//设置显示的样式，默认是箭头
            switch (type) {
                case "first":
                    return "首页";
                case "prev":
                    return "上一页";
                case "next":
                    return "下一页";
                case "last":
                    return "末页";
                case "page":
                    return page;
            }
        },
        //点击事件
        onPageClicked: function (event, originalEvent, type, page) {
            parameter.start = page;
            $.post(url, parameter, function (res) {
                    // app.userList = res.content.content;
                    console.log(attribute);
                    console.log( app[attribute]);
                    app[attribute] = res.content.content;
                },
                "json");
        }
    };
    if (res.totalPages > 1) {
        this.bootstrapPaginator(options);
    } else {
      this.html("");
    }

}

/**
 * 以tr的形式 渲染
 * @returns {Row} 行
 * @constructor Row
 */
function Row() {
    var tr = $("<tr></tr>");
    var count = arguments.length;
    var tds = [];
    for (var i = 0; i < count; i++) {
        tds[i] = $("<td  style='line-height:160% ;overflow: hidden;word-break:break-all;'></td>").append(arguments[i]);
        tr.append(tds[i]);
    }
    /**
     * 获取当前行
     * @returns tr
     */
    this.getRow = function () {
        return tr;
    }
    /**
     * 获取 长度
     * @returns length
     */
    this.getLength = function () {
        return tds.length;
    }
    /**
     * 获取指定索引的列
     * @param index
     * @returns td
     */
    this.getColumn = function (index) {
        return tds[index - 1];
    }
    /**
     * 追加数据至 末尾
     */
    this.appendColumn = function () {
        var localCount = arguments.length;
        for (var i = 0; i < localCount; i++) {
            tds[count + i] = $("<td  style='line-height:160% ;overflow: hidden;word-break:break-all;'></td>").append(arguments[i]);
            tr.append(tds[count + i]);
        }

    }
    /**
     * 添加数据至指定索引
     * @param index
     * @param column
     */
    this.addColumn = function (index, column) {
        if (arguments.length < 2) {
            console.log("参数数量有误！！！！");
            return;
        }
        var length = tds.length;
        for (var i = length - 1; index <= i + 1; i--) {
            tds[i + 1] = tds[i]
        }
        tds[index - 1] = $("<td  style='line-height:160% ;overflow: hidden;word-break:break-all;'></td>").append(column);
        for (var i = 0; i < tds.length; i++) {
            tr.append(tds[i]);
        }
    }
    return this;
}

/**
 * 可编辑下拉框
 * @param dropInput
 * @constructor EditableSelect
 *
 */
/* 使用方法如下
 *  var puCodeInput = $("#puCode");
    var listSel = new EditableSelect(puCodeInput);
    puCodeInput.bind("input", function () {
    var code = $(this).val();
    if (code.length !== 0) {
        var ajaxUrl = "/studio/acceptSpot/listProduceUnit";
        $.get(ajaxUrl, {code: code},
            function (res) {
                listSel.setDate(res.content, "name", "puCode", "puCode");
            },
            "json");
    } else {
        listSel.cleanData();
    }
});*/
function EditableSelect(dropInput) {

    var groupList = $('<ul class="list-group hide drop_list"> </ul>');
    dropInput.bind("blur", function () {
        setTimeout(function () {
            groupList.addClass("hide");
        }, 300);
    });
    dropInput.bind("focus", function () {
        var length = dropInput.val().length;
        if (0 !== length && groupList.html() != "") {
            groupList.removeClass("hide");
        }
    });
    /**
     * 传递 数据，需要的属性，展示下拉框
     * @param data 下拉框的数据 必填
     * 以下参数 针对json格式数据 对应json的属性
     * @param valueProperties   下拉框显示
     * @param titleProperties   下拉框title
     * @param inputProperties   input回显
     */
    this.setDate = function (data, valueProperties, titleProperties, inputProperties) {
        groupList.text("");
        groupList.addClass("hide");
        var pamLength = arguments.length;
        if (data.length > 0) {
            $.each(data, function (index, val) {
                if (pamLength == 1) {
                    var item = $('<li class="puCodeList form-control "' +
                        '>' + this + '</li>');
                    item.click(this, selectedItem);
                } else {
                    var item = $('<li class="puCodeList form-control "' +
                        'title='+eval("this." + titleProperties)+'>' + eval("this." + valueProperties) + '</li>');
                    item.click(eval("this." + inputProperties), selectedItem);
                }
                item.hover(function () {
                    $(this).addClass("drop_item_Selected");
                }, function () {
                    $(this).removeClass("drop_item_Selected");
                });
                groupList.append(item[0])
            })
            $(groupList).removeClass("hide");
        }
    };
    //下拉框被选中
    var selectedItem = function (data) {
        var value = data.data;
        dropInput.val(value);
        $(groupList).addClass("hide");
        $(groupList).html("");
    };
    /**
     *清除下拉框数据
     */
    this.cleanData = function () {
        setTimeout(function () {
            groupList.text("");
            $(groupList).addClass("hide");
        }, 300);
    }
    dropInput.after(groupList);
}

/**
 * 鼠标悬停的提示
 * @param tipMsg
 */
function hoverTip(tipMsg) {
    $(this).hover(function (e) {
        var tip = $("<div id='hoverTip' style='position:absolute;background-color: white;border:1px solid #000000 '></div>");
        tip.append(tipMsg);
        $("body").append(tip);
        tip.css({
            "top": (e.pageY + 10) + "px",
            "left": (e.pageX + 15) + "px"
        }).show("fast");
    }, function () {
        $("#hoverTip").remove();
    }).mousemove(function (e) {
        $("#hoverTip").css({
            "top": (e.pageY + 10) + "px",
            "left": (e.pageX + 15) + "px"
        }).show("fast");
    })
    return this;
}
/**
 * 鼠标点击的提示
 * @param tipMsg
 */
function clickTip(tipMsg) {
    $(this).click(function (e) {
        var tip = $("<div id='hoverTip' style='position:absolute;background-color: white;border:1px solid #000000 '></div>");
        tip.append(tipMsg);
        $("body").append(tip);
        tip.css({
            "top": (e.pageY + 10) + "px",
            "left": (e.pageX + 15) + "px"
        }).show("fast");
    });
    return this;
}

/**
 * 进行ajax请求时 的反馈效果
 */
function showLoading() {

    var loadingDom = $( document );
    var that = $(this);
    loadingDom.ajaxStart(function () {
        init();
        function init() {
            var scrollTop = $(window).scrollTop();
            var scrollLeft = $(window).scrollLeft();
            that.css({
                "left": $(window).width() / 2 + scrollLeft,
                "top": $(window).height() / 2 + scrollTop
            });
            that.show();
        }
        $(window).scroll(
            function () {
                init(that);
            }
        )
    });
    loadingDom.ajaxStop(function () {
        that.hide();
        $(window).unbind('scroll');
    });
}
/**
 * 跳转到当前元素并获取焦点
 * @param timeLength 跳转效果持续时间 单位 毫秒默认时长 为0.5秒
 */
function getFocus(timeLength) {
    var timeOut = 500;
    if (!isNaN(timeLength)) timeOut=timeLength
    var thisDom=$(this);
    thisDom.focus();

    $('html, body').animate({
        scrollTop: thisDom.offset().top - $(window).height() / 2
    },timeOut);
}

/* 	示例：	var img2 = $("<img  id='img" + this.cardStoreId + "' height='50px' width='50px' />");
            img2.FileUpload({},this.cardStoreId);
			tr.appendColumn(img2);
*/
function FileUpload(param,id) {
    var model = $('<div class="modal fade" id="upLoadModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabelTtitle">材质详情</h4></div> <div class="modal-body"><form role="form" class="form-horizontal "> <br/> <div class="form-group"> <label class="col-sm-3 control-label" for="src">详情来源</label> <div class="col-sm-6"> <label class="radio-inline"> <input type="radio" name="inlineRadioOptions" id="linkType" value="0"checked="checked"/> 外部链接（推荐） </label> <label class="radio-inline"> <input type="radio" name="inlineRadioOptions" id="localType" value="1"/> 本地上传 </label> </div> </div> <div class="form-group" id="link"> <label class="col-sm-3 control-label" for="src">链接地址</label> <div class="col-sm-7"> <input id="src" name="src" type="text" class="form-control"placeholder="请输入资源文件的url"/> </div> </div> <div class="form-group hide local" > <label class="col-sm-3 control-label" for="detaillsImg">预览图片</label> <div class="col-sm-6" id="detaillsImg"> </div> </div> <div class="form-group hide local" align="right"> <label class="col-sm-3 control-label" >&nbsp;</label> <div  class="col-sm-5 " id="fileuploadBtnCla"> <a class="btn btn-xs btn-info" id="fileuploadBtn" style="margin-top: -7.2em;"> <span class="glyphicon glyphicon-upload"></span> 上传并保存 </a> </div> </div> </form> </div> <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button> <button type="button" class="btn btn-primary" id="btnSaveLogo">保存</button> </div> </div> </div> </div>')
    var file=$('<div style="display: none"> <form class="form-horizontal" role="form"> <input id="fileupload" type="file" name="fileupload" multiple="multiple"/> </form> </div>');
    $("body").append(model).append(file);
    var paramDefault = {
        getImg: 'getImg',
        getImgInfo: 'getImgInfo',
        fileUpload: 'fileUpload',
        editFile: 'editFile',
        getUploadImg: 'getUploadImg'
    };

    $.extend(paramDefault, param);
    console.log(paramDefault);
   // $(this).attr("src", paramDefault.getImg+"/"+id);
    $(this).attr("src", paramDefault.getImg+"?id="+id);
    $(this).click(showUploadModal);
    function showUploadModal() {
        $.post(paramDefault.getImgInfo,{id:id},
            function (res) {
                initUploadModel();
                if (res.success) {
                    if (res.content != null) {
                        //if (res.content.status) {
                        //外部连接
                        if (res.content.status==2) {
                            $("#localType").attr("checked", "checked");
                            $("#link").addClass("hide");
                            $(".local").removeClass("hide");
                        }
                        if (res.content.length != 0) {
                            hideLocal(id);
                        }
                       // $("#src").val(res.content.src);
                        $("#src").val(res.content.imgUrl);
                    }
                    code = id;
                    $("#upLoadModal").modal('show');
                } else {
                    Messenger().post({
                        type: "error",
                        message: "未知错误。",
                        showCloseButton: true
                    });
                }
            },
            "json");
    }
    //默认外部链接 清数据
    function initUploadModel() {
        $("#link").removeClass("hide");
        $(".local").addClass("hide");
        $("#linkType").attr("checked", "checked");
        $("#src").val("");
        showLocal();
    }
    //默认外部链接
    function hideLocal() {
        $("#detaillsImg").text("");
        var uploadImg = $("<img id='preview' width='100px' height='100px' />").attr("src", paramDefault.getUploadImg + '?id=' + id + "&v=" + new Date().getTime());
        $("#detaillsImg").append(uploadImg);
    }
    //选择本地上传
    function showLocal() {
        $("#detaillsImg").text("");
        $("#detaillsImg").append("<img id='preview' src='*' width='100px' height='100px' />");
    }
    //logo图片刷新
    function listImgRefresh() {
       // $(this).attr("src", paramDefault.getImg+"/" + id + "?v=" + new Date().getTime());
        $(this).attr("src", paramDefault.getImg+"?id=" + id + "&v=" + new Date().getTime());
    }
    //上传按钮
    function upLoadLogo() {
        var fileupload= $("#fileupload");
        fileupload.fileupload({
            url: paramDefault.fileUpload+ '/' + id,
            type: 'post',
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            done: function (e, doneData) {
                //成功
                if (doneData.result.success) {
                    Messenger().post({
                        message: "上传完毕。",
                        showCloseButton: true
                    });
                    listImgRefresh();
                    $("#preview").attr("src", paramDefault.getUploadImg +"/"+ id + "?v=" + new Date().getTime());
                } else {
                    Messenger().post({
                        type: "error",
                        message: doneData.result.message,
                        showCloseButton: true
                    });
                }
            },
            progressall: function (e, data) {
                Messenger().post({
                    message: "正在上传请稍后。",
                    showCloseButton: true
                });
            },
            fail: function (e, data) {
                Messenger().post({
                    type: "error",
                    message: "文件过大，请重新选择！",
                    showCloseButton: true
                });
            }
        });
        //文件上传前触发事件
        fileupload.bind('fileuploadsubmit', function (e, data) {
            var status = $("input[name='inlineRadioOptions']:checked").val();
            data.formData = {status: status};  //如果需要额外添加参数可以在这里添加
        });
        fileupload.click();

    }

}
$.fn.setPage = setPage;
$.fn.hoverTip = hoverTip;
$.fn.clickTip = clickTip;
$.fn.showLoading = showLoading;
/**
 * 跳转到当前元素并获取焦点
 * @param timeLength 跳转效果持续时间 单位 毫秒默认时长 为0.5秒
 */
$.fn.getFocus = getFocus;

/**
 *  param : 默认值：
 * {
 *       getImg: 'getImg',
 *       getImgInfo: 'getImgInfo',
 *       fileUpload: 'fileUpload',  /param 方式
 *       editFile: 'editFile',      /param 方式
 *       getUploadImg: 'getUploadImg'
 *   }
 * id :选中的id
 * getImg 获取图片
 * getImgInfo 获取图片信息 显示模态框
 * fileUpload 图片上传
 * editFile 修改方式
 * getUploadImg 获取上传图片
 */
$.fn.FileUpload = FileUpload;

function fitWindows(maxWidth) {
    if(maxWidth==null) {
        maxWidth=880;
    }

    var parent = $(this).parent();
    var fitDiv1 = $('<div id="table" style="width: 100% ;"></div>');
    // if($(window).width()>maxWidth){
    //     var fitDiv2 = $(' <div style="width: 100%"></div>').append($(this));
    // }else{
    //     var fitDiv2 = $(' <div style="width: '+maxWidth+'px"></div>').append($(this));
    // }
    var fitDiv2 = $(' <div style="width: '+maxWidth+'px"></div>').append($(this));
    fitDiv1.append(fitDiv2);
    parent.append(fitDiv1);
    // $("body").append();
    // $(this).remove();
    if(!($("#table").width()>maxWidth)) {
        $("#table").css({"overflow-x": "scroll"});
    }
    window.onresize = function(){
        if(!($("#table").width()>maxWidth)) {
            $("#table").css({"overflow-x": "scroll"});
        }else{
            $("#table").removeAttr("style");
        }
    };
}
/**
 * 使某元素 自适应窗口 如 表格在小于500px下 显示不完整 则自动添加 滑动框
 * @param maxWidth 该控件的宽度 低于此宽度自适应 默认值为880px
 */
$.fn.fitWindows = fitWindows;


//监听div大小变化
(function($, h, c) {
    var a = $([]),
        e = $.resize = $.extend($.resize, {}),
        i,
        k = "setTimeout",
        j = "resize",
        d = j + "-special-event",
        b = "delay",
        f = "throttleWindow";
    e[b] = 250;
    e[f] = true;
    $.event.special[j] = {
        setup: function() {
            if (!e[f] && this[k]) {
                return false;
            }
            var l = $(this);
            a = a.add(l);
            $.data(this, d, {
                w: l.width(),
                h: l.height()
            });
            if (a.length === 1) {
                g();
            }
        },
        teardown: function() {
            if (!e[f] && this[k]) {
                return false;
            }
            var l = $(this);
            a = a.not(l);
            l.removeData(d);
            if (!a.length) {
                clearTimeout(i);
            }
        },
        add: function(l) {
            if (!e[f] && this[k]) {
                return false;
            }
            var n;
            function m(s, o, p) {
                var q = $(this),
                    r = $.data(this, d);
                r.w = o !== c ? o: q.width();
                r.h = p !== c ? p: q.height();
                n.apply(this, arguments);
            }
            if ($.isFunction(l)) {
                n = l;
                return m;
            } else {
                n = l.handler;
                l.handler = m;
            }
        }
    };
    function g() {
        i = h[k](function() {
                a.each(function() {
                    var n = $(this),
                        m = n.width(),
                        l = n.height(),
                        o = $.data(this, d);
                    if (m !== o.w || l !== o.h) {
                        n.trigger(j, [o.w = m, o.h = l]);
                    }
                });
                g();
            },
            e[b]);
    }
})(jQuery, this);