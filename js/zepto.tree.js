/**
 * Created by wangdongdong on 2015/12/7.
 */
(function ($) {
    var settings = {
        treeId: "",
        treeObj: null,
        childKey: null,
        hasChildKey: null,
        //extraAttr:[],
        callback: {
            getNodesData: null,
            onSelected: null
        }
    };

    /**
     * {
     * id:
     * name:
     * children:{ id: name: }
     * }
     *
     */
    $.fn.tree = {
        init: function (obj, _settings, treeNodes) {
            var setting = $.extend(true, settings, _settings);
            setting.treeId = obj.attr('id');
            setting.treeObj = obj;
            if (!treeNodes) {
                console.warn('no treeNodes data');
                return;
            }
            initTree(treeNodes);
            bindEvent(setting);
            return
        }

    };


    function bindEvent(settings) {
        console.log('#'+settings.treeId+'li a');
        $('#'+settings.treeId+' li a').live('click',function(){
            var $me = $(this);
            var id = $me.attr('id');
            id = id.substr(0,id.indexOf('_a'));
            var $ul = $('#'+id+'_ul');
            var $icon = $('#'+id+'_icon');
            if($ul.length > 0 ){
                if($ul.hasClass('open')){
                    $ul.hide();
                    $ul.removeClass('open').addClass('close');
                    $icon.removeClass('icon_open').addClass('icon_close');

                }else if($ul.hasClass('close')){
                    $ul.show();
                    $ul.removeClass('close').addClass('open');
                    $icon.removeClass('icon_close').addClass('icon_open');
                }else{
                    var treeNodesData = null;//从后台获取数据
                    if(typeof settings.callback.getNodesData == 'function'){
                        treeNodesData = settings.callback.getNodesData.call(this,id);
                    }
                    showChild($ul,treeNodesData);
                    $ul.removeClass('close').addClass('open');
                    $icon.removeClass('icon_close').addClass('icon_open');
                }

            }else{
                typeof  settings.callback.onSelected == 'function' ? settings.callback.onSelected.call($me): void 0;
            }

        });


    }
    function showChild($ul,treeNodesData){
        //var $me = $(this);
        $.each(treeNodesData,function(i,itemData){
            appendChildTpl($ul,itemData);
        });
    }
    function getTopTpl(){
        return '<ul class="ztree" id="ztree"></ul>';
    }
    function getRootTpl(nodesData) {
        return ['<ul id="'+nodesData.id+'_ul"></ul>'].join('');
    };
    function getChildTpl(childrenData) {
        //return ['<li id="' + childrenData.id + '">' + childrenData.name + '</li>'].join('');
        return [
            '<li id="'+childrenData.id+'"data-userid='+childrenData.UserID+'>',
                '<a id="'+childrenData.id+'_a">',
                '<span id="'+childrenData.id+'_icon" class="tree-btn "></span>',
                '<span id="'+childrenData.id+'_span" class="node_name">'+childrenData.name+'</span>',
                '</a>',
            '</li>'
        ].join('');
    }

    function initTree(nodesData) {
        var $treeObj = settings.treeObj,
            childData = nodesData[settings.childKey];

        var $topUl = $(getTopTpl());//最顶上的
        var $topLi = $(getChildTpl((nodesData)));
        $topLi.find('.tree-btn').addClass('icon_open');

        $topUl.append($topLi);
        var $ul = $(getRootTpl(nodesData)).addClass('open');
        $topLi.append($ul);



        //设置分支
        $.each(childData, function (i, itemData) {
            appendChildTpl($ul,itemData)
        });
        $treeObj.append($topUl);

    };
    function appendChildTpl($rootTpl,itemData){
        var $chidTpl = $(getChildTpl(itemData));
        //setExtraAttr($chidTpl,itemData);
        if (itemData[settings.hasChildKey]) {
            $chidTpl.append($(getRootTpl(itemData)));
            $chidTpl.find('.tree-btn').addClass('icon_close');
        }
        $rootTpl.append($chidTpl);
    }
    //function setExtraAttr(tpl,data){
    //    if(settings.extraAttr && settings.extraAttr.length > 0 ){
    //        $.each(settings.extraAttr,function(i,atrrName){
    //            $(tpl).attr('data-'+atrrName,data.item);
    //        });
    //    }
    //}
})(Zepto);