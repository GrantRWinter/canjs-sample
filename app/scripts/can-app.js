$(document).ready(function(){
        can.fixture({
    "GET /services/todos": function(){
        return [
            { id: 0, name: "Poster", quantityAvailable: 0, countIn: 12, add: 0, totalIn: 12, comp: 0, countOut: 5,  totalSold: 7, price: 10, gross: 70, completed: false },
            { id: 1, name: "Tee-shirt", quantityAvailable: 0, countIn: 0, add: 0, totalIn: 9, comp: 0, countOut: 0,  totalSold: 0, price: 30, gross: 60, completed: false },
            { id: 2, name: "Hoodie", quantityAvailable: 0, countIn: 0, add: 0, totalIn: 8, comp: 0, countOut: 0,  totalSold: 0, price: 60, gross: 180, completed: false }
        ]
    },
    "POST /services/todos": function(){
        console.log("you just created an item");
        return {
            id: Math.floor( Math.random()*10000 )
        }
    },
    "DELETE /services/todos/{id}": function(){
        return {}
    },
    "PUT /services/todos/{id}": function(){
        return {}
    }
});


Todo = can.Model.extend({
    findAll: "/services/todos",
    create: "/services/todos",
    destroy: "/services/todos/{id}",
    update: "/services/todos/{id}"
},{})

Todo.List = can.Model.List.extend({
    Map: Todo
},{
    filter: function(tester){
        var todos = new Todo.List();
        this.each(function(todo){
            if(tester(todo)){
                todos.push(todo)
            }
        })
        return todos;
    },
    remainingCount: function(){
        return this.remaining().length;
    },
    remaining: function(){
        return this.filter(function(todo){
            return !todo.attr('completed')
        })
    },
    completed: function(){
        return this.filter(function(todo){
            return todo.attr('completed')
        })
    },
    completedCount: function(){
        return this.completed().length
    },
    calculatedNumber: function(){
        return this.remaining().length + 4
    },
    destroyCompleted: function(){
        this.completed().each(function(todo){
            todo.destroy()
        })
    }
})


can.Component.extend({
    tag: "todos-create",
    template: '<input id="new-todo" '+
        'placeholder="What needs to be done?">',
    events : {
        "input keyup": function( el, ev ) {
            if(ev.keyCode == 13){
                new Todo({
                    name: el.val(),
                    completed: false
                }).save();
                el.val("")
            }
        }
    }
});

can.Component.extend({
    tag: "todos-list",
    template: can.view("todos-list-template"),
    scope: {
        edit: function(todo){
            todo.attr("editing", true)
        },
        updateName: function(todo, el){
            todo.attr("name", el.val());
        },
        
        updateQuantityAvailable: function(todo, el){
            todo.attr("quatityAvailable", el.val());
            
        },
        updateCountIn: function(todo, el){
            todo.attr("countIn", el.val());
            add = todo.attr( "add" );
            todo.attr("totalIn", parseInt(el.val()) + parseInt(add) )
            todo.attr("editing", false)
        },
        updateAdd: function(todo, el){
            todo.attr( "add", el.val() );
            countIn = parseInt(todo.attr( "countIn" ));
            todo.attr( "totalIn", parseInt(el.val()) + countIn); 
            todo.attr( "editing", false );
        },
        updateComp: function(todo, el){
            todo.attr("comp", el.val());
            countOut = parseInt(todo.attr( "countOut" ));
            totalIn = parseInt(todo.attr( "totalIn" ));
            totalSold = todo.attr("totalSold", totalIn - countOut - parseInt( el.val() ));
            todo.attr( "gross", totalSold )
            todo.attr("editing", false)
        },
        updateCountOut: function(todo, el){
            todo.attr("countOut", el.val());
            comp = parseInt(todo.attr( "comp" ));
            totalIn = parseInt(todo.attr( "totalIn" ));
            todo.attr("totalSold", totalIn - comp - parseInt( el.val() ));
            todo.attr("editing", false)
        },
    },
    events: {
        "{Todo} created": function(Todo, ev, newTodo){
            this.scope.attr('todos').push(newTodo)
        }
    }
});

can.Component.extend({
    tag: "todos-app",
    scope: {
        todos: new Todo.List({}),
        displayedTodos: function(){
            var filter = can.route.attr("filter")
            if(filter == "active"){
                return this.attr('todos').remaining()
            } else if(filter == "completed") {
                return this.attr('todos').completed()
            } else {
                return this.attr('todos')
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
            this.scope.attr('todos').each(function(todo){
                todo.attr("completed", completed)
            })
        }
    }
})

can.route.ready()
var frag = can.view("todos-app-template",{})



$("#app").append(frag);
}); 

