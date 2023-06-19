const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/'

const form = document.forms.form;
const input = form.search_word;
const search_btn = form.querySelector('.search');

const sound = document.getElementById('audio')

const content = document.querySelector('.content');

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(input.value.trim().length !== 0) get_word(input.value);
})

search_btn.addEventListener('click', ()=>{
    if(input.value.trim().length !== 0) get_word(input.value);
})

function make_sound(){
    if(sound.getAttribute('src') !== 'no_sound'){
        sound.play();
    }
    else{
        alert("No sound for this word")
    }
}

async function get_word(word){

    content.innerHTML = `
        <div class="loading-container mt-5">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
    `


    const response = await fetch(`${url}${word}`)
    const data = await response.json();

    if (!response.ok) {
        content.innerHTML = `
        <h3 class='display-5 text-center mt-5 mb-3'>Error 404</h3>
        <p class='text-center'>Unfortunately there is no such word.</p>
        `
    }
    else{

        
        console.log(data)

        let max = -1, index = 0;

        data.forEach((el, i) =>{
            if(el.meanings.length > max){
                max = el.meanings.length;
                index = i;
            }
        })



            let temp = '';

            temp =`
            <div class="word mt-5 mb-3">
                <h2 class="display-5">${data[index].word}</h2>
            
                <button type="button" class="hear" onclick='make_sound()'>
                    <i class="fa-solid fa-volume-high"></i>
                </button>
            </div>

            <p class='phonetic'>${data[index].phonetic}</p>
            `

            temp += `<section class="accordion" id="accordion_id">`

            for(let i = 0; i< max; i++){
                temp +=`
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_${i}" aria-expanded="true" aria-controls="collapse_${i}" style='text-transform: capitalize;'>
                                ${data[index].meanings[i].partOfSpeech}
                            </button>
                        </h2>
                        
                        
                        <div id="collapse_${i}" class="accordion-collapse collapse show">
                            <div class="accordion-body">
                                <p class="word-meaning mb-3 p-3">
                                    ${data[index].meanings[i].definitions[0].definition}
                                </p>`;

                                if(data[index].meanings[i].definitions[0].example){
                                    temp += `
                                        <p class="example mb-3">
                                            ${data[index].meanings[i].definitions[0].example}
                                        </p>`
                                }
                            
                                temp += `


                            </div>
                        </div>
                        
                        

                    </div>`
            }

            temp += `</section>`

        if(data[0].phonetics[0].audio){
            sound.setAttribute('src', `${data[0].phonetics[0].audio}`);
        }
        else{
            sound.setAttribute('src', `no_sound`)
        }

        content.innerHTML = temp;

    
    }
}


