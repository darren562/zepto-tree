
$(function () {
    $('body').append(getPageTreeTpl());

    var OrgTree = {};
    var deptId = '';//默认全公司
    OrgTree.initTree = function () {
        var settings = {
            childKey: 'children',
            hasChildKey: 'hasChildren',
            callback: {
                getNodesData: getData,
                onSelected: setSelectedInfo
            }
        };
        var initData = getData();
        var topID = initData[0].id;
        var topName = initData[0].name;
        var treeNodesData = {
            id: topID,
            name: topName,
            children: getData(topID)
        };

        var $treeOrg = $('#tree-wrap');
        $.fn.tree.init($treeOrg, settings, treeNodesData);

    }
    //这里去后台获取数据(模拟数据)
    function getData(id) {
        var arr = [];
        for (var num =0; num < 4; num++) {
            var node = {};
            node.id = Math.ceil(Math.random()*100);
            node.UserID = node.id;//UserID 可以跟node.id相同也可以不同
            node.name = '张三' + node.id;
            if(num == 2 || num == 3){
                node.hasChildren = false;
            }else{
                node.hasChildren = true;
            }
            arr.push(node);

        }
        return arr;
    }

    function setSelectedInfo() {
        var me = this;



        var $mark = $(me).find('.selected_icon');
        if ($mark.length > 0) {
            $mark.remove();
            removeSelectedPerson(me);
        } else {
            var userId = $(me).parent('li').attr('data-userid');
            var $existItem = $('.person-item[data-userid="'+userId+'"]');
            if ($existItem && $existItem.length > 0){//已经被搜索选中
                return ;
            }
            setMarkAndSelectedPerson(me);
            //$('#userf2cec4bd-a91b-4fa1-b1dd-6db038e6685f_a').append($(getMarkTpl()));
        }
        setSelectedPersonCount();


    };

    function setMarkAndSelectedPerson(me) {
        $(me).append($(getMarkTpl()));
        var id = $(me).parent().attr('id');
        var userId = $(me).parent().attr('data-userid');
        var name = $(me).find('.node_name').text();
        var personInfo = {id: id, userId: userId, name: name};
        var $tpl = $(getPersonItemTpl(personInfo));
        $('.selected-person').append($tpl);
    };

    function removeSelectedPerson(me) {
        var id = $(me).parent().attr('id');
        var $personItem = $('.selected-person').find('[data-id="' + id + '"]');
        $personItem.remove();
    };
    function getMarkTpl() {
        return [
            '<span class="selected_icon"></span>'
        ].join('');
    };
    function setSelectedPersonCount() {
        var count = $('.selected-person .person-item').length;
        if (count > 0) {
            $('.submit-btn-tree').text('确定(' + count + ')');
        } else {
            $('.submit-btn-tree').text('确定');
        }

    };
    function getPersonItemTpl(itemInfo) {
        return '<div class="person-item" data-id="' + itemInfo.id + '" data-userid="' + itemInfo.userId + '">' + itemInfo.name + '</div>';
    };

    $('.cancel-btn-tree').on('click', function () {
        $('.zepto-tree').hide();
        initPageTree();
    });
    function initPageTree() {

        $('.zepto-tree .img-wrap').show();
        $('.zepto-tree .input-wrap').hide();
        $('.tree-wrap').show();
        $('.search-result-wrap').hide().find('ul').empty();
        $('.keyword-input').val('');
    }

    $('.submit-btn-tree').on('click', function () {

        //var selectedPerson =
        var $personCnt = $('.selected-person .person-item');
        if ($personCnt.length == 0) {
            $.alert('请选择人员');
            return;
        }
        var arr = [];
        $.each($personCnt, function (i, item) {
            item = $(item);
            var id = item.attr('data-userid');
            var name = item.text();
            arr.push({id: id, name: name});
        });
        //sessionStorage.setItem('selectedPerson',JSON.stringify(arr));

        $('.zepto-tree').hide();
        setSelectedPerson(JSON.stringify(arr));
        //window.location.href = document.referrer;
    });
    function setSelectedPerson(selectedPerson) {
        var me = this;
        if (!selectedPerson) {
            return;
        }
        selectedPerson = JSON.parse(selectedPerson);
        sessionStorage.removeItem('selectedPerson');
        var $wrap = $('.choose-person').empty().css('color', '#000');
        $.each(selectedPerson, function (i, item) {
            var tpl = '<span class="pers-info" data-id="' + item.id + '">' + item.name + '、' + '</span>';
            $wrap.append($(tpl));
        });


    };
    //function getPersTpl(persInfo){
    //    return '<span class="pers-info" data-id="'+persInfo.id+'">'+persInfo.name+'、'+'</span>';
    //};

    $('.person-item').live('click', function () {
        var id = $(this).attr('data-id');
        var $mark = $('#' + id).find('.selected_icon');
        if ($mark.length > 0) {
            $mark.remove();
        }
        $(this).remove();
        setSelectedPersonCount();
    });

    $('.zepto-tree .search-bt').on('click', function () {
        $(this).find('.img-wrap').hide();
        $('.zepto-tree .input-wrap').show().find('input').focus();
    });
    //模糊搜索
    $('#keyword-input').on('input',function(){
        if($(this).prop('comStart')) return;    // 中文输入过程中不截断
        //console.log(this.value);
        searchUsers(this.value);
    }).on('compositionstart',function(){
        $(this).prop('comStart', true);
        //console.log('中文输入：开始');
    }).on('compositionend', function(){
        $(this).prop('comStart', false);
        //console.log('中文输入：结束');
    });


    function searchUsers(kw) {
        //模拟数据
        var sourceData = [{id:1,name:'张三01'},{id:2,name:'张三02'},{id:3,name:'张三03'},{id:4,name:'张三04'},{id:5,name:'张三05'}];
        showSearchResult(sourceData);
    }

    function showSearchResult(list) {
        $('#tree-wrap').hide();
        $('.search-result-wrap').show();
        var $ul = $('.search-result-wrap ul').empty();


        $.each(list, function (i, item) {
            //var liTpl = '<li class="li-item" data-id="'+item.UserId+'">'+item.UserName+'</li>'
            $ul.append(getLiItemTpl(item));
        });

    }

    function getLiItemTpl(item) {
        if (!item.UserImg || item.UserImg.indexOf('null') != -1) {
            item.UserImg = '../images/pic.png';
        }
        return [
            '<li class="li-item" data-id="' + item.id + '">',
            //'<div class="userimg-wrap"><img src="'+item.UserImg+'"></div>',
            //'<img src="' + item.UserImg + '">',
            '<div class="user-name">' + item.name + '</div>',
            '</li>'
        ].join('');
    }

    $('.search-result-wrap li').live('click', function () {
        var userId = $(this).attr('data-id');
        var name = $(this).find('.user-name').text();
        var personInfo = {id: userId, userId: userId, name: name};
        var $existItem = $('.person-item[data-userid="'+userId+'"]');
        if (!($existItem && $existItem.length > 0)) {//没有被选中
            var $tpl = $(getPersonItemTpl(personInfo));
            $('.selected-person').append($tpl);
        }
        setSelectedPersonCount();
        initPageTree();
    });
    function getPageTreeTpl(){
        return[
            '<div class="zepto-tree" style="display: none;">',
            '<div class="tree-search-warp">',
            '<div class="search-bt">',
            '<div class="img-wrap">',
            '<img src="images/search-w.png"><span>搜索</span>',
            '</div>',
            '<div class="input-wrap" style="display: none">',
            '<img src="images/search-w.png">',
            '<input class="keyword-input" id="keyword-input" type="text" style="">',
            '</div>',
            '</div>',
            '</div>',
            '<div class="tree-wrap content-block" id="tree-wrap"></div>',
            '<div class="search-result-wrap content-block" style="display: none">',
            '<ul></ul>',
            '</div>',
            '<div class="tree-btn-wrap">',
            '<div class="cancel-btn-tree btn-wrap ">取消</div>',
            '<div class="submit-btn-tree btn-wrap ">确定</div>',
            '</div>',
            '<div class=" selected-person"></div>',
            '</div>',
        ].join('');
    }

    window.OrgTree = OrgTree;
});
