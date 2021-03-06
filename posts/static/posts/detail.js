const url = window.location.href + "pk/";
const updateUrl = window.location.href + "update/";
const deleteUrl = window.location.href + "delete/";
const surl = window.location.origin;
const loading = document.getElementById("loading");
const updateBtn = document.getElementById("update-btn");
const saveBtn = document.getElementById("save-btn");
const deleteBtn = document.getElementById("delete-btn");
const detail_div = document.getElementById("detail_div");

const titleInput = document.getElementById("id_title");
const bodyInput = document.getElementById("id_body");

const updateForm = document.getElementById("update-form");
const deleteForm = document.getElementById("delete-form");
const commentForm = document.getElementById("comment-form");
const commentDiv = document.getElementById("comment-div");
const commentBox = document.getElementById("comment-box");



//get detail view
$.ajax({
  type: "GET",
  url: url,
  success: function (response) {
    console.log(response);
    const el = response.data;
   const  res = response.post_comments
    const child = response.post_comments.child
    
    if (el.logged_in !== el.author) {
      console.log("different");
    } else {
      console.log("the same");
      updateBtn.classList.remove("not-visible");
      deleteBtn.classList.remove("not-visible");
    }
    detail_div.innerHTML = `
    <div class="col-lg-6 col-md-10 col-sm-11 m-auto card mt-2">
    <div class="card-body d-flex ">
    
      <span>
      <input type="hidden" id="post_id" value="${el.id}" />
      <a class="author" href="/${el.author}">
      <img src="${el.avatar}" class="rounded-circle" width="45" /> 
      </a>
       </span>
     <div class="mx-3">
      <a class="author" href="/${el.author}">${el.author}</a> </br>
        <span id="title"> ${el.title}</span> 
         <p id="body"> ${el.body}</p>
     </div>
 </div>
 <div class ="card-footer">
     <div class="d-flex">
         <form class="like-unlike-forms" data-form-id="${el.id}">
         <button class="loadmore" mx-2" id="like-unlike-${el.id}">${
      el.liked
        ? `${el.count}<i class="fa fa-heart mx-1"></i>`
        : ` ${el.count} Like`
    }</button>
     </form>
     <form class="save-forms" data-save-id="${el.id}">
     <button id="save-${el.id}" class="savepost mx-2">${
      el.important
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-check-fill" viewBox="0 0 16 16">
     <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zm8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
   </svg> Saved `
        : `Save Post`
    }</button> 
    </form>
     </div>
 </div>
</div>`;
      //for comments
      res.forEach(com => {
        var child = com.child
  
       
        commentDiv.innerHTML +=`
      
        
        <div class="search-result mt-2" id="com-${com.id}">
      
       
        <div class="card-bodys d-flex ">
            <span>
            <a class="author" href="/${com.user}">
            <img src="${com.avatar}" class="rounded-circle" width="45" /> 
            </a>
             </span>
           <div class="mx-3">
            <a class="author" href="/${com.user}">${com.user}</a> </br>
          
               <p>  ${com.body}</p>
       </div>
   </div>

   <div class="card-footers d-flex">
   ${com.can_delete?`
   <form class="delete-comment-forms" data-comment-id="${com.id}">
   <button id="delete-comment-${com.id}" class="cmnt-delete"><i class="fa fa-trash"></i></button>
   </form>`:``

   }
   <form class="like-comment-forms" data-comment-id="${com.id}">
  <button id="like-comment-${com.id}" class="loadmoresm mx-2">
  ${com.comment_liked?
 ` ${com.like_comment}<i class="fa fa-heart mx-1"></i>`:`${com.like_comment} Like`}</button>
  
   </form>
    <form class="reply-comment-forms" data-reply-id="${com.id}" >
       <button id="show-reply-${com.id}" class="savepostsm mx-1">
       <i class="fa fa-comment-dots mx-1"></i></button>
       <span id="replybox-${com.id}" class="replybox d-none">
       <span style="position:relative;">
         <input type="text" class="d-inline comment-box" id="replyinput-${com.id}" placeholder="reply..."  />
         <button type="button" class="d-inline savepostsm mx-1 replybtn" id="replybutton-${com.id}">
         <i class="fa fa-comment-dots "></i>
         </button>
         </span>
       </div>
     </form>

   </div>
  
</div>
  <div  id="reply-divs">
  ${child.map(c=> {
    return `
   
     <div class="reply-div" id="com-${c.id}" >
   
     <div class="reply-comment ">
     <span class="d-flex reply-flex">
     ${c.can_delete ?` <form class="delete-comment-forms" data-comment-id="${c.id}">
     <button id="delete-comment-${c.id}" class="cmnt-delete"><i class="fa fa-trash"></i></button>
     </form>`:``}
    
      <img src="${c.avatar}" class="infoimg mx-2"/>
      <div>
         <a class="author" href="/${c.user}">${c.user}</a>
         <p>${c.body}</p>
      </div>
    </span>
    <form class="like-comment-forms" data-comment-id="${c.id}">
    <button id="like-comment-${c.id}" class="loadmoresm mx-2">
    ${c.comment_liked?
   ` ${c.like_comment}<i class="fa fa-heart mx-1"></i>`:`${c.like_comment} Like`}</button>
    
     </form>
    </div>
 
    <div>
    </div>
    </div>`
  }).join("")}
  </div>




`;




      })
      const blank = document.getElementById("blank")
      if (res.length < 1) {
        blank.textContent =`No comments added yet!`
      }

    titleInput.value = el.title;
    bodyInput.value = el.body;
    loading.style.display = "none";
    likeUnlikePosts();
    saveUnsaveForms();
    commentlike();
  
    commentDelete();
    commentreply()
  },

  error: function (error) {
    console.log(error);
  },
});



//update_Form
const csrf = document.getElementsByName("csrfmiddlewaretoken");

updateForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("title");
  const body = document.getElementById("body");

  $.ajax({
    type: "POST",
    url: updateUrl,
    data: {
      csrfmiddlewaretoken: csrf[0].value,
      title: titleInput.value,
      body: bodyInput.value,
    },
    success: function (res) {
      console.log(res);
      $("#updateModal").modal("hide");
      title.textContent = res.title;
      body.textContent = res.body;
      handlealerts("added", `Successfully delted !`);
    },
    error: function (err) {
      console.log(err);
    },
  });
});

//delete

deleteForm.addEventListener("submit", function (e) {
  e.preventDefault();

 
  $.ajax({
    type: "POST",
    url: deleteUrl,
    data: {
      csrfmiddlewaretoken: csrf[0].value,
    },
    success: function (res) {
      console.log(res);
      window.location.href = window.location.origin;
      $("#deleteModal").modal("hide");
      localStorage.setItem("title", titleInput.value);
    },
    error: function (err) {
      console.log(err);
    },
  });
});
// save

// adding comment with ajax
commentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $.ajax({
    type: "POST",
    url: window.location.href,
    data: {
      csrfmiddlewaretoken: csrf[0].value,
      body: commentBox.value,
    },
    success: function (res) {
      console.log(res);
      commentDiv.insertAdjacentHTML(
        "afterbegin",
        `
         <div  class="animate__animated animate__bounce animate__delay-0s search-result mt-2">
        
          <div class="card-bodys d-flex ">
              <span>
              <a class="author" href="/${res.user}">
              <img src="${res.avatar}" class="rounded-circle" width="45" /> 
              </a>
               </span>
             <div class="mx-3">
              <a class="author" href="/${res.user}">${res.user}</a> </br>
                 <p>  ${res.body}</p>
         </div>
     </div>
     <div class="card-footers d-flex">
   
  
     <form class="like-comment-forms" data-comment-id="${res.id}">
    <button id="like-comment-${res.id}" class="loadmoresm mx-2">0 Like</button>
    
     </form>
    
     </div>
  
 </div>
        `
      );
      blank.textContent = ''
      commentForm.reset();
      commentlike()
    },
    error: function (err) {
      console.log(err);
      handlealerts("failed", "Oops !something went wrong !");
    },
  });
});
