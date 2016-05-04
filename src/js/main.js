window.addEventListener("DOMContentLoaded",function(){                                // При загрузке элементов страницы вызвать функцию
  window.location.hash="login";                                                       // Переходим на страницу авторизации
});
var obj={                                                                             // Создаём главный объект программы (через него осуществляется вызов фукций)
  user:{                                                                              // Объявляем свойство - объект который будет хранить пользователя 

  },
  init:function(authorization){                                                       // Функция которая наполняет главный объект данными после успешной авторизации (принимает результат авторизации)
    if(authorization){                                                                // Если авторизация успешная то 
      obj.getData(false);                                                             // Вызываем функцию которая запишет товары из файла в главный объект
      var rights=[                                                                    // Делаем соответствия привелегий пользователя со страницей сайта
      "admin",                                                            
      "picker",
      "client"
      ];
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
  getData:function(responseText){                                                     // Функция получения товаров из файла (принимает текст из файла)
    if(responseText!=false){                                                          // Если текст из файла пришёл, то
      obj.data=JSON.parse(responseText);                                              // Превратим текст в объект и запишем его в главный объект. Теперь в главном объекте будут все товары со склада
    }                                                                                 
    else{                                                                             // Если текст из файла не пришёл, то
      obj.getFile("json/products.json",function(string){                              // Вызовем функцию получения из файла, в которую передадим путь до файла с товарами и функцию,
        obj.getData(string);                                                          // Которая вызывает текущую функцию, передавая сюда текст из файла
      });
    }
  },
  setData:function(product){                                                          // Функция записи нового товара в объект с товарами(принимает объект нового товара)
    obj.data.push(product);                                                           // Дописываем в товары товар который пришёл в функцию
    obj.rewriteFile(obj.data,"json/products.json");                                   // Вызываем функцию которая перезапишет файл на сервере, передадим туда объет с товарами и путь до файла
  },
  viewData:function(table,objProduct){
    if(objProduct!="all"){
      products=[objProduct];
    }
    else{
      products=obj.data;
      table.innerHTML="";
    }
    products.map(function(product){
      var tr = document.createElement("tr"),
          td = document.createElement("td");
      td.innerHTML=table.childElementCount - 1;
      tr.appendChild(td);
      keys = Object.keys(product);  
      keys.map(function(key){
        var td=document.createElement("td");
        td.innerHTML=product[key];
        td.setAttribute("data-info",key);
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
  },
  getOverheads:function(responseText){                                                // Функция получения накладных из файла (принимает текст из файла)
    if(responseText!=false){                                                          // Если текст из файла пришёл то
      obj.overheads=JSON.parse(responseText);                                         // Запишем накладные в главный объект
    }
    else{                                                                             // Если не пришёл текст то
      obj.getFile("json/overheads.json",function(string){                             // Вызовем функцию получения текста из файла, отправим путь до файла и функцию, которая
        obj.getOverheads(string);                                                     // Вызовет текующую функцию и передаст в неё текст из файла
      });
    }
  },
  getRequests:function(responseText){                                                 // Функция которая запишет все запросы пользователей в объект (принимает текст из файла)
    if(responseText!=false){                                                          // Если есть текст из файла, то
      obj.requests=JSON.parse(responseText);                                          // Преобразуем его в объект и запишем запросы в главный объект программы
    }
    else{                                                                             // Если текст не пришёл то
      obj.getFile("json/requests.json",function(string){                              // Вызываем функцию которая получит текст из файла, отправляем путь и функцию, которая
        obj.getRequests(string);                                                      // Вызовет текущую функцию и передаст сюда текст из файла
      });
    }
  },
  dataRequest:function(elem,dataKey, tableClass){                                     // Функция отвечающая сбор данных с форм и выполняет соответствующие задачи. Принимает ключь таблицы в которую записать изменения, элемент из которого происходил вызов и таблицу для вывода результата
    var parent=elem.parentNode,
        table=parent.parentNode.querySelector("."+tableClass),
        ths=table.querySelectorAll("th"),
        tableBody=table.querySelector("tbody"),
        request=parent.getAttribute("data-request"),
        dataObj=[
          "Data",
          "Users",
          "Overheads",
          "Request"
        ],
        dataPref=[
          "set",
          "rewrite",
          "view"
        ],
        string="",
        data={};

    for(th in ths){
      th=ths[th];
      if(typeof(th)=="object" && th.getAttribute("data-info")){
        data[th.getAttribute("data-info")]="";
      }
    }
    if(request=="add"){
      for(key in data){
        var input = parent.querySelectorAll("input[data-"+key+"]");
        data[key]=input[0].value;
        input[0].removeAttribute("data-"+key);
        input[0].value="";
      }
      request=dataPref[0]+dataObj[dataKey];
      obj[request](data);
      request=dataPref[2]+dataObj[dataKey];
      obj[request](table,data);
    }
    else{
      if(request=="rewrite"){

      }
    }
  }
};