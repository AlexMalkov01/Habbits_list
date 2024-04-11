"use strict" 

const HABBIT_KAY = "HABBIT_KAY";

let globalHabbitsID

let habbits = [];

const page = {
    menu: document.querySelector(".nav__button"),
    header: {
        h1: document.querySelector("h1"),
        progressScale: document.querySelector(".progress__scale_activ"),
        progressProcent: document.querySelector(".percentage__progress"),
    },
    content: {
        contDay:document.querySelector("#Notes"),
        nextDay:document.querySelector(".day_next")

    },
    btn: document.querySelector("#button_input"),
    input: document.querySelector("#comment"),
    delit: document.querySelector(".notes__input_button"),

    formNoActivInput: document.querySelector(".modal_form-input-icon")
} 

//////////////// получения локольных данных из джейсон

function getData () {
    const habbitString = localStorage.getItem(HABBIT_KAY)
    const habbitArray = JSON.parse(habbitString) 

    if (Array.isArray(habbitArray)) {
        habbits = habbitArray 
    }
}

/////////////////// добавления данных на локальный сервер.

function setData () {
    localStorage.setItem(HABBIT_KAY , JSON.stringify(habbits))
}

// ///// renderMenu

function renderMenu(activeHabbet) {
    if (!activeHabbet) {
        return;
    }
    for (const habbit of habbits) {
        const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`) 
        if (!existed) { 
            const element = document.createElement("button")
            element.setAttribute("menu-habbit-id", habbit.id)
            element.classList.add("button__nav")
            element.innerHTML = `<img src="./image/${habbit.icon}.svg" alt="">`
            let listner = element.addEventListener("click",function(){ 
                  rerenderMenu(habbit.id)
             })

            if (activeHabbet.id === habbit.id) { 
                element.classList.add("button__nav_activ")
            } 

            page.menu.appendChild(element)

            continue 
        } 
        document.querySelector(".button__nav_activ")
        
        if (activeHabbet.id === habbit.id){  
            
            existed.classList.add("button__nav_activ")

            
        }
        else {
            existed.classList.remove("button__nav_activ")
        } 
    } 
} 

function panalContent (activeHabbet) {
if (!activeHabbet) return;

    const procentSpen = activeHabbet.days.length / activeHabbet.target >= 1 ?
    100 : activeHabbet.days.length / activeHabbet.target * 100 

    page.header.h1.innerText = activeHabbet.name 

    page.header.progressProcent.innerText = `${procentSpen.toFixed(1)}%` 
    page.header.progressScale.style.width = `${procentSpen.toFixed(1)}%`
} 


function renderContent(activeHabbet) {
    if (!activeHabbet)return;
    
    page.content.contDay.innerHTML = ""
    

    for (const idx in activeHabbet.days) { 


        const element = document.createElement("div") 
        element.classList.add("notes__block")
        element.innerHTML = `
        <div class="notes__block_div">
                        <h3>
                            День ${ Number(idx) + 1}
                        </h3> 
                    </div>
                    <div class="notes__input">
                        <span class="notes__input_span">
                            ${activeHabbet.days[idx]?.comment}
                        </span>

                        <button class="notes__input_button">
                            <img src="./image/delit.svg" alt="">
                        </button>
                    </div>
        `
       
        page.content.nextDay.querySelector("h3").innerText = `День ${activeHabbet?.days?.length + 1}`
        page.content.contDay.appendChild(element) 

    } 

    if (!activeHabbet.days.length) {
        page.content.nextDay.querySelector("h3").innerText = `День 1`
    }


} 




function validForm (form,filds) {
    
    const data = new FormData(form);
    const res = {}
    
    for (const fild of filds) {
        
        const fildValue = data.get(fild);
        
        
        if (data){
            form[fild].classList.add("error")
            
        } else {
            form[fild].classList.remove("error")
        }
        
        
        res[fild] = fildValue
    }
    let isValidForm = true 
    
    for (const fild of filds) {
        if (!res[fild]) {
            isValidForm = false
        }
    }   
    
    if (!isValidForm)return;
    
    return res
}
function resetForm(form,fields) {

    const data = new FormData(form);

    for (const fild of fields) {
       form[fild].value = ""
    }
}


function renderBtn (event) {
    const form = event.target
    const ress = new FormData (form);
    console.log(document.querySelector(".modal").classList);
    event.preventDefault();
    const data = validForm( form,["comment"]);
    
    if (!data)return;
    
    // console.log(data);
    
    
    habbits = habbits.map((habbit)=>{
        if (habbit.id === globalHabbitsID.id) {
                return {
                    ...habbit,
                    days:[...habbit.days,{comment: data.comment}]
                }
            } else {
                return habbit
            }
        })
    
        
        form["comment"].value = "" 
        
        setData()
        rerenderMenu(globalHabbitsID.id)
    }  

    function addHabbit (event) {
        event.preventDefault();
        const data = validForm (event.target, ["name","icon","target"]);

        if (!data)return;

        
        habbits.push({
            id: habbits.length + 1,
            name: data.name,
            icon:data.icon,
            target: +data.target, 
            days:[]
        })
        
        resetForm(event.target, ["name","icon","target"])
        rerenderMenu(habbits.at(-1).id)
        modalActiv()
        setData()
    }

    


function rerenderBtnDelit(activeHabbet){
    if (!activeHabbet)return;


    document.querySelectorAll(".notes__input_button").forEach((el,idx,arr)=>{
        el.addEventListener("click", ()=>{
          const res = idx;


          const res2 = activeHabbet.days.filter((el,idx)=> idx !== res)

        // const res2 = activeHabbet.days.reduce((acc,el,idx)=>{
        //     if (idx !== res) {
        //         acc.push(el)
        //         return acc 
        //     }
        //     return acc
        //  },[])

         activeHabbet.days = res2 

         

       setData();

       rerenderMenu(activeHabbet.id);
        });
        
    })
         
}


function rerenderMenu (habbitId) {
    const selectedHabbit = habbits.find((habbit)=> habbit.id === habbitId)
    renderMenu(selectedHabbit)
    panalContent(selectedHabbit) 
    renderContent(selectedHabbit)
    rerenderBtnDelit(selectedHabbit)
    globalHabbitsID = selectedHabbit
}  


function modalActiv() {
    document.querySelector(".cover").classList.toggle("modal_active")
}

function activModelIcon(obj,el) {
    page.formNoActivInput.value = el
    document.querySelector(".icon__activ").classList.remove("icon__activ")
    obj.classList.add("icon__activ") 
} 




      
        // ///////// Инициализация
        
        (()=>{
            getData (); 
            rerenderMenu(habbits[0].id);
        })() 