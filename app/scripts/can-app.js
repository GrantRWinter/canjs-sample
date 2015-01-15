$(document).ready(function(){
        can.fixture({
    "GET /services/items": function(){
        return [
            { id: 0, name: "Skate Poster", image: "/images/poster.jpg", quantityAvailable: 0, countIn: 0, add: 0, totalIn: 0, comp: 0, countOut: 0,  totalSold: 0, price: 10, gross: 0, completed: false },
            { id: 1, name: "AC/DC Tee-shirt", image: "/images/acdc.jpg", quantityAvailable: 0, countIn: 0, add: 0, totalIn: 0, comp: 0, countOut: 0,  totalSold: 0, price: 35, gross: 0, completed: false },
            { id: 2, name: "Weird Al Bobble Head", image: "/images/wa.jpg", quantityAvailable: 0, countIn: 0, add: 0, totalIn: 0, comp: 0, countOut: 0,  totalSold: 0, price: 30, gross: 0, completed: false }
        ]
    },
    "POST /services/items": function(){
        console.log("you just created an item");
        return {
            id: Math.floor( Math.random()*10000 )
        }
    },
    "DELETE /services/items/{id}": function(){
        return {}
    },
    "PUT /services/items/{id}": function(){
        return {}
    }


});


Merch = can.Model.extend({
    findAll: "/services/items",
    create: "/services/items",
    destroy: "/services/items/{id}",
    update: "/services/items/{id}"
},{})

Merch.List = can.Model.List.extend({
    Map: Merch
},{
    filter: function(tester){
        var items = new Merch.List();
        this.each(function(item){
            if(tester(item)){
                items.push(item)
            }
        })
        return items;
    },
    remainingCount: function(){
        return this.remaining().length;
    },
    remaining: function(){
        return this.filter(function(item){
            return !item.attr('completed')
        })
    },
    completed: function(){
        return this.filter(function(item){
            return item.attr('completed')
        })
    },
    completedCount: function(){
        return this.completed().length
    },
    calculatedNumber: function(){
        return this.remaining().length + 4
    },
    destroyCompleted: function(){
        this.completed().each(function(item){
            item.destroy()
        })
    }
})


can.Component.extend({
    tag: "items-create",
    template: '<input id="new-item" '+
        'placeholder="What needs to be done?">',
    events : {
        "input keyup": function( el, ev ) {
            if(ev.keyCode == 13){
                new Merch({
                    name: el.val(),
                    completed: false
                }).save();
                el.val("")
            }
        }
    }
});

can.Component.extend({
    tag: "items-list",
    template: can.view("items-list-template"),
    scope: {
        edit: function() {
            item.attr("editing", true)
        },
        editCountIn: function(item){
            item.attr("editing", true);
            this.item.attr("autofocus", true)
        },
        editAdd: function(item){
            item.attr("editing", true)
        },
        updateName: function(item, el){
            item.attr("name", el.val());
        },
        
        updateQuantityAvailable: function(item, el){
            item.attr("quatityAvailable", el.val());
            
        },
        updateCountIn: function(item, el){
            var countIn = item.attr("countIn", el.val());
            var add = item.attr( "add" );
            var totalIn = item.attr("totalIn", parseInt(el.val()) + parseInt(add) );
            item.attr("editing", false)
        },
        updateAdd: function(item, el){
            var add = item.attr( "add", el.val() );
            var countIn = parseInt(item.attr( "countIn" ));
            var totalIn = item.attr("totalIn", parseInt(el.val()) + parseInt(countIn) );
            
            item.attr( "editing", false );
        },
        updateComp: function(item, el){
            item.attr("comp", el.val());
            countOut = parseInt(item.attr( "countOut" ));
            totalIn = parseInt(item.attr( "totalIn" ));
            totalSold = item.attr("totalSold", totalIn - countOut - parseInt( el.val() ));
            gross = parseInt(item.attr("totalSold") * parseInt(item.attr("price")));
            item.attr( "gross", gross )
            item.attr("editing", false)
        },
        updateCountOut: function(item, el){
            item.attr("countOut", el.val());
            comp = parseInt(item.attr( "comp" ));
            totalIn = parseInt(item.attr( "totalIn" ));
            totalSold = item.attr("totalSold", totalIn - countOut - parseInt( el.val() ));
            gross = parseInt(item.attr("totalSold") * parseInt(item.attr("price")));
            item.attr("totalSold", totalIn - comp - parseInt( el.val() ));
            item.attr("editing", false)
        }

    },
    events: {
        "{Merch} created": function(Merch, ev, newMerch){
            this.scope.attr('items').push(newMerch)
        }
    }

});

can.Component.extend({
    tag: "items-app",
    scope: {
        items: new Merch.List({}),
        displayedMerchs: function(){
            var filter = can.route.attr("filter")
            if(filter == "active"){
                return this.attr('items').remaining()
            } else if(filter == "completed") {
                return this.attr('items').completed()
            } else {
                return this.attr('items')
            }
        }
    },
    helpers: {
        plural : function(word, num){
            var val = num();
            return val == 1 ? word : word+"s";
        },
        link: function(title, filter){
            var attr = {};
            if(filter){
                attr.filter = filter;
            }
            
            return can.route.link(title,attr,{
                className: can.route.attr("filter") == filter ? "selected" : ""
            })
        }
    },
    events: {
        "#toggle-all click": function(el){
            var completed = el.prop("checked")
            this.scope.attr('items').each(function(item){
                item.attr("completed", completed)
            })
        }
    }
})

can.route.ready()
var frag = can.view("items-app-template",{})



$("#app").append(frag);
}); 





