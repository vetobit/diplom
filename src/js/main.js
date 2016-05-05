window.addEventListener("DOMContentLoaded",function(){                                // При загрузке элементов страницы вызвать функцию
  window.location.hash="login";                                                       // Переходим на страницу авторизации
});
var obj={                                                                             // Создаём главный объект программы (через него осуществляется вызов фукций)
  user:{                                                                              // Объявляем свойство - объект который будет хранить пользователя 

  },
  overheads:[],
  requests:[],
  data:[],
  users:[],
  init:function(authorization){                                                       // Функция которая наполняет главный объект данными после успешной авторизации (принимает результат авторизации)
    if(authorization){                                                                // Если авторизация успешная то 
      var rights=[                                                                    // Делаем соответствия привелегий пользователя со страницей сайта
            "admin",                                                            
            "picker",
            "client"
          ];
      obj.getData(true);
      obj.getOverheads(true);
      obj.getRequests(true);
      obj.getUsers(true);
      window.location.hash=rights[obj.user.rights];                                   // Меняем страницу сайта взависимости от привелегий пользователя
    }
    else{                                                                             // Если авторизация не успешна то 
      console.log("Не правильный логин или пароль");                                  // выводим ошибку
    }
  },
  getFile:function(url,func){                                                         // Функция получения данных из файла (принимает путь до файла и функцию которая выполняется после получения файла)
    var xhr=new XMLHttpRequest();                                                     // Объявляем новый объект запроса к файлу
    xhr.open("GET", url, true);                                                       // Настраиваем объект соединения: пишем какой метод передачи данных будет использоваться, путь до файла, ассихронный способ получения данных
    xhr.onreadystatechange=function(){                                                // Говорим что делать, когда объект соединения будет готов
      if(xhr.status==200 && xhr.readyState ==4){                                      // Проверим ответ сервера, он должен быть 200 и готовность объекта соединения, который должен быть 4
        func(xhr.responseText);                                                       // Если всё совпало, то вызовем функцию которую передали сюда
      }                                                     
    };
    xhr.send(null);                                                                   // Отправим на сервер пустой запрос
  },
  rewriteFile:function(item,url){                                                     // Функция которая перезаписывает файл на сервере (принимает объект который запишем и путь до файла)

  },
  authorization:function(responseText){                                               // Функция авторизации (принимает текст из файла)
    if(responseText!=false){                                                          // Если текст из файла не равен false
      var users = JSON.parse(responseText),                                           // Тогда запишем текст из файла в объект, там будут лежать пользователи (текст конвертируем в объект)
          flag = false;                                                               // Создадим флаг, который будет меняться если пользователь будет найден
      users.map(function(user){                                                       // Переберём массив и для каждого объета массива сделаем следующее
        if(user.login == obj.user.login && user.password == obj.user.password){       // Если логин и пароль из главного объекта совпадают с логином и паролем из файла то
          obj.user = user;                                                            // В главный объект скопируем пользователя из файла
          obj.card=[];
          obj.card = user.card;
          flag = true;                                                                // Поменяем флаг на положительный
        }
      });
      if(flag){                                                                       // Если флаг положительный то 
        obj.init(true);                                                               // Вызовем функцию, которая наполнит все остольные данные и сменит окно на нужное (передадим положительный результат)
      }else{                                                                          // Если флаг остался отрицательным то 
        obj.init(false);                                                              // Вызовем ту же самую функцию, но передадим туда отрицательный результат
      }
    }
    else{                                                                             // Если в функцию вместо текста из файла пришёл отрицательный результат, то
      obj.getFile("json/users.json",function(string){                                 // Вызовем функцию которая даст нам текст из файла, передадим туда путь до файла и что делать после получения текста
        obj.authorization(string);                                                    // А будем мы делать вот что - вызовем эту же функцию но передадим сюда текст из файла
      });
    }
  },
  uploadPageTables:function(mainObj){
    var rights=[                                                                    // Делаем соответствия привелегий пользователя со страницей сайта
          "admin",                                                            
          "picker",
          "client"
        ],
        parent = document.querySelector("#"+rights[obj.user.rights]),
        tables = parent.querySelectorAll("table[data-obj="+mainObj+"]");
    for(table in tables){
      table=tables[table];
      if(typeof(table)=="object"){
        var ths = table.querySelectorAll("th");
        table=table.querySelector("tbody");
        for(key in obj[mainObj]){
          item=obj[mainObj][key];
          var tr=document.createElement("tr"),
              td=document.createElement("td");
          td.innerHTML=table.childElementCount;
          tr.appendChild(td);
          for(var th in ths){
            if(th!=0 && typeof(ths[th])=="object"){
              var td=document.createElement("td");
              tr.appendChild(td);
            }
          }
          for(param in item){
            for(var th in ths){
              var itemTh=ths[th];
              if(th!=0 && typeof(itemTh)=="object" && param==itemTh.getAttribute("data-info")){
                tr.querySelector("td:nth-child("+(+th+1)+")").innerHTML=item[param];
                tr.querySelector("td:nth-child("+(+th+1)+")").setAttribute("data-info",param);
              }
            }
          }
          tr.setAttribute("onclick","obj.updateForms(this);");
          table.appendChild(tr);
        }
      }
    }
  },
  getUsers:function(responseText){                                                     // Функция получения товаров из файла (принимает текст из файла)
    if(responseText!=true){                                                          // Если текст из файла пришёл, то
      if(responseText!=false){
        obj.users=JSON.parse(responseText);                                              // Превратим текст в объект и запишем его в главный объект. Теперь в главном объекте будут все товары со склада
      }
    }                                                                                 
    else{                                                                             // Если текст из файла не пришёл, то
      obj.getFile("json/users.json",function(string){                              // Вызовем функцию получения из файла, в которую передадим путь до файла с товарами и функцию,
        obj.getUsers(string);                                                          // Которая вызывает текущую функцию, передавая сюда текст из файла
        obj.uploadPageTables("users");
      });
    }
  },
  getData:function(responseText){                                                     // Функция получения товаров из файла (принимает текст из файла)
    if(responseText!=true){                                                          // Если текст из файла пришёл, то
      if(responseText!=false){
        obj.data=JSON.parse(responseText);                                              // Превратим текст в объект и запишем его в главный объект. Теперь в главном объекте будут все товары со склада
      }
    }                                                                                 
    else{                                                                             // Если текст из файла не пришёл, то
      obj.getFile("json/products.json",function(string){                              // Вызовем функцию получения из файла, в которую передадим путь до файла с товарами и функцию,
        obj.getData(string);                                                          // Которая вызывает текущую функцию, передавая сюда текст из файла
        obj.uploadPageTables("data");
      });
    }
  },
  getOverheads:function(responseText){                                                // Функция получения накладных из файла (принимает текст из файла)
    if(responseText!=true){                                                          // Если текст из файла пришёл то
      if(responseText!=false){
        obj.overheads=JSON.parse(responseText);                                         // Запишем накладные в главный объект  
      }
    }
    else{                                                                             // Если не пришёл текст то
      obj.getFile("json/overheads.json",function(string){                             // Вызовем функцию получения текста из файла, отправим путь до файла и функцию, которая
        obj.getOverheads(string);                                                     // Вызовет текующую функцию и передаст в неё текст из файла
        obj.uploadPageTables("overheads");
      });
    }
  },
  getRequests:function(responseText){                                                 // Функция которая запишет все запросы пользователей в объект (принимает текст из файла)
    if(responseText!=true){                                                          // Если есть текст из файла, то
      if(responseText!=false){
        obj.requests=JSON.parse(responseText);                                          // Преобразуем его в объект и запишем запросы в главный объект программы
      }
    }
    else{                                                                             // Если текст не пришёл то
      obj.getFile("json/requests.json",function(string){                              // Вызываем функцию которая получит текст из файла, отправляем путь и функцию, которая
        obj.getRequests(string);                                                      // Вызовет текущую функцию и передаст сюда текст из файла
        obj.uploadPageTables("requests");
      });
    }
  },
  setObj:function(mainObj,newObj,url){                                                // Функция записи нового товара в объект с товарами(принимает объект нового товара)
    obj[mainObj].push(newObj);                                                            // Дописываем в товары товар который пришёл в функцию
    obj.rewriteFile(obj[mainObj],url);                                                // Вызываем функцию которая перезапишет файл на сервере, передадим туда объет с товарами и путь до файла
  },
  rewriteObj:function(mainObj,oldObject,newObj,table,url){
    var tr=table.querySelectorAll("tr")[oldObject],
        tdAll=tr.querySelectorAll("td");

    obj[mainObj][oldObject]=newObj;
    obj.rewriteFile(obj[mainObj],url);
    for(td in tdAll){
      if(td!=0){
        td=tdAll[td];
        if(typeof(td)=="object"){
          if(td.innerHTML!=obj[mainObj][oldObject][td.getAttribute("data-info")]){
            td.innerHTML=obj[mainObj][oldObject][td.getAttribute("data-info")];
          }
        }
      } 
    }
  },
  viewObj:function(mainObj,table,newObj){                                             // Функция вывода продуктов в таблицу (принимает таблицу в которую будет вывод и объект вывода(если надо дописать в таблицу))
    if(newObj!="all"){                                                                // Если объект вывода является объектом, то
      var objs=[newObj];                                                              // Создадим массив продуктов с одним продуктом, который пришёл
    } 
    else{                                                                             // Если объект выводв является строкой all, то
      var objs=obj[mainObj];                                                          // Массив с продкутами равен объекту со всеми продуктами
      console.log(objs);
      table.innerHTML="";                                                             // Очищаем таблицу
    }
    objs.map(function(item){                                                          // Для каждого продукта из нового массива продуктов объявляем функцию, принимающую его
      var tr = document.createElement("tr"),                                          // Объявляем новый элемент страницы - строку
          td = document.createElement("td"),                                          // Объявляем новый элемент страницы - ячейку
          keys = Object.keys(item);                                                   // Создаём массив всех ключей свойств продукта

      td.innerHTML=table.childElementCount;                                           // В ячейку записываем количество элементов в таблице
      tr.appendChild(td);                                                             // В строку записываем ячейку (Будет номером строки)
      keys.map(function(key){                                                         // Прогоняем каждый ключ через функцию, которая его принимает
        var td=document.createElement("td");                                          // Объявляем новую ячейку
        td.innerHTML=item[key];                                                       // Пишем в неё значение свойства продукта по ключу
        td.setAttribute("data-info",key);                                             // Добавляем к ячейке атрибут в который записываем имя ключа (для дальнейшей ориентации)
        tr.appendChild(td);                                                           // Добавляем в строку ячейку
      });
      tr.setAttribute("onclick","obj.updateForms(this);");
      table.appendChild(tr);                                                          // Добавляем в таблицу строку
    });
  },
  dataRequest:function(elem,dataKey, tableClass){                                     // Функция отвечающая сбор данных с форм и выполняет соответствующие задачи. Принимает ключь таблицы в которую записать изменения, элемент из которого происходил вызов и таблицу для вывода результата
    var parent=elem.parentNode,                                                       // Объявляем сслыку на родительский элемент элемента, который вызвал функцию
        table=parent.parentNode.querySelector("."+tableClass),                        // Объявляем ссылку на таблицу 
        ths=table.querySelectorAll("th"),                                             // Объявляем ссылку на все элементы th в таблице
        tableBody=table.querySelector("tbody"),                                       // Объявляем ссылку на тело таблицы
        request=parent.getAttribute("data-request"),                                  // Объявляем переменную которая будет хранить тип запроса (запись, перезапись)
        dataObj=[                                                                     // Объявляем части запроса к функции, в которых храниться название объекта редактирования
          "data",                                                                     // Для товаров
          "users",                                                                    // Для пользователей
          "overheads",                                                                // Для накладных
          "requests",                                                                 // Для запросов
          "card"
        ],
        dataUrls=[
          "json/products.json",
          "json/users.json",
          "json/overheads.json",
          "json/requests.json"
        ],
        dataPref=[                                                                    // Объявляем префиксы для первой части запроса к функции
          "set",                                                                      // Добавить
          "rewrite",                                                                  // Переписать
          "view"                                                                      // Отобразить
        ],
        string="",                                                                    // Объявляем собирательную переменную
        data={};                                                                      // Объявляем объект в котором будет сформирован объект из информации форм

    for(var th in ths){                                                               // Для каждого элемента th делаем следующее
      th=ths[th];                                                                     // Переписываем переменную th, так чтобы она содержала объект заголовочной ячейки таблицы
      if(typeof(th)=="object" && th.getAttribute("data-info")){                       // Если тип th будет объектом и он имеет аттрибут data-info (содержит ключ свойства)
        data[th.getAttribute("data-info")]="";                                        // Тогда запишем в локальную дату свойство, именем которого ивляется значение атрибута (свойство объекта)
      }
    }
    for(var key in data){                                                           // Для каждого свойства из локального объекта выполнем следущее
      var input = parent.querySelectorAll("input[data-"+key+"]");                   // Сформируем запрос ко всем элементам форм, которые имеют атрибут data-"значение ключа свойства"
      if(input[0]){
        data[key]=input[0].value;                                                     // Запишем в свойство по ключу локального объета значение элемента формы
        input[0].value="";                                                            // Удалим из формы значение
      }
    } 
    if(request=="add"){ 
      request=dataPref[0]+"Obj";                                                      // Перепишем запрос на кастомный, который сложит префикс на добавление и объект редактирования
      obj[request](dataObj[dataKey],data,dataUrls[dataKey]);                          // Обратимся к функции главного объета для записи в хранилище нового объекта
      request=dataPref[2]+"Obj";                                                      // Перепишем запрос на кастомный, который сложит префикс на вывод информации и объект редактирования
      obj[request](dataObj[dataKey],tableBody,data);                                  // Обратимся к функции главного объекта для отображения информации в таблице (Отправим таблицу и локальный объект)
    }
    else{
      if(request=="rewrite"){
        request=dataPref[1]+"Obj";
        obj[request](dataObj[dataKey],elem.getAttribute("data-old"),data,tableBody,dataUrls[dataKey]);
      }
    }
  },
  updateForms:function(item){
    var tdAll=item.querySelectorAll("td"),
        table=item.parentNode.parentNode,
        form=table.parentNode.querySelectorAll(".request[data-for="+table.className+"]")[0],
        inputs=form.querySelectorAll(".input"),
        button=form.querySelector(".button");
        keys=[];

    for (var td in tdAll){
      td=tdAll[td];
      if(typeof(td)=="object"){
        keys.push(td.getAttribute("data-info"));
      }
    }
    for(key in keys){
      var keyValue=keys[key];
      for(input in inputs){
        input=inputs[input];
        if(typeof(input)=="object"){
          if(input.getAttribute("data-"+keyValue)){
            input.value=tdAll[key].innerHTML;
          }
        }
      }
    }
    form.setAttribute("data-request","rewrite");
    button.setAttribute("data-old",item.querySelector("td").innerHTML);
  },
  addToCard:function(item){
    var parent = item.parentNode,
        table = parent.parentNode.querySelector(".stock tbody"),
        card = parent.parentNode.querySelector(".card tbody"),
        inputs = parent.querySelectorAll(".input"),
        oldObj = item.getAttribute("data-old"),
        data = [];

    for (var input in inputs){
      input=inputs[input];
      if(typeof(input)=="object"){
        data.push(input.value);
      }
    }
    var tr=document.createElement("tr"),
        td=document.createElement("td");
    td.innerHTML=card.childElementCount;
    tr.appendChild(td);
    for(key in data){
      var td=document.createElement("td");
      td.innerHTML=data[key];
      tr.appendChild(td);
    }
    var newObj = JSON.parse(JSON.stringify(obj.data[oldObj]));
    obj.card.push(newObj);
    obj.card[obj.card.length-1].quantity=data[1];
    card.appendChild(tr);
  },
  creareNewRequest:function(){
    var data = JSON.parse(JSON.stringify(obj.card)),
        newObj={
          user:obj.user.name,
          body:[]
        };
    for(key in data){
      item=data[key];
      newObj.body.push(item.article);
      newObj.body.push(item.quantity);
    }
    obj.requests.push(newObj);
    obj.card=[];
    document.querySelector(".card tbody").innerHTML="";
  }
};
