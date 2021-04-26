const url = window.location.href + "pk/"
const updateUrl = window.location.href + "update/"
const deleteUrl = window.location.href + "delete/"

const loading = document.getElementById("loading")
const updateBtn = document.getElementById('update-btn')
const saveBtn = document.getElementById('save-btn')
const deleteBtn = document.getElementById('delete-btn') 
const detail_div = document.getElementById("detail_div")

const titleInput = document.getElementById("id_title")
const bodyInput = document.getElementById("id_body")

const updateForm = document.getElementById('update-form')
const deleteForm = document.getElementById('delete-form')
const commentForm = document.getElementById('comment-form')
const commentDiv = document.getElementById('comment-div')

const commentBox = document.getElementById('comment-box')
//get detail view
$.ajax({
    type: 'GET',
    url: url,
    success: function(response){
        console.log(response)
        const el = response.data
        console.log(el)
        if (el.logged_in !== el.author) {
            console.log('different')
        } else {
            console.log('the same')
            updateBtn.classList.remove('not-visible')
            deleteBtn.classList.remove('not-visible')
        }
        detail_div.innerHTML = `
        <div class="card mt-2">
        <div class="card-body">
            <p><span id="title">${el.title}</span>
            <a href="/${el.author}"><span class="float-left"> | ${el.author}</span></a></p>
            <p id="body"> ${el.body}</p>
        </div>
        <div class ="card-footer">
            <div class="d-flex">
           
                <form class="like-unlike-forms" data-form-id="${el.id}">
                <button class="btn btn-danger mx-2" id="like-unlike-${el.id}">${el.liked ? `${el.count} Unlike `: ` ${el.count} Like`}</button>
            </form>
            </div>
        </div>
    </div>
        `
        titleInput.value = el.title
        bodyInput.value = el.body
        loading.style.display = "none";
        likeUnlikePosts()
    },

    error:function(error){
        console.log(error)
    }
})

//get detail view


//update_Form
const csrf = document.getElementsByName('csrfmiddlewaretoken')

updateForm.addEventListener('submit',function(e){
    e.preventDefault()
    const title = document.getElementById("title")
    const body = document.getElementById("body")

    $.ajax({
        type:'POST',
        url: updateUrl,
        data:{
            'csrfmiddlewaretoken':csrf[0].value,
            'title':titleInput.value,
            'body':bodyInput.value,
        },
        success:function(res){
            console.log(res)
            $('#updateModal').modal('hide')
            title.textContent = res.title
            body.textContent = res.body
            handlealerts('added','Successfully Edited !')
        },
        error:function(err){
            console.log(err)
        }
    })

})


//delete

deleteForm.addEventListener('submit',function(e){
    e.preventDefault()

    $.ajax({
        type:'POST',
        url: deleteUrl,
        data:{
            'csrfmiddlewaretoken':csrf[0].value,
        },
        success:function(res){
            console.log(res)
            window.location.href = window.location.origin
            $('#deleteModal').modal('hide')
           localStorage.setItem('title',titleInput.value)
        },
        error:function(err){
            console.log(err)
        }
    })

})
$(document).ready(function(){
const durl = window.location.href + "save/"
$(document).on('click','#save-btn',function(e){

    e.preventDefault()
    console.log(durl)
    $.ajax({
        type:'post',
        url: durl,
        data:{
            'csrfmiddlewaretoken':csrf[0].value,

        },
        success:function(res){
         console.log(res)
            saveBtn.textContent = `${res.important? "Saved":"Save Post"}`

     if(res.important){
        handlealerts('added','Successfully Added to Save !')
     }
     else{
        handlealerts('failed','Successfully removed!')
     }
         
        },
        error:function(err){
            console.log(err)
            handlealerts('failed','Something seems to be wrong!')
        }
    })
})

});

// adding post with ajax
commentForm.addEventListener('submit',e=>{

    e.preventDefault()
    $.ajax({
        type:'POST',
        url:window.location.href,
        data:{
            'csrfmiddlewaretoken':csrf[0].value,
            'body':commentBox.value,
        },
        success:function(res){
            console.log(res.body)
            commentDiv.insertAdjacentHTML('afterbegin',`
            <div class="animate__animated animate__bounce animate__delay-0s card mt-2 comment">
            <div class="card-body">
            <a href="/${res.user}">${res.user}</a>
                <p> ${res.body}</p>
            </div>
        </div>
        `)
        
        commentForm.reset()
        },
        error:function(err){
            console.log(err)
            handlealerts('failed','Oops !something went wrong !')
        }
    })
})
