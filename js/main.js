'use strict';

document.addEventListener("DOMContentLoaded", function(){       //Страница загрузилась
    $('.mainBlock').on('click', function(e){
        var y = e.pageY,
            x = e.pageX;
        main.getHeight($(this), y, x);
    });
});


var main = {
    count: 1,
    getHeight: function(block, y, x){        //получаем здесь стартовый блок с координатами клика. Вычисляем границы и размеры блоков, изменяем.
        var top = $(block).offset().top,
            bottom = top + $(block).height(),
            left = $(block).offset().left,
            right = left + $(block).width(),
            pageHeight = $('body').height(),
            pageWidth = $('body').width(),
            fromTop = y - top,
            fromLeft = x - left,
            fromRight = right - x,
            fromBottom = bottom - y,
            heightOfNewBlock,
            widthOfNewBlock;

        if(fromTop <= fromLeft && fromTop <= fromRight && fromTop <= fromBottom){
            heightOfNewBlock = $(block).height() - fromBottom;
            widthOfNewBlock = $(block).width();
            $(block).height(Math.round(($(block).height()-heightOfNewBlock) / (pageHeight/100)) + '%');
            main.createBlock($(block), heightOfNewBlock, widthOfNewBlock, 'before');
        }
        else if(fromBottom < fromLeft && fromBottom < fromRight && fromBottom < fromTop){
            heightOfNewBlock = $(block).height() - fromTop;
            widthOfNewBlock = $(block).width();
            $(block).height(Math.round(fromTop / (pageHeight/100)) + '%');
            main.createBlock($(block), heightOfNewBlock, widthOfNewBlock, 'after');
        }
        else if(fromRight < fromLeft && fromRight < fromBottom && fromRight < fromTop){
            widthOfNewBlock = Math.round($(block).width() - fromLeft);
            heightOfNewBlock = $(block).height();
            $(block).width(Math.round(fromLeft / (pageWidth/100)) + '%');
            main.createBlock($(block), heightOfNewBlock, widthOfNewBlock, 'after');
        }else{
            widthOfNewBlock = Math.round($(block).width() - fromRight);
            heightOfNewBlock = $(block).height();
            $(block).width(Math.round(($(block).width()-widthOfNewBlock) / (pageWidth/100)) + '%');
            main.createBlock($(block), heightOfNewBlock, widthOfNewBlock, 'before');
        }

    },
    createBlock: function(block, height, width, position){       //Создаем новый блок
        var color = main.getColor(),
            currentHeight = height / ($('body').height()/100),
            currentWidth = width /($('body').width()/100) ;
        ++main.count;
        switch (position) {
            case 'after': $('<div>', {
                    'data-index': main.count,
                    css: {
                        width: Math.round(currentWidth) + '%',
                        height: Math.round(currentHeight) + '%',
                        backgroundColor: color
                    },
                    on: {
                        click: function (e) {
                            var y = e.pageY,
                                x = e.pageX;
                            main.getHeight($(this), y, x);
                        }
                    }
                }).insertAfter(block);
            break;
            case 'before': $('<div>', {
                'data-index': main.count,
                css: {
                    width: Math.round(currentWidth) + '%',
                    height: Math.round(currentHeight) + '%',
                    backgroundColor: color
                },
                on: {
                    click: function (e) {
                        var y = e.pageY,
                            x = e.pageX;
                        main.getHeight($(this), y, x);
                    }
                }
            }).insertBefore(block);
                break;
        }

        main.sendInfo(main.count, color, height);
    },
    getColor: function(){       //Получаем рандомный цвет
        var color = '#' + Math.round((Math.random() * (999999 - 100000) + 100000));
        return color;
    },
    sendInfo: function(index, color, height){ //Отправка данных на сервер
       formData.all.push({
           'index':index,
           'color':color,
           'width':$('body').width(),
           'height':height
       });
        $.ajax({
            url:'dataparser.php',
            type:'POST',
            data:'jsonData=' + $.toJSON(formData),
            success: function(res) {
                alert(res);
            }
        });
    }
};

var formData = {
    all: []
};