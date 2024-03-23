/*
    Модуль-функция принимает на вход имя таблицы, и пользовательский класс, который должен представлять из себя модель.

    В функции формируются два классая: класс объекта и статический класс


    #Класс объекта
    
    Класс объекта является классом предназначенным для создание объектов модели, и имеющим методы,
    которые позволяют управлять операциями базы данных, и представляют из себя список действий: сохранение; удаление;
    Если объект имеет id, то функция должна изменить данные записи полученной по id, иначе функция сохранения должна делать новую запись.


    #Статически класс

    Статически класс является классом предназначенным для использования класса как статического, и имеющим методы,
    которые позволяют управлять операциями базы данных, и представляют из себя список действий: получение одной записи в виде экземпляра класса `Класс объекта`;
    получение нескольких записей, в количестве соотвестущей параметрам пагинации, в виде списка экземпляра класса `Класс объекта`.
    В случае отрабатывания конструктора возращает экземпляр класса `Класс объекта`.


    Возращает `Cтатический класс`
*/

const extendsModel = (apiDb, tableName, classModel) => {

    class ObjectClass extends classModel {
        id = null
        _model = {
        
        }
        
        constructor(model){
            super(model);
            this.id = model.id
            this._model = model
        }

        save(){
            if(this.id){
                apiDb.update('users', this.id, this._model)
            } else {
                apiDb.create('users', this._model)
            }
        }        
    }

    const ObjectClassProxy = new Proxy(ObjectClass, {
        construct(target, args){
            return new Proxy( new target(...args), {
                set(t, property, value){
                    if(!property == 'id')
                        t['_properties'][property] = value
                    t[property] = value
                    return true
                },
                get(t, property){
                    if(property.startsWith('_')){
                        throw new Error('В доступе отказано')
                    } else {
                        return t[property];
                    }
                }
            })
        },
    })


    class StaticClass extends classModel {
        constructor(model){
            super(model);
        }
        getOne(){

        }
    }

    return new Proxy(StaticClass, {
        construct(target, args){
            return new ObjectClassProxy(...args)
        },
        get(target, key){
            if(key === 'getOne'){
                return (id) => {
                    const model = {
                        age: 22,
                        name: 'Vadim'
                    }
                    return new ObjectClassProxy({
                        id: id,
                        ...model
                    })
                }
            }
        }
    })
}

const apiDb = {
    create(table, data){
        console.log(table, data)
    },
    update(table, id, data){
        console.log(table, id, data)
    }
}

export default (tableName, classModel) => {
    return extendsModel(apiDb, tableName, classModel)
} 