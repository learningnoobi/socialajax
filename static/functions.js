alertBox = document.getElementById("alertBox");
const handlealerts = (type, message) => {
  alertBox.innerHTML = `
    <div id="alertBox" class="animate__animated animate__bounce animate__delay-0s ${type}">
    <p> ${message}
    <span class="float-right cross" onclick="hideme()"> X </span>
    </p>
    </div>
    `;
};
function hideme() {
  alertBox.style.display = "none";
}
setInterval(() => {
  alertBox.style.display = "none";
}, 5000);

const first = document.querySelector("#id_password1");
const second = document.querySelector("#id_password2");
const third = document.querySelector("#login_password");

// toggle password
const showpassword = (a) => {
  if (a.type === "password") {
    a.type = "text";
  } else {
    a.type = "password";
  }
};

const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};
const csrftoken = getCookie("csrftoken");

// const durl = window.location.href + "save/"

const likeUnlikePosts = () => {
  // e.preventDefault()
  const likeUnlikeForms = [
    ...document.getElementsByClassName("like-unlike-forms"),
  ];
  likeUnlikeForms.forEach((form) =>
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const clickedId = e.target.getAttribute("data-form-id");

      clickedBtn = document.getElementById(`like-unlike-${clickedId}`);

      $.ajax({
        type: "POST",
        url: "/like-unlike/",
        data: {
          csrfmiddlewaretoken: csrftoken,
          pk: clickedId,
        },
        success: function (response) {
          clickedBtn.innerHTML = response.liked
            ? `${response.count}<i class="fa fa-heart mx-2"></i>`
            : `${response.count} Like`;
            
        },
        error: function (err) {
          console.log(err);
        },
      });
    })
  );
};

// save function
const saveUnsaveForms = () => {
  const saveForms = [...document.getElementsByClassName("save-forms")];
  saveForms.forEach((form) =>
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const clickedme = e.target.getAttribute("data-save-id");
      clickedBtn = document.getElementById(`save-${clickedme}`);

      $.ajax({
        type: "post",
        url: "/save/",
        data: {
          csrfmiddlewaretoken: csrftoken,
          pk: clickedme,
        },
        success: function (res) {
          console.log(res);
          clickedBtn.innerHTML = `${
            res.important
              ? ` <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-check-fill" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zm8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
              </svg> Saved`
              : "Save Post"
          }`;

          if (res.important) {
            handlealerts("added", "Successfully Added to Save !");
          } else {
            handlealerts("failed", "Successfully removed!");
          }
        },
        error: function (err) {
          console.log(err);
          handlealerts("failed", "Something seems to be wrong!");
        },
      });
    })
  );
};

const togglefollow = () => {
  const toggleForms = [
    ...document.getElementsByClassName("follow-unfollow-forms"),
  ];
  toggleForms.forEach((form) =>
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const clickedId = e.target.getAttribute("data-follow-id");
      const clickedtoggle = document.getElementById(`toggle_btn-${clickedId}`);
      console.log(clickedId);
      const followers = document.getElementById(`followers-${clickedId}`);
      $.ajax({
        type: "POST",
        url: "/user/follow_unfollow/",
        data: {
          csrfmiddlewaretoken: csrftoken,
          profile_pk: clickedId,
        },
        success: function (res) {
          console.log(res);
          clickedtoggle.textContent = `${
            res.follow ? ` Unfollow ` : ` Follow `
          }`;
          if (res.follow) {
            handlealerts("added", "Successfully Followed!");
          } else {
            handlealerts("failed", "Successfully unfollowed!");
          }
          followers.textContent = `${res.followers}`;
        },
        error: function (err) {
          console.log(err);
        },
      });
    })
  );
};


const commentlike = () => {
  const likeCommentForms = [
    ...document.getElementsByClassName("like-comment-forms"),
  ];
  // console.log(likeCommentForms)
  likeCommentForms.forEach((form) =>
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const clickedId = e.target.getAttribute("data-comment-id");
 
      const clickedBtn = document.getElementById(`like-comment-${clickedId}`);

      $.ajax({
        type: "POST",
        url: "/like-unlike-comment/",
        data: {
          csrfmiddlewaretoken: csrftoken,
          pk: clickedId,
        },
        success: function (response) {
          clickedBtn.innerHTML = response.liked
            ? `${response.count} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
              </svg>`
            : `${response.count} Like`;
        },
        error: function (err) {
          console.log(err);
          handlealerts("failed","something's wrong !")
        },
      });
    })
  )};

  const commentDelete = () => {
  const deleteCommentForms = [
    ...document.getElementsByClassName("delete-comment-forms"),
  ];
  // console.log(deleteCommentForms)
  deleteCommentForms.forEach((form) =>
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const clickedId = e.target.getAttribute("data-comment-id");
  
      const clickedBtn = document.getElementById(`delete-comment-${clickedId}`);
    
      const comment = document.getElementById(`com-${clickedId}`)
      const replydiv = document.getElementById(`com-${clickedId}`)
      const replydivs = document.getElementById('reply-divs')
      // console.log(comment)
      $.ajax({
        type: "POST",
        url: "/comment/delete_comment/",
        data: {
          csrfmiddlewaretoken: csrftoken,
          pk: clickedId,
        },
        success: function (response) {
          console.log(response)
          if(response.msg=="No"){
            handlealerts("failed","You can't delete this !")
          }
          else{
            handlealerts("added",response.msg)
            comment.style.display = "none"
            replydiv.style.display = "none"
           
          }
        
        },
        error: function (err) {
          console.log(err);
          handlealerts("failed","something's wrong !")
        },
      });
    })
  )};





  const commentreply = () => {
    const showreplyforms = [
      ...document.getElementsByClassName("reply-comment-forms"),
    ];
    console.log(showreplyforms)
    showreplyforms.forEach((el) =>
      el.addEventListener('submit', function(e){
        e.preventDefault();
        const clickedId = e.target.getAttribute("data-reply-id");
        const difbtn = document.getElementById(`show-reply-${clickedId}`);
        const replybox = document.getElementById(`replybox-${clickedId}`);
        const replyinput = document.getElementById(`replyinput-${clickedId}`);
        const replybutton = document.getElementById(`replybutton-${clickedId}`);
        const post_pk = document.getElementById('post_id').value
        const replydiv = document.getElementById('reply-divs')
        const replydivs = document.getElementById(`com-${clickedId}`)

        // console.log(post_pk)
        // console.log(clickedId)
        // console.log(replybox)
       
        replybox.classList.toggle("d-block")
        replybox.classList.toggle("d-none")
        // console.log(replyinput)
        replybutton.addEventListener('click',()=>{
          console.log(replyinput.value)
          const body = replyinput.value.trim()
          if(body.length <1){
            alert('cannot be blank')
          }
          else{
            $.ajax({
              type: "POST",
              url: "/reply/comment/",
              data: {
                csrfmiddlewaretoken: csrftoken,
                post_pk:post_pk,
                pk: clickedId,
                body:body
              },
              success: function (c) {
                console.log(c)
                replydivs.insertAdjacentHTML("afterend",`
   
                <div class="reply-div" id="com-${c.id}" >
              
                <div class="reply-comment ">
                <span class="d-flex reply-flex">
                
                 <img src="${c.avatar}" class="infoimg mx-2"/>
                 <div>
                    <a class="author" href="/${c.user}">${c.user}</a>
                    <p>${c.body}</p>
                 </div>
                 </span>
                
               </div>
               <div>
               </div>`)
               replyinput.value = ""
              },
              error: function (err) {
                console.log(err);
                handlealerts("failed","something's wrong !")
              },
          });
          }

        })
        
          
  
       
      })
    )};
  
  