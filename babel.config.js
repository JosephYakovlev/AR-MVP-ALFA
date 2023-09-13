//Actions.js
import { parseISO, addDays, addWeeks, addMonths, addYears, addHours, startOfISOWeek, endOfISOWeek, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, startOfYear, endOfYear  } from 'date-fns';
import Realm from 'realm';
import {User, Task} from './UserModel';
import {BufferTask, TaskBuffer} from './BufferTaskModel';
import Fuse from 'fuse.js'

import { newTimeFutureParser, newTimeFuturePastParser, newTimeFuturePastUpdateParser } from './TimeParsers';
import { newDateFutureParser, newDateFuturePastParser, newDateFuturePastUpdateParser } from './DateParsers';
import { iData, iIncomeComandInterface, iTask, iIncomeCreateTasksCommand, iIncomeUpdateTasksCommand } from './Interfaces';

const realmConfig = {
  schema: [BufferTask, TaskBuffer, User, Task],
};
const realm = new Realm(realmConfig);

export function createUserTask(newTask: iIncomeCreateTasksCommand) {

    console.log(213123)
    console.log(newTask);
    const todayDate = new Date()
    todayDate.setHours(todayDate.getHours() + 3)

    const {ACT,DATE,TIME,TASK,PER,LEMMACT,LEMMDATE,LEMMTIME,LEMMTASK,LEMMPER,PREFX,LEMMPREFX, PRIORITY} = newTask

    let inputTime = LEMMTIME ? LEMMTIME[0] : 'no'
    let lemmInputDays = LEMMDATE ? LEMMDATE[0] : 'no'
    const hasHour = ['час', 'часы'].some(word => inputTime.includes(word));
    const hasMinute = ['минута', 'минуты'].some(word => inputTime.includes(word));
    const hasDay = ['день', 'дни'].some(word => lemmInputDays.includes(word));
    const hasWeek = ['неделя', 'недели'].some(word => lemmInputDays.includes(word));
    const hasMonth = ['месяц', 'месяцы'].some(word => lemmInputDays.includes(word));
    const hasYear = ['год', 'лет'].some(word => lemmInputDays.includes(word));



    const newDateFuture = newDateFutureParser(DATE ? DATE[0] : todayDate.toISOString(), LEMMPREFX ? LEMMPREFX[0] : 'нет префикса', hasDay, hasWeek, hasMonth, hasYear)
    console.log('DATE');
    console.log(newDateFuture);
    
    const newTimeFuture = newTimeFutureParser(TIME ? TIME[0] : null, newDateFuture, LEMMDATE ? LEMMDATE[0] : lemmInputDays, LEMMPREFX ? LEMMPREFX[0] : 'нет префикса', hasHour, hasMinute)

    console.log('TIME');
    console.log(newTimeFuture);
    console.log('TIME2');
    console.log(typeof newTimeFuture);
    
    console.log(newDateFuture);
    


    realm.write(() => {
        // Создаем новую задачу в базе данных
        const users: any = realm.objects('User').sorted('id', true);
        console.log('users in createUserTask ( 186 str)');
        console.log(users)

        // console.log(users);
        const newId = users.length > 0 ? users[0].id + 1 : 1;
        const fakeTasks = [
            { id: 1, description: 'Task 1' },
            { id: 2, description: 'Task 2' },
        ]

        console.log(newTask)
        const formedTask = {
            id: newId,
            name: TASK ? newTask.TASK[0]  : 'не указано',
            person: newTask.PER ? newTask.PER[0] : 'мне',
            date: DATE ? newTimeFuture : 'не указано',
            time: TIME || DATE ?  newTimeFuture : 'не указано',
            creator: 'мне',
            lemmaName: TASK ? newTask.LEMMTASK[0] : 'не указано',
            lemmaPerson: newTask.PER ? newTask.PER[0] : 'мне',
            lemmaDate: DATE ?  newTimeFuture : 'не указано',
            lemmaTime: TIME || DATE ?  newTimeFuture : 'не указано',
            lemmaCreator: 'мне',
            priority: PRIORITY ? PRIORITY : 'не срочно',
            tasks: fakeTasks,
            trashCan: false
        }

        const a = realm.create('User', formedTask);
        console.log(a);
        console.log('Добавлена');
        return 'задание добавлено'
    });
}


export function getTasks(newTask: iIncomeComandInterface): Array<iData> {

    destroyAllBufferTasks()
    console.log("ИЩЕМ ЗАДАНИЕ B ACTIONS")
    console.log(newTask)
  
    const {DATE,TIME,TASK,PER,LEMMDATE,LEMMTIME,LEMMTASK,LEMMPER, CREATE,PREFX,LEMMPREFX, LEMMACT, PRIORITY, NUMTASK} = newTask
    console.log(234234);

    if (NUMTASK) {
        const NumTasksFromDB: Array<iData> = Array.from(realm.objects('User').filtered('id = $0', NUMTASK));
        return NumTasksFromDB
    }
    
    let inputTime = LEMMTIME ? LEMMTIME[0] : 'no'
    let inputHours = LEMMDATE ? LEMMDATE[0] : 'no'


    const hasHour = ['час', 'часы'].some(word => inputTime.includes(word));
    const hasMinute = ['минута', 'минуты'].some(word => inputTime.includes(word));
    const hasDay = ['день', 'дни'].some(word => inputHours.includes(word));
    const hasWeek = ['неделя', 'недели'].some(word => inputHours.includes(word));
    const hasMonth = ['месяц', 'месяцы'].some(word => inputHours.includes(word));
    const hasYear = ['год', 'лет'].some(word => inputHours.includes(word));



    let data: iData[] = []
    let lemmaData: iData[] = []

    let filteredData: iData[] = []
    let filteredLemmaData: iData[] = []

    const tasksFromDB: Array<iData> = Array.from(realm.objects('User').filtered('status != "выполнено" AND trashCan = false'));

    tasksFromDB.forEach((i: iData) => {
        data.push(i);
        lemmaData.push(i);
    });

    console.log('DATA AT START');
    console.log(data);
    
    
    
    if(PER) {
        if(CREATE) {

            console.log("filtering PER")
            const queryPer = PER[0];
            console.log(`queryPer = ${queryPer}`)
            const lemmQueryPer = LEMMPER ? LEMMPER[0] : PER[0]
            console.log(`lemmQueryPer = ${lemmQueryPer}`)

            const persons = tasksFromDB.map(item => item.creator);
            console.log('persons');
            console.log(persons);
            const lemmaPerson = tasksFromDB.map(item => item.lemmaCreator);
            console.log('lemmaPersons');
            console.log(lemmaPerson);
            const options = {
                includeScore: true,  // Включить оценку схожести
                threshold: 0.3,      // Порог схожести (меньше - более строгий)
            };
            const fusePer = new Fuse(persons, options)
            console.log('fuse persons');
            console.log(fusePer);
            const fuseLemmaPer = new Fuse(lemmaPerson, options)
            console.log('fuse lemm persons');
            console.log(fuseLemmaPer);

            const searchResults = fusePer.search(queryPer);
            console.log('searchRes');
            console.log(searchResults);
            const searchLemmaResults = fuseLemmaPer.search(lemmQueryPer);
            console.log('search LemRes');
            console.log(searchLemmaResults);

            const searchResultsItems = searchResults.map(i => i.item)
            console.log('searchResultsItems');
            console.log(searchResultsItems);
            const searchLemmaResultsItems = searchLemmaResults.map(i=> i.item)
            console.log('searchLemmaResultsItems');
            console.log(searchLemmaResultsItems);


            const uniqueResultsSet = [...new Set(searchResultsItems)];
            console.log('uniq res');
            console.log(uniqueResultsSet);
            const uniqueLemmaResultsSet = [...new Set(searchLemmaResultsItems)];
            console.log('uniq lemma res');
            console.log(uniqueLemmaResultsSet);

            let newDataForPer: Array<iData> = []
            let newLemmaDataForPer: Array<iData> = []
        
            uniqueResultsSet.forEach(result => {
                
                const dataFromDB = data.filter((i: iData) => 
                    i.creator.includes(result)
                )
                dataFromDB.forEach((i: iData) => 
                    newDataForPer.push(i)
                )
            })

            uniqueLemmaResultsSet.forEach(result => {
                
                const lemmaDataFromDB = lemmaData.filter((i: iData) => 
                    i.lemmaCreator.includes(result)
                )
                lemmaDataFromDB.forEach((i: iData) => 
                    newLemmaDataForPer.push(i)
                )
            })
        
            filteredData = newDataForPer
            filteredLemmaData = newLemmaDataForPer


            console.log('END PER FILTER');
            console.log(filteredData.length);
            console.log('END LEMMAPER FILER');
            console.log(filteredLemmaData.length);

        } else { 
            console.log("filtering PER")
            const queryPer = PER[0];
            console.log(`queryPer = ${queryPer}`)
            const lemmQueryPer = LEMMPER ? LEMMPER[0] : PER[0]
            console.log(`lemmQueryPer = ${lemmQueryPer}`)

            const persons = tasksFromDB.map(item => item.person);
            console.log('persons');
            console.log(persons);
            const lemmaPerson = tasksFromDB.map(item => item.lemmaPerson);
            console.log('lemmaPersons');
            console.log(lemmaPerson);
            const options = {
                includeScore: true,  // Включить оценку схожести
                threshold: 0.3,      // Порог схожести (меньше - более строгий)
            };
            const fusePer = new Fuse(persons, options)
            console.log('fuse persons');
            console.log(fusePer);
            const fuseLemmaPer = new Fuse(lemmaPerson, options)
            console.log('fuse lemm persons');
            console.log(fuseLemmaPer);

            const searchResults = fusePer.search(queryPer);
            console.log('searchRes');
            console.log(searchResults);
            const searchLemmaResults = fuseLemmaPer.search(lemmQueryPer);
            console.log('search LemRes');
            console.log(searchLemmaResults);

            const searchResultsItems = searchResults.map(i => i.item)
            console.log('searchResultsItems');
            console.log(searchResultsItems);
            const searchLemmaResultsItems = searchLemmaResults.map(i=> i.item)
            console.log('searchLemmaResultsItems');
            console.log(searchLemmaResultsItems);


            const uniqueResultsSet = [...new Set(searchResultsItems)];
            console.log('uniq res');
            console.log(uniqueResultsSet);
            const uniqueLemmaResultsSet = [...new Set(searchLemmaResultsItems)];
            console.log('uniq lemma res');
            console.log(uniqueLemmaResultsSet);

            let newDataForPer: Array<iData> = []
            let newLemmaDataForPer: Array<iData> = []
        
            uniqueResultsSet.forEach(result => {
                
                const dataFromDB = data.filter((i: iData) => 
                    i.person.includes(result)
                )
                dataFromDB.forEach((i: iData) => 
                    newDataForPer.push(i)
                )
            })

            uniqueLemmaResultsSet.forEach(result => {
                
                const lemmaDataFromDB = lemmaData.filter((i: iData) => 
                    i.lemmaPerson.includes(result)
                )
                lemmaDataFromDB.forEach((i: iData) => 
                    newLemmaDataForPer.push(i)
                )
            })
        
            filteredData = newDataForPer
            filteredLemmaData = newLemmaDataForPer


            console.log('END PER FILTER');
            console.log(filteredData.length);
            console.log('END LEMMAPER FILER');
            console.log(filteredLemmaData.length);
        }
    } else {
        filteredData = data
        filteredLemmaData = lemmaData
        console.log('END NO PER FILTER');
        console.log(data.length);
        console.log('END NO LEMMAPER FILER');
        console.log(data.length);
    }


    if(TASK) {
        console.log("filtering TASK")
        const queryTASK = TASK[0];
        console.log(`queryTASK = ${queryTASK}`)
        const lemmQueryTASK = LEMMTASK ? LEMMTASK[0] : TASK[0]
        console.log(`lemmQueryTASK = ${lemmQueryTASK}`)

        const tasks = filteredData.map(item => item.name);
        const lemmaTasks = filteredLemmaData.map(item => item.lemmaName);

        const options = {
            includeScore: true,  // Включить оценку схожести
            threshold: 0.5,      // Порог схожести (меньше - более строгий)
        };
        const fusePer = new Fuse(tasks, options)
        const fuseLemmaPer = new Fuse(lemmaTasks, options)

        const searchResults = fusePer.search(queryTASK);
        const searchLemmaResults = fuseLemmaPer.search(lemmQueryTASK);

        const searchResultsItems = searchResults.map(i => i.item)
        console.log('searchResultsItems');
        console.log(searchResultsItems);
        const searchLemmaResultsItems = searchLemmaResults.map(i=> i.item)
        console.log('searchLemmaResultsItems');
        console.log(searchLemmaResultsItems);


        const uniqueResultsSet = [...new Set(searchResultsItems)];
        console.log('uniq res');
        console.log(uniqueResultsSet);
        const uniqueLemmaResultsSet = [...new Set(searchLemmaResultsItems)];
        console.log('uniq lemma res');
        console.log(uniqueLemmaResultsSet);


        let newDataForPer: Array<iData> = []
        let newLemmaDataForPer: Array<iData> = []

        uniqueResultsSet.forEach(result => {
            
            const dataFromDB = filteredData.filter((i: iData) => 
                i.name.includes(result)
            )
            dataFromDB.forEach((i: iData) => 
                newDataForPer.push(i)
            )
        })

        uniqueLemmaResultsSet.forEach(result => {
            
            const lemmaDataFromDB = filteredLemmaData.filter((i: iData) => 
                i.lemmaName.includes(result)
            )
            lemmaDataFromDB.forEach((i: iData) => 
                newLemmaDataForPer.push(i)
            )
        })

        filteredData = newDataForPer
        filteredLemmaData = newLemmaDataForPer

        console.log('END TASK FILTER');
        console.log(filteredData);
        console.log('END LEMMATASK FILER');
        console.log(filteredLemmaData);
    } else {
        console.log('END NO TASK FILTER');
    }

    if(TIME) {
        const today = new Date()
        const newTimeFuture = newTimeFuturePastParser(LEMMTIME ? TIME[0] : null, DATE ? DATE[0] : today.toISOString(), LEMMDATE ? LEMMDATE[0] : 'no', LEMMPREFX ? LEMMPREFX[0] : 'нет префикса', hasHour, hasMinute) // LEMMDATE ? LEMMDATE[0] : 'no', LEMMPREFX ? DATE ? 'нет префикса' : LEMMPREFX[0] : 'нет префикса'

        if(CREATE) {
            if(LEMMACT?.[0].toLowerCase() === 'кто') {
                console.log("filtering TIME CREATE FOR 'KTO' ")
                const hours = newTimeFuture.substring(11, 13)
                console.log(hours);

                const newTimes: Array<iData> = filteredData.filter(i => i.time.substring(11,13).includes(hours));
                const newTimesLemma: Array<iData> = filteredLemmaData.filter(i => i.time.substring(11,13).includes(hours));


                filteredData = newTimes
                filteredLemmaData = newTimesLemma

                console.log('END TIME FILTER');
                console.log(filteredData);
                console.log('END LEMMATIME FILER');
                console.log(filteredLemmaData);
            } else {
                console.log("filtering TIME CREATE NOT FOR 'KTO' ")
                const hours = newTimeFuture.substring(11, 13)
                console.log(hours);
    
                const newTimes: Array<iData> = filteredData.filter(i => i.createdAt.substring(11,13).includes(hours));
                const newTimesLemma: Array<iData> = filteredLemmaData.filter(i => i.createdAt.substring(11,13).includes(hours));
    
    
                filteredData = newTimes
                filteredLemmaData = newTimesLemma
    
                console.log('END TIME FILTER');
                console.log(filteredData);
                console.log('END LEMMATIME FILER');
                console.log(filteredLemmaData);
            }
        } else {    
            console.log("filtering TIME NOT CREATE")
            const hours = newTimeFuture.substring(11, 13)
            console.log(hours);
            

            const newTimes: Array<iData> = filteredData.filter(i => i.time.substring(11,13).includes(hours));
            const newTimesLemma: Array<iData> = filteredLemmaData.filter(i => i.time.substring(11,13).includes(hours));

            filteredData = newTimes
            filteredLemmaData = newTimesLemma

            console.log('END TIME FILTER');
            console.log(filteredData);
            console.log('END LEMMATIME FILER');
            console.log(filteredLemmaData);
        }
    } else {
        console.log('END NO TIME FILTER');
    }


    if(LEMMDATE) {
            const initialDate = DATE ? DATE : LEMMDATE
            console.log('FILTERING WITH LEMMDATE1');
            const newDateFuture = newDateFuturePastParser(initialDate[0], LEMMPREFX ? LEMMPREFX[0] : 'нет префикса', hasDay, hasWeek, hasMonth, hasYear)
           
            console.log('FILTERING WITH LEMMDATE');
            
            const dateOut = newDateFuture.substring(0, 10)
            console.log(dateOut);

            const LEMMAPREFIX = LEMMPREFX ? LEMMPREFX[0] : 'no'
            console.log('234234234234234234234gf4566666666');
            console.log(LEMMDATE);
            console.log(typeof LEMMDATE);
            
            
            if (LEMMDATE[0].includes('неделя')) {
                const initialDate = parseISO(newDateFuture);
                const today = new Date();
                const startWeekDate = ['следующ', 'ближайшие'].some(substring => LEMMAPREFIX.includes(substring))
                    ? 
                        parseInt(LEMMDATE[0].substring(0,2)) > 0
                            ?
                                today
                            : 
                                new Date(endOfISOWeek(today).getTime()+ 24 * 60 * 60 * 1000)
                    : 
                        startOfISOWeek(initialDate);
                const endWeekDate = new Date(endOfISOWeek(initialDate).getTime()+ 24 * 60 * 60 * 1000);
                startWeekDate.setDate(startWeekDate.getDate() + 1)
                const daysInRange = eachDayOfInterval({
                    start: startWeekDate,
                    end: endWeekDate,
                });
            
                const IsoDaysInRange: Array<string> = daysInRange.map(i => i.toISOString());
                console.log('15177_______________________________________________________7777777');
                console.log(filteredData);
                

                const newTimes: Array<iData> = filteredData.filter((i: iData) =>  
                    IsoDaysInRange.some((d: string) => (CREATE && LEMMACT?.[0].toLowerCase() !== 'кто') ? i.createdAt.includes(d.substring(0, 10)) : i.date.includes(d.substring(0, 10)))
                );
                const newTimesLemma: Array<iData> = filteredLemmaData.filter((i: iData) =>  
                    IsoDaysInRange.some((d: string) => (CREATE && LEMMACT?.[0].toLowerCase() !== 'кто') ? i.createdAt.includes(d.substring(0, 10)) : i.date.includes(d.substring(0, 10)))
                );
                filteredData = newTimes
                filteredLemmaData = newTimesLemma

                console.log('nEWTIMES NEDELYA');
                console.log(IsoDaysInRange);
                console.log(newTimes);
            } else if (LEMMDATE[0].includes('месяц')) {
                const initialDate = parseISO(newDateFuture);
                console.log('SLUDUUWII MESYAC');
                console.log(initialDate);
                console.log(typeof initialDate);
                console.log(parseInt(LEMMDATE[0].substring(0,2)));
                console.log(parseInt(LEMMDATE[0].substring(0,2)) > 0);
                
                
                
                const today = new Date();
                today.setHours(today.getHours() + 3)

                // const startDateMonth = initialDate.toISOString().substring(5,7) === today.toISOString().substring(5,7) 
                //     ? 
                //         endOfMonth(today)
                //     :
                //         today


                const startMonthDate = ['следующ', 'ближайш'].some(substring => LEMMAPREFIX.includes(substring))
                    ? 
                        parseInt(LEMMDATE[0].substring(0,2)) > 0
                            ?
                                today
                            : 
                                endOfMonth(today)
                    : 
                        startOfMonth(initialDate);

                const endMonthDate = endOfMonth(initialDate);
                startMonthDate.setDate(startMonthDate.getDate() + 2)
                console.log(startMonthDate);
                console.log('startofmonth1211');
                console.log(startMonthDate);
                console.log(endMonthDate);
                
                
                                
                const daysInRange = eachDayOfInterval({
                    start: startMonthDate,
                    end: endMonthDate,
                });
                console.log(daysInRange);
                
                const IsoDaysInRange: Array<string> = daysInRange.map(i => i.toISOString());
                const newTimes: Array<iData> = filteredData.filter((i: iData) =>
                    (CREATE && LEMMACT?.[0].toLowerCase() !== 'кто') ?
                        IsoDaysInRange.some((d: string) => i.createdAt.substring(5, 7).includes(d.substring(5, 7)))
                            : 
                        IsoDaysInRange.some((d: string) => i.time.substring(5, 7).includes(d.substring(5, 7)))
                );
                const newTimesLemma: Array<iData> = filteredLemmaData.filter((i: iData) =>  
                    IsoDaysInRange.some((d: string) => CREATE ? i.createdAt.substring(5, 7).includes(d.substring(5, 7)) : i.time.substring(5, 7).includes(d.substring(5, 7)))
                );
                filteredData = newTimes
                filteredLemmaData = newTimesLemma
            
                console.log('newTimes Месяц');
                console.log(newTimes);
            } else if (LEMMDATE[0].includes('год')) {
                const initialDate = parseISO(newDateFuture);
                const today = new Date();
                const startYearDate = ['следующ', 'ближайшие'].some(substring => LEMMAPREFIX.includes(substring))
                    ? 
                        parseInt(LEMMDATE[0].substring(0,2)) > 0
                            ?
                                today
                            : 
                                endOfYear(today)
                    : 
                        endOfYear(initialDate);
                const endYearDate = endOfYear(initialDate);
                // const daysInRange = eachDayOfInterval({
                //     start: startYearDate,
                //     end: endYearDate,
                // });
            
                // const IsoDaysInRange: Array<string> = daysInRange.map(i => i.toISOString());
            
                const newTimes: Array<iData> = filteredData.filter((i: iData) =>  
                    (CREATE && LEMMACT?.[0].toLowerCase() !== 'кто') ? i.createdAt.substring(0, 4).includes(endYearDate.toISOString().substring(0, 4)) : i.time.substring(0, 4).includes(endYearDate.toISOString().substring(0, 4)) 
                );

                const newTimesLemma: Array<iData> = filteredLemmaData.filter((i: iData) =>  
                    (CREATE && LEMMACT?.[0].toLowerCase() !== 'кто') ? i.createdAt.substring(0, 4).includes(endYearDate.toISOString().substring(0, 4)) : i.time.substring(0, 4).includes(endYearDate.toISOString().substring(0, 4)) 
                );
                filteredData = newTimes
                filteredLemmaData = newTimesLemma

                console.log('NewTimes Год');
                console.log(newTimes);
            } else {
                console.log('NewTimes на дату');

                
                const newTimes: Array<iData> = filteredData.filter(i => (CREATE && LEMMACT?.[0].toLowerCase() !== 'кто') ? i.createdAt.includes(dateOut) : i.time.includes(dateOut));
                const newTimesLemma: Array<iData> = filteredLemmaData.filter(i => {
                    if ((CREATE && LEMMACT?.[0].toLowerCase() !== 'кто')) {
                      console.log(`Checking createdAt for ${i.createdAt}`);
                      return i.createdAt.includes(dateOut);
                    } else {
                      console.log(`Checking time for ${i.time}`);
                      console.log(dateOut);
                      
                      return i.time.includes(dateOut);
                    }
                  });
                filteredData = newTimes
                filteredLemmaData = newTimesLemma
            }

            console.log('END DATE FILTER');
            console.log(filteredData);
            console.log('END LEMMADATE FILER');
            console.log(filteredLemmaData);

    }  else {
            // console.log("filtering !DATE")
            // console.log('NewTimes нет дату');
            // const InitialDate = new Date()
                
            // const newTimes: Array<iData> = data.filter(i => CREATE ? i.createdAt.includes(InitialDate.toISOString().substring(0, 10)) : i.time.includes(InitialDate.toISOString().substring(0, 10)));
            // const newTimesLemma: Array<iData> = lemmaData.filter(i => CREATE ? i.createdAt.includes(InitialDate.toISOString().substring(0, 10)) : i.time.includes(InitialDate.toISOString().substring(0, 10)));

            // data = newTimes
            // lemmaData = newTimesLemma
            console.log('END NO DATE FILTER');
            console.log(filteredData);
            console.log('END  NO LEMMADATE FILER');
            console.log(filteredLemmaData);
    }

    if(filteredData > filteredLemmaData) {
            console.log('DATA BOLWE');
            console.log(filteredData.length);
            console.log(filteredLemmaData.length);
            return filteredData
    } else {
            console.log('LEMMADATA BOLWE');
            console.log(filteredLemmaData.length);
            console.log(filteredData.length);
            return filteredLemmaData
    }

}



export function deleteUserTask(newTask: iIncomeComandInterface) {

    console.log('UDALENIE V ACTIONS');

    const tasksToDelete = getTasks(newTask)

    console.log(tasksToDelete);
    if (tasksToDelete.length > 0) {
        realm.write(() => {
            tasksToDelete.forEach(task => {
                task.trashCan = true 
                // замените на новое значение
                // ... другие изменения
            });;
        });
        console.log('Удалено');
        return 'задание в корзине'
    } else {
        console.log('Задача не найдена. Не удалось удалить задачу. в ACTIONS');
        return 'Задача не найдена.'
    }
}



export function updateTask(newTask: iIncomeUpdateTasksCommand) {

    console.log("ACTIONS UPDATING");
 
    const {ACT,DATE,TIME,TASK,PER,LEMMACT,LEMMDATE,LEMMTIME,LEMMTASK,LEMMPER,PREFX,LEMMPREFX, NUMTASK} = newTask

    let inputTime = LEMMTIME ? LEMMTIME[0] : 'no'
    let inputHours = LEMMDATE ? LEMMDATE[0] : 'no'


    const hasHour = ['час', 'часы'].some(word => inputTime.includes(word));
    const hasMinute = ['минута', 'минуты'].some(word => inputTime.includes(word));
    const hasDay = ['день', 'дни'].some(word => inputHours.includes(word));
    const hasWeek = ['неделя', 'недели'].some(word => inputHours.includes(word));
    const hasMonth = ['месяц', 'месяцы'].some(word => inputHours.includes(word));
    const hasYear = ['год', 'лет'].some(word => inputHours.includes(word));

    let data: iData[] = []

    const DateLength = DATE ? DATE : []
    const LemmPrefxLength = LEMMPREFX ? LEMMPREFX : []

    
    const NEWMATCH = (DateLength.length > 0 && LemmPrefxLength.length < 2 && !hasDay && !hasWeek && !hasMonth) ? ['нет префикса'] : LemmPrefxLength.length > 0 ? LEMMPREFX : ['нет префикса']

    console.log("NEWMATCH");
    console.log(NEWMATCH);
    
    const PREFFORSEARCH = (DATE?.length > 1 && TIME?.length > 1) ? 'нет префикса' : PREFX ? PREFX[0] : ['нет префикса']
    const PREFLEMMFORSEARCH = (DATE?.length > 1 && TIME?.length > 1) ? 'нет префикса' : LEMMPREFX ? LEMMPREFX[0] : 'нет префикса'

    const tasksFromDB: Array<iData> = NUMTASK ? Array.from(realm.objects('User').filtered('id = $0', NUMTASK)) : getTasks({...newTask, PREFX: NEWMATCH , LEMMPREFX: NEWMATCH  })

    tasksFromDB.forEach((i: iData) => {
        data.push(i);
    });

    if (data.length < 1) {
        return 'база данных пуста'
    }

    console.log(123121231231231231);
    console.log(tasksFromDB);
    const timeExistance = TIME ? TIME : []
    console.log(timeExistance);
    const dateExistance = DATE ? DATE : []
    const lemmDateExistance = LEMMDATE ? LEMMDATE : []
    console.log(data);
    
    
    // if (DATE?.length == 1 && TIME?.length == 1 && TASK?.length == 1 && PER?.length == 1) {
    //     return `${data.length} ${data.length === 1 ? 'задача оставлена без изменений' : (data.length >= 2 && data.length <= 4) ? 'задачи оставлены без изменений' : 'задач оставлено  без измененийввв'}`;
    // }
    realm.write(() => {
        // Изменяем свойства объектов, как вам необходимо
        data.forEach(task => {
                task.date = dateExistance.length > 1 ? newDateFuturePastUpdateParser(dateExistance[1],task.date, NEWMATCH.length < 2 ? NEWMATCH[0] : NEWMATCH[1], hasDay, hasWeek, hasMonth, hasYear) : task.date; // замените на новое значение
                task.time = (dateExistance.length > 1 || timeExistance.length > 1) ? newTimeFuturePastUpdateParser(timeExistance.length > 1 ? timeExistance[1] : task.lemmaTime , dateExistance.length > 1 ? dateExistance[1] : task.date, lemmDateExistance.length > 1 ? lemmDateExistance[1] : task.lemmaTime , DATE?.length > 1 ? 'нет префикса' : LEMMPREFX ? LEMMPREFX[LEMMPREFX?.length-1] : 'нет префикса ', hasHour, hasMinute) : task.time;
                task.name = LEMMTASK?.length > 1 ? LEMMTASK[1] : task.name;
                task.person = LEMMPER?.length > 1 ? LEMMPER[1] : task.person;
                task.lemmaDate = dateExistance.length > 1 ? newDateFuturePastUpdateParser(dateExistance[1],task.lemmaDate,NEWMATCH.length < 2 ? NEWMATCH[0] : NEWMATCH[1], hasDay, hasWeek, hasMonth, hasYear) : task.date; // замените на новое значение
                task.lemmaTime = (dateExistance.length > 1 || timeExistance.length > 1) ? newTimeFuturePastUpdateParser(timeExistance.length > 1 ? timeExistance[1] : task.lemmaTime , dateExistance.length > 1 ? dateExistance[1] : task.lemmaDate,  lemmDateExistance.length > 1 ? lemmDateExistance[1] : task.lemmaTime , DATE?.length > 1 ? 'нет префикса' : LEMMPREFX ? LEMMPREFX[LEMMPREFX?.length-1] : 'нет префикса ', hasHour, hasMinute) : task.time;
                task.lemmaName = LEMMTASK?.length > 1 ? LEMMTASK[1] : task.name;
                task.lemmaPerson = LEMMPER?.length > 1 ? LEMMPER[1] : task.person;
                // замените на новое значение
                // ... другие изменения
        });
    });

    console.log(1234345);
    console.log(data);
    
    

    if (data.length < 1) {
        return 'задач не найдено'
    }
    return `${data.length} задач${data.length === 1 ? 'а' : data.length > 1 && data.length < 5 ? 'и' : ''} обновлен${data.length === 1 ? 'а' : 'о'}`;;
}


export function deleteAllUsers() {
  realm.write(() => {
    const allUsers = realm.objects('User');
    realm.delete(allUsers)
  });
}

export function clearTrashCan() {
    realm.write(() => {
        const trashCanTasks = realm.objects('User').filtered('trashCan = $0 ', true);
        realm.delete(trashCanTasks)
    });
}

export function getTrashCan() {
    realm.write(() => {
      const trashCanTasks = realm.objects('User').filtered('trashCan = $0 ', true);
      if(trashCanTasks.length > 0) {
        realm.delete(trashCanTasks)
        return 'корзина очищена'
      } else {
        return 'в корзине нет задач'
      }
    });
}




export function createBufferTask(newTask: iData): void {
    realm.write(() => {
        // Создаем новую задачу в базе данных
        console.log('BufferTasks in actionsCreateBufferTask ( 639 str)');
        console.log(newTask)
        const a = realm.create('BufferTask', newTask);
        console.log(a);
        console.log('буферная задача создана');
    });
}



export function destroyAllBufferTasks(): void {
    realm.write(() => {
        const allBufferTasks = realm.objects('BufferTask');
        realm.delete(allBufferTasks)
      });
}

export function getAllBufferTasks(): iData[] {

    const BufferTasksFromDB: Array<iData> = Array.from(realm.objects('BufferTask'))

    return BufferTasksFromDB

}

export function getEqualToBufferTasks(): iData[] {
    const tasksFromDB: Array<iData> = Array.from(realm.objects('User'))
    const BufferTasksFromDB: Array<iData> = Array.from(realm.objects('BufferTask'))
    const ourTasks = tasksFromDB.filter(i => BufferTasksFromDB.filter(j => j == i))
    return ourTasks

}


export function updateBufferTask(newTask: iIncomeUpdateTasksCommand) {

    console.log("ACTIONS UPDATING FROM BUFFER");
    console.log(newTask);
    
    const {ACT,DATE,TIME,TASK,PER,LEMMACT,LEMMDATE,LEMMTIME,LEMMTASK,LEMMPER,PREFX,LEMMPREFX, NUMTASK} = newTask


    let inputTime = LEMMTIME ? LEMMTIME[0] : 'no'
    let inputHours = LEMMDATE ? LEMMDATE[0] : 'no'

    const hasHour = ['час', 'часы'].some(word => inputTime.includes(word));
    const hasMinute = ['минута', 'минуты'].some(word => inputTime.includes(word));
    const hasDay = ['день', 'дни'].some(word => inputHours.includes(word));
    const hasWeek = ['неделя', 'недели'].some(word => inputHours.includes(word));
    const hasMonth = ['месяц', 'месяцы'].some(word => inputHours.includes(word));
    const hasYear = ['год', 'лет'].some(word => inputHours.includes(word));

    const DateLength = DATE ? DATE : []
    const LemmPrefxLength = LEMMPREFX ? LEMMPREFX : []

    
    const NEWMATCH = LemmPrefxLength.length > 0 ? LEMMPREFX : ['нет префикса']

    console.log("NEWMATCH");
    console.log(NEWMATCH);
    
    // const tasksFromDB: Array<iData> = getEqualToBufferTasks()

    const tasksFromDB  = NUMTASK ? Array.from(realm.objects('User').filtered('id = $0', NUMTASK)) : getEqualToBufferTasks()

    if (tasksFromDB.length < 1) {
        return 'база данных пуста'
    }

    console.log('BUFFER UPDATE PARSER IN ACTIONS GOING ON');
    console.log(DATE);
    console.log(TIME);
    
    
    console.log(tasksFromDB);
    const timeExistance = TIME ? TIME : []
    console.log(timeExistance);
    const dateExistance = DATE ? DATE : []
    const lemmDateExistance = LEMMDATE ? LEMMDATE : []
    console.log(tasksFromDB);
    console.log(dateExistance);
    console.log(lemmDateExistance);
    
    
    
    
    // if (DATE?.length == 1 && TIME?.length == 1 && TASK?.length == 1 && PER?.length == 1) {
    //     return `${data.length} ${data.length === 1 ? 'задача оставлена без изменений' : (data.length >= 2 && data.length <= 4) ? 'задачи оставлены без изменений' : 'задач оставлено  без измененийввв'}`;
    // }
    realm.write(() => {
        // Изменяем свойства объектов, как вам необходимо
        tasksFromDB.forEach(task => {
                task.date = dateExistance.length > 0 ? newDateFuturePastUpdateParser(dateExistance[0],task.date, NEWMATCH.length < 2 ? NEWMATCH[0] : NEWMATCH[0], hasDay, hasWeek, hasMonth, hasYear) : task.date; // замените на новое значение
                task.time = timeExistance.length > 0 ? newTimeFuturePastUpdateParser(timeExistance.length > 0 ? timeExistance[0] : task.lemmaTime , dateExistance.length > 0 ? dateExistance[0] : task.date, lemmDateExistance.length > 0 ? lemmDateExistance[0] : task.lemmaTime , DATE?.length > 1 ? 'нет префикса' : LEMMPREFX ? LEMMPREFX[LEMMPREFX?.length-1] : 'нет префикса ', hasHour, hasMinute) : task.date;
                task.name = LEMMTASK?.length > 0 ? LEMMTASK[0] : task.name;
                task.person = LEMMPER?.length > 0 ? LEMMPER[0] : task.person;
                task.lemmaDate = dateExistance.length > 0 ? newDateFuturePastUpdateParser(dateExistance[0],task.lemmaDate,NEWMATCH.length < 2 ? NEWMATCH[0] : NEWMATCH[0], hasDay, hasWeek, hasMonth, hasYear) : task.date; // замените на новое значение
                task.lemmaTime = timeExistance.length > 0 ? newTimeFuturePastUpdateParser(timeExistance.length > 0 ? timeExistance[0] : task.lemmaTime , dateExistance.length > 0 ? dateExistance[0] : task.lemmaDate,  lemmDateExistance.length > 0 ? lemmDateExistance[0] : task.lemmaTime , DATE?.length > 1 ? 'нет префикса' : LEMMPREFX ? LEMMPREFX[LEMMPREFX?.length-1] : 'нет префикса ', hasHour, hasMinute) : task.lemmaDate;
                task.lemmaName = LEMMTASK?.length > 0 ? LEMMTASK[0] : task.name;
                task.lemmaPerson = LEMMPER?.length > 0 ? LEMMPER[0] : task.person;
                // замените на новое значение
                // ... другие изменения
        });
    });

    console.log(1234345);
    console.log(tasksFromDB);
    
    

    if (tasksFromDB.length < 1) {
        return 'задач не найдено'
    }
    return `${tasksFromDB.length} ${tasksFromDB.length === 1 ? ' задача обновлена' : (tasksFromDB.length >= 2 && tasksFromDB.length <= 4) ? ' задачи обновлены' : ' задач обновлено'}`;
}
