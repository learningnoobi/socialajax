
alertBox = document.getElementById("alertBox")
const handlealerts = (type,message) => {
    alertBox.innerHTML = `
    <div id="alertBox" class="animate__animated animate__bounce animate__delay-0s ${type}">
    <p> ${message}
    <span class="float-right cross" onclick="hideme()"> X </span>
    </p>
    </div>
    `
}
function hideme(){
    alertBox.style.display ="none";
}

setTimeout(() => {
    alertBox.style.display ="none";
},10000)


const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');


const likeUnlikePosts = () => {
    // e.preventDefault()
    const likeUnlikeForms = [...document.getElementsByClassName('like-unlike-forms')]
    likeUnlikeForms.forEach((form) => form.addEventListener('submit', e =>{
        e.preventDefault()
        const clickedId = e.target.getAttribute('data-form-id')

        clickedBtn = document.getElementById(`like-unlike-${clickedId}`)

        $.ajax({
            type:'POST',
            url:"/like-unlike/",
            data:{
                'csrfmiddlewaretoken':csrftoken,
                'pk':clickedId
            },
            success:function(response){
                clickedBtn.textContent = response.liked ? `${response.count} Unlike`: `${response.count} Like`
            
            },
            error:function(err){
                console.log(err)
            }
        })

    }))
}


