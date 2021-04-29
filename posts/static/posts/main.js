const hello = document.getElementById("posts-box");
const loading = document.getElementById("loading");
const load_btn = document.getElementById("load_btn");
const endbox = document.getElementById("end-box");
let visible = 3;
const togglebtn = document.getElementById("toggle_btn");

// const saveBtn = document.getElementById('save-btn')

// getiing all the datas
const getData = () => {
  $.ajax({
    type: "GET",
    url: `/lists/${visible}/`,
    success: function (res) {
      console.log(res.data);
      data = res.data;

      data.forEach((el) => {
        hello.innerHTML += `
     
     
       <input type="hidden" id="profile_pk" name="profile_pk" value="${
         el.author
       }" />
            <div class="card mt-2">
               <div class="card-body d-flex ">
                 <span>
                 <span class="hoverme">
                        <img src="${
                          el.avatar
                        }" class="rounded-circle infoimg" /> 


                            <div class="content">
                                <div class="d-flex">
                                <img src="${
                                  el.avatar
                                }" class="rounded infoimg"/> 
                                    <span class="mx-2">
                                    <span class="author">${el.author}</span>
                                   
                                    <p class="bio">${el.bio}</p> 
                                   <div class="d-flex">
                                        <span class="followers">Followers
                                        <p id="followers-${
                                          el.author
                                        }"  class="ml-2">${el.followers}</p>
                                        </span>
                                        <span class="followers mx-2">Following
                                        <p class="ml-2">${el.following}</p>
                                        </span>
                                   </div>
                                </div>
                                <span class="d-flex mt-2">

                                <form class="follow-unfollow-forms" data-follow-id="${
                                  el.author
                                }">
                                ${
                                  el.same_user_author
                                    ? `<button type="submit" class="loadmoresm">You Man</button>`
                                    : `${
                                        el.follow
                                          ? `
                                         
                                          <button id="toggle_btn-${el.author}"   type="submit" class="loadmoresm btn-${el.author}">Unfollow</button>`
                                          : `
                                         
                                          <button id="toggle_btn-${el.author}"  type="submit" class="loadmoresm btn-${el.author}">Follow</button>`
                                      }`
                                }
                                </form>


                                
                              
                                <a class="author" href="${url}${el.author}">
                                <button class="savepostsm mx-2">Profile</button>
                                </a>
                            </span>
                            </div>


                    </span>
                  </span>
                <div class="mx-3">
                 <a class="author" href="${url}${el.author}">${
          el.author
        }</a> </br>
                    ${el.title} 
                    <p> ${el.body}</p>
                </div>
            </div>
            <div class ="card-footer">
                <div class="d-flex">
                    <a href="${url}${el.id}" class="cmnt-post">Detail</a>
                    
                    <form class="like-unlike-forms" data-form-id="${el.id}">
                           <button  id="like-unlike-${
                             el.id
                           }" class="loadmore mx-2">
                            ${
                              el.liked
                                ? `${el.count} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                          </svg> `
                                : ` ${el.count} Like`
                            }</button>

                            
                      </form>

                     <form class="save-forms" data-save-id="${el.id}">
                          <button id="save-${el.id}"  class="savepost mx-2">${
          el.important
            ? ` <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-check-fill" viewBox="0 0 16 16">
                          <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zm8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
                        </svg> Saved `
            : `Save Post`
        }</button> 
                    </form>
                </div>
            </div>
        </div>




            `;

        likeUnlikePosts();

        loading.style.display = "none";
        saveUnsaveForms();
        togglefollow();
      });
      console.log(res.size);
      if (res.size === 0) {
        endbox.textContent = "No posts added yet ...";
        loading.style.display = "none";
      } else if (res.size <= visible) {
        loading.style.display = "none";
        endbox.textContent = "No more post to load ...";
      }
    },
    error: function (err) {
      console.log(`error is ${err}`);
    },
  });
};

load_btn.addEventListener("click", () => {
  loading.style.display = "block";
  visible += 3;
  getData();
  scrollPage();
});
getData();

// scrolling after clicking load more button
var scrollAmount = 820;
function scrollPage() {
  var currentPositionOfPage = window.scrollY;
  window.scrollTo(0, currentPositionOfPage + scrollAmount);
}

const postForm = document.getElementById("post-form");
const title = document.getElementById("id_title");
const body = document.getElementById("id_body");
const csrf = document.getElementsByName("csrfmiddlewaretoken");
const url = window.location.href;

const deleted = localStorage.getItem("title");
if (deleted) {
  handlealerts("added", `"${deleted}" was deleted !`);
  localStorage.clear();
}

// adding post with ajax
$(document).on("submit", "#post-form", function (e) {
  e.preventDefault();
  $.ajax({
    type: "POST",
    url: "",
    data: {
      csrfmiddlewaretoken: csrf[0].value,
      title: title.value,
      body: body.value,
    },
    success: function (res) {
      console.log(res);
      hello.insertAdjacentHTML(
        "afterbegin",
        `
        <div class="card mt-2">
        <div class="card-body d-flex ">
          <span>
          <a class="author" href="${url}${res.author}">
             <img  src="${res.avatar}" class="rounded-circle " width="45" /> 
             
    
             </a>
           </span>
         <div class="mx-3">
          <a class="author" href="${url}${res.author}">${res.author}</a> </br>
             ${res.title} 
             <p> ${res.body}</p>
         </div>
     </div>
     <div class ="card-footer">
         <div class="d-flex">
             <a href="${url}${res.id}" class="cmnt-post">Detail</a>
             <form class="like-unlike-forms" data-form-id="${res.id}">
                 <button class="loadmore mx-2" id="like-unlike-${res.id}">0 Like</button> 
             </form>

             <form class="save-forms" data-save-id="${res.id}">
                          <button  class="savepost mx-2" id="save-${res.id}" >Save Post</button> 
                    </form>

       
         </div>
     </div>
    </div>




        `
      );

      postForm.reset();
      likeUnlikePosts();
      saveUnsaveForms();
      handlealerts("added", "Added Post");
      $("#addPostModal").modal("hide");
    },
    error: function (err) {
      console.log(err);
      handlealerts("failed", "Oops !something went wrong !");
      $("#addPostModal").modal("hide");
    },
  });
});

// search

const searchinput = document.getElementById("searchinput");

const resultdiv = document.getElementById("resultdiv");
const searchform = document.getElementById("searchform");

const sendSearchData = (search) => {
  $.ajax({
    type: "POST",
    url: "search/",
    data: {
      csrfmiddlewaretoken: csrf[0].value,
      search: search,
    },
    success: function (res) {
      console.log(res.search);
      const data = res.search;

      if (Array.isArray(data)) {
        resultdiv.innerHTML = "";
        data.forEach((el) => {
          resultdiv.innerHTML += `

                        <div class="search-result mt-2">
                        <div class="card-body d-flex ">
                            <span>
                            <a class="author" href="/${el.author}">
                            <img src="${el.avatar}" class="rounded-circle infoimg" /> 
                            </a>
                             </span>
                             <a href="/${el.id}">
                           <div class="mx-3">
                           <span class="author" >${el.author}</span> </br>
                           <span class="text-white" > ${el.title}</span>
                               <p class="text-white"> ${el.body}</p>
                       </div>  
                       </a>
                   </div>
                 
               </div>


                `;
        });
      } else {
        if (searchinput.value.length > 0) {
          resultdiv.innerHTML = `${data}`;
        } else {
          resultdiv.classList.add("not-visible");
        }
      }
    },
    error: function (err) {
      console.log(err);
    },
  });
};

searchinput.addEventListener("keyup", function (e) {
  e.preventDefault();

  if (resultdiv.classList.contains("not-visible")) {
    resultdiv.classList.remove("not-visible");
  }
  sendSearchData(e.target.value);
});

// disapper search result when clicked outside
const objRef = document.body;

objRef.addEventListener("click", () => {
  resultdiv.classList.add("not-visible");
  searchinput.value = "";
});
// disapper search result when clicked outside
