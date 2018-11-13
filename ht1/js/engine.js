function Container()
{
    this.id = ""; 
    this.className = "";
    this.htmlCode = "123"; 
}

Container.prototype.render = function()
{
   return this.htmlCode;
}

Container.prototype.remove = function() { 
    var node = document.querySelector("#" + this.id);
    node.remove();
    return;
}

function Menu(my_id, my_class, my_items){
   Container.call(this);
   this.id = my_id;
   this.className = my_class;
   this.items = my_items;
}

Menu.prototype = Object.create(Container.prototype);
Menu.prototype.constructor = Menu;
Menu.prototype.render = function(){
	var result = "<ul class='"+this.className+"' id='"+this.id+"'>";
	
	for(var item in this.items){
		if(this.items[item] instanceof MenuItem){
			result += this.items[item].render();
		}
	}
	
	result += "</ul>";
	return result;
}

function MenuItem(my_href, my_name, id){
   Container.call(this);
   this.className = "menu-item";
   this.id = id;
   this.href = my_href;
   this.itemName = my_name;
}

MenuItem.prototype = Object.create(Container.prototype);
MenuItem.prototype.constructor = MenuItem;

MenuItem.prototype.render = function(){
	return "<li id='" + this.id + "' class='"+this.className+"' href='"+ this.href +"'>" + this.itemName + "</li>";
}

/*function SubMenu() {
    Menu.call(this);
    this.id = "sub_" + m_item1.id;
    this.class = ""
} */

var m_item1 = new MenuItem("/", "Главная", "m_item1");
var m_item2 = new MenuItem("/catalogue/", "Каталог", "m_item2");
var m_item3 = new MenuItem("/gallery/", "Галерея", "m_item3");
var m_items = {0: m_item1, 1: m_item2, 2: m_item3};
//var sub_m_item2 = new SubMenu("/kitchen/", "Кухня", "m_item2");

var menu = new Menu("my_menu", "My_class", m_items);
var div = document.write(menu.render());
m_item2.remove();