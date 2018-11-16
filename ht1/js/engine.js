//--------- base class Container ---------------
function Container(nodeName, className, parent) {
    this.container = document.createElement(nodeName);
    this.parent = parent;
    this.parent.appendChild(this.container);                        //зачем была создана переменная parent?             подразумевалось ли здесь использование parent.appendChild(this.container);
    this.container.className = className ? className : '';
}

Container.prototype.render = function (text) {
    this.container.innerHTML = text;
}

Container.prototype.remove = function () {
    this.container.remove();
}



//---------- base class Menu -------------
function Menu(nodeName, className, parent, itemsConfig) {
    Container.call(this, nodeName, className, parent);
    this.items = this.createItems(itemsConfig);
}

Menu.prototype = Object.create(Container.prototype);    
Menu.prototype.constructor = Menu;

Menu.prototype.createItems = function (itemsConfig) {
    var self = this;
    return itemsConfig.items.map(function (item, i) {
        return new MenuItem(itemsConfig.itemNodeName, itemsConfig.itemClassName, self.container, itemsConfig.linkClassName, item, itemsConfig.mainContainerNodeName);
    });
}

Menu.prototype.addItem = function(item, parent) {
}

Menu.prototype.setItemValue = function(id, key, value) {
    var item = this.getItemById(id);
    item.setValue(key, value);
}

Menu.prototype.getItemById = function(id) {
}

Menu.prototype.removeItem = function(id) {
}

Menu.prototype.render = function () {
    var self = this;
    this.items.forEach(function (item) {
        item.render();
    });
}


//--------- base class MenuItem ------------
function MenuItem(nodeName, className, parent, linkClassName, item, mainNodeName) {
    Container.call(this, nodeName, className, parent);
    this.link = document.createElement('a');
    this.link.className = linkClassName;
    this.container.appendChild(this.link);
    this.item = Object.assign({},item);     //область видимости нового объекта - функция - инкапсуляция 
    if (this.item.items) {
        this.innerContainer = document.createElement(mainNodeName);
        this.container.appendChild(this.innerContainer);
        var self = this;
        this.items = this.item.items.map(function (item) {
            return new MenuItem(nodeName, className, self.innerContainer, linkClassName, item, mainNodeName);
        });
    }
}

MenuItem.prototype = Object.create(Container.prototype);
MenuItem.prototype.constructor = MenuItem;

MenuItem.prototype.render = function () {
    this.link.innerHTML = this.item.title;
    this.link.setAttribute('href', this.item.route);
    if (this.items) this.items.forEach(function (item) {
        item.render();
    });
}

MenuItem.prototype.getId = function() {
    return this.item.id;
}

MenuItem.prototype.setValue = function(key, value) {
    this.item[key] = value;
}

var itemsConfig = {
    mainContainerNodeName: 'ul',
    itemNodeName: 'li',
    itemClassName: 'some-class',
    linkClassName: 'some-link-class',
    items: [
        {
            id: "main",
            route: "/",
            title: "Главная"
        },
        {
            id: "catalogue",
            route: "/catalogue/",
            title: "Каталог",
            items: [
                {
                    id: "catalogue/any-name",
                    route: "/catalogue/anything",
                    title: "Что-то",
                    items: [
                        {
                            id: "catalogue/any-name/any-name-more",
                            route: "/catalogue/anything/more",
                            title: "Что-то еще",
                      }
                    ]
                }
            ]
        },
        {
            id: "gallery",
            route: "/gallery/",
            title: "Галерея"
        }
    ]
};

var menu = new Menu(itemsConfig.mainContainerNodeName, 'some-class-name', document.querySelector('#append'), itemsConfig);
menu.render();

//menu.setItemValue('catalogue', 'route', '/catalog/');
menu.render();
menu.removeItem('gallery');
menu.render();
menu.addItem({
            id: "gallery",
            route: "/gallery/",
            title: "Галерея"
        }, 
        'catalogue');

var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function() { 
  if (xhr.readyState != 4) return;

  if (xhr.status != 200) {
      alert(xhr.status + ': ' + xhr.statusText);
  } else {
      alert(xhr.responseText);
      itemsConfig.items[0].title = xhr.responseText; 
      menu.render();
  }
}

xhr.open('GET', 'https://jsonplaceholder.typicode.com/todos/1', true);
xhr.send();