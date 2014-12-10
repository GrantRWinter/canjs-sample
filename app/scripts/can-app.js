$(document).ready(function(){
    var Component = can.Component.extend({
        tag: 'quant-avail',
        template: '-7',
        scope: {
            count: 0,
        }
    });

    var Component = can.Component.extend({
        tag: 'count-in',
        template: '12'
    })

    var Component = can.Component.extend({
        tag: 'add',
        template: '0'
    })

    var Component = can.Component.extend({
        tag: 'total-in',
        template: '12'
    })

    var Component = can.Component.extend({
        tag: 'complementary',
        template: '0'
    })

    var Component = can.Component.extend({
        tag: 'count-out',
        template: '5',
        scope: {
            count: 0,
            update: function(){
                
            }
        }
    })

    var Component = can.Component.extend({
        tag: 'total-sold',
        template: '7'
    })

    var Component = can.Component.extend({
        tag: 'gross',
        template: '70.00'
    })
    var Component = can.Component.extend({
        tag: 'click-counter',
        template: '<a href="javascript://" can-click="updateCount">' +
                'Click Me</a>' +
                '<p id="msg">Clicked {{count}} times</p>',
        scope: {
            count: 0,
            updateCount: function() {
                this.attr('count', this.attr('count') + 1);
            }
        }
    });

    $('#content').html(can.view('main-template', {}));
$('#app').html(can.view('merchApp', {}))
}); 

