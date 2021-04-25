const hello = document.getElementById("posts-box")
const loading = document.getElementById("loading")
const load_btn = document.getElementById("load_btn")
const endbox = document.getElementById("end-box")
let visible = 3;




// getiing all the datas
const getData = () => {
$.ajax({
    type:'GET',
    url:`/lists/${visible}/`,
    success:function(res){
        console.log(res.data)
        data = res.data

        data.forEach(el => {
            hello.innerHTML += `
            <div class="card mt-2">
            <div class="card-body">
                <p> ${el.title} |  <a href="${url}${el.author}"><span class="float-right">${el.author}</span></a></p>
                <p> ${el.body}</p>
            </div>
            <div class ="card-footer">
                <div class="d-flex">
                <a href="${url}${el.id}" class="btn btn-info">Detail</a>
                    <form class="like-unlike-forms" data-form-id="${el.id}">
                    <button class="btn btn-danger mx-2" id="like-unlike-${el.id}">${el.liked ? `${el.count} Unlike `: ` ${el.count} Like`}</button>
                </form>
                <button class="btn btn-secondary mx-2">${el.important ? `Saved `: `Save Post`}</button>
                </div>
            </div>
        </div>
            `
          
            likeUnlikePosts()
        loading.style.display = "none";
        
        });
        console.log(res.size)
        if (res.size === 0){
            endbox.textContent = "No posts added yet ..."
            loading.style.display = "none";
        }
        else if (res.size <=visible){
            loading.style.display = "none"
            endbox.textContent = "No more post to load ..."
        }
    },
    error:function(err){
        console.log(`error is ${err}`)
    }
})
}


load_btn.addEventListener('click' , () => {
    loading.style.display = "block";
    visible +=3;
    getData()
    scrollPage()
})
getData()

// scrolling after clicking load more button
var scrollAmount = 820;
function scrollPage() {
    var currentPositionOfPage = window.scrollY;
    window.scrollTo(0, currentPositionOfPage + scrollAmount);
}

const postForm = document.getElementById("post-form")
const title = document.getElementById("id_title")
const body = document.getElementById("id_body")
const csrf = document.getElementsByName('csrfmiddlewaretoken')
const url =window.location.href

const deleted = localStorage.getItem('title')
if(deleted){
    handlealerts('added',`"${deleted}" was deleted !`)
    localStorage.clear()
}

// adding post with ajax
postForm.addEventListener('submit',e=>{
    e.preventDefault()
    $.ajax({
        type:'POST',
        url:"",
        data:{
            'csrfmiddlewaretoken':csrf[0].value,
            'title':title.value,
            'body':body.value
        },
        success:function(res){
            console.log(res)
            hello.insertAdjacentHTML('afterbegin',`
            <div class="card mt-2">
            <div class="card-body">
                <p>${res.title} | <a href="${url}${res.author}"><span class="float-right">${res.author}</span></a></p>
                <p> ${res.body}</p>
            </div>
            <div class ="card-footer">
                <div class="d-flex">
                    <a href="${url}${res.id}" class="btn btn-info">Detail</a>
                    <form class="like-unlike-forms" data-form-id="${res.id}">
                    <button class="btn btn-danger mx-2" id="like-unlike-${res.id}">0 Like</button>
                </form>
                <button class="btn btn-secondary mx-2">${res.important ? `Saved `: `Save Post`}</button>
                </div>
            </div>
        </div>
        `)
        
        postForm.reset()
        likeUnlikePosts()
        handlealerts('added',"Added Post")
        $('#addPostModal').modal('hide')
        },
        error:function(err){
            console.log(err)
            handlealerts('failed','Oops !something went wrong !')
            $('#addPostModal').modal('hide')
        }
    })
})

// search

const searchinput = document.getElementById("searchinput")

const resultdiv = document.getElementById("resultdiv")
const searchform = document.getElementById("searchform")

const sendSearchData = (search) => {
    $.ajax({
        type:'POST',
        url:'search/',
        data:{
            'csrfmiddlewaretoken':csrf[0].value,
            'search':search,
        },
        success:function(res){
            console.log(res.search)
            const data = res.search
           
                if(Array.isArray(data)){
                    resultdiv.innerHTML =""
                    data.forEach(el => {
                     resultdiv.innerHTML += `
                       <a href="${url}${el.id}"> <div class="search-result mt-2">
                        <div class="">
                            <p>${el.title} </p>
                            <p> ${el.body}</p>
                        </div>
                        </div></a>
                `
                    })}
                else{
                    if(searchinput.value.length > 0){
                        resultdiv.innerHTML = `${data}`
                    }
                    else{
                        resultdiv.classList.add('not-visible')
                    }
                }

                // resultdiv.innerHTML += `
              
                // <div class="card mt-2">
                // <div class="card-body">
                //     <p>${el.title} </p>
                //     <p> ${el.body}</p>
                // </div>
                // </div>


                // `
       
        },
        error:function(err){
            console.log(err)
        }
    })
}

searchinput.addEventListener('keyup',function(e){
    e.preventDefault()

    if (resultdiv.classList.contains('not-visible')) {
        resultdiv.classList.remove('not-visible')
    }
    sendSearchData(e.target.value)
})

const objRef = document.body

objRef.addEventListener('click',()=>{
    resultdiv.classList.add('not-visible')
    searchinput.value = ''
})