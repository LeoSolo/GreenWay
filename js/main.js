'use strict';

document.addEventListener("DOMContentLoaded", function(){       //Страница загрузилась
    $('.mainBlock').on('click', function(e){
        var top = e.pageY;
        main.getHeight($(this), top);
    });
});


var main = {
    count: 1,
    colors: ['red', 'blue', 'purple', 'green', 'yellow', 'brown', 'black', 'pink', 'orange', 'aqua', 'grey', 'teal', 'olive', 'fuchsia'],
    getHeight: function(block, top){        //получаем здесь высоту клика и блок с которым работаем. Вычисляем высоту начального и нового блоков.
        if(main.colors.length != 0) {
            var heightOfNewBlock = $('body').height();
            $(block).height( (top - $(block).offset().top) / ($('body').height()/100) + '%');
            for(var i = 0; i < $('div').length; i++){
                heightOfNewBlock -= $('div').eq(i).height();
            }
            main.createBlock($(block), heightOfNewBlock);
        }else{
            alert('Цветов больше нет!');
        }
    },
    createBlock: function(block, height){       //Создаем новый блок
        var color = main.getColor(),
            currentHeight = height / ($('body').height()/100);
        ++main.count;
        $('<div>', {
            'data-index': main.count,
            css: {
                width: '100%',
                height: currentHeight + '%',
                backgroundColor: color
            },
            on: {
                click: function(e){
                    var top = e.pageY;
                    main.getHeight($(this), top);
                }
            }
        }).insertAfter(block);

        main.sendInfo(main.count, color, height);
    },
    getColor: function(){       //Получаем рандомный цвет
        //TODO можно дописать рандомизатор на RGB
        var colorCount = Math.floor(Math.random() * main.colors.length),
            color = main.colors[colorCount];
        main.colors.splice(colorCount, 1);
        return color;
    },
    sendInfo: function(index, color, height){ //Отправка данных на сервер
        var formData = {
            'index':index,
            'color':color,
            'width':$('body').width(),
            'height':height
        };
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