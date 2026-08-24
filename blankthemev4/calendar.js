const calendarGrid=document.getElementById("calendarGrid"),
webAppURL="https://script.google.com/macros/s/AKfycbxP-b5UvL4Ok_u8u-fMJTQqr6-F9hLQw4MvKaAmH501P4FoZzLzr2rV98CysgTAKrWJWw/exec",
now=new Date,
year=now.getFullYear(),
month=now.getMonth();

const dateKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

const parseDate=d=>{
    d=new Date(d);
    d.setHours(0,0,0,0);
    return d;
};

async function loadEvents(){
    try{
        const events=await(await fetch(webAppURL)).json();
        renderCalendar(events);
    }catch(e){
        calendarGrid.textContent="Erreur : "+e;
    }
}

function renderCalendar(events){
    const first=new Date(year,month,1);
    let start=first.getDay();
    start=start===0?6:start-1;

    calendarTitle.textContent=first.toLocaleDateString("fr-FR",{
        month:"long",
        year:"numeric"
    });

    calendarGrid.innerHTML="";

    const eventMap={};

    events.forEach(ev=>{
        const startDate=parseDate(ev.startDate);
        const endDate=parseDate(ev.endDate);

        for(
            let d=new Date(startDate);
            d<=endDate;
            d.setDate(d.getDate()+1)
        ){
            const key=dateKey(d);

            if(!eventMap[key])
                eventMap[key]=[];

            eventMap[key].push(ev);
        }
    });

    const previousDays=new Date(year,month,0).getDate();
    const days=new Date(year,month+1,0).getDate();

    for(let i=start-1;i>=0;i--)
        createDayCell(
            new Date(year,month-1,previousDays-i),
            true,
            eventMap
        );

    for(let day=1;day<=days;day++)
        createDayCell(
            new Date(year,month,day),
            false,
            eventMap
        );

    const remaining=(7-calendarGrid.children.length%7)%7;

    for(let day=1;day<=remaining;day++)
        createDayCell(
            new Date(year,month+1,day),
            true,
            eventMap
        );
}

function createDayCell(date,outsideMonth,eventMap){
    const cell=document.createElement("div"),
          number=document.createElement("div");

    cell.className="calendar-day";

    if(outsideMonth)
        cell.classList.add("outside-month");

    if(dateKey(new Date)===dateKey(date))
        cell.classList.add("today");

    number.className="day-number";
    number.textContent=date.getDate();
    cell.appendChild(number);

    const dayEvents=eventMap[dateKey(date)];

    if(dayEvents?.length){
        const container=document.createElement("div");
        container.className="events-container";

        dayEvents.forEach(()=>{
            const dot=document.createElement("span");
            dot.className="event-dot";
            container.appendChild(dot);
        });

        const tooltip=document.createElement("div");
        tooltip.className="event-tooltip";

        tooltip.innerHTML=dayEvents.map(ev=>`
            <div class="tooltip-event">
                <div class="event-title">${ev.event||""}</div>
                <div class="event-description">${ev.description||""}</div>
            </div>
        `).join("");

        container.appendChild(tooltip);
        cell.appendChild(container);
    }

    calendarGrid.appendChild(cell);
}

loadEvents();
