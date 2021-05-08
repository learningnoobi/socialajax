const people = document.getElementById("people")

const findpeople = () => {
    $.ajax({
        type: "GET",
        url: `/list/people`,
        success: function (res) {
            console.log(res.data)
            data = res.data
            data.forEach(el => {
                people.innerHTML += `
                
          
                <div class="d-flex align-items-center">
                    <a href="/${el.name}"><div class="image">
                        <img src="${el.avatar}" class="rounded" width="155" /> </div></a>
                    <div class="ml-3 mx-2 w-100">
                        <a href="/${el.name}" class="author"> <h4 class="mb-0 mt-0">${el.name}</h4></a>
                        <span class="small">${el.bio}</span>
                        <div class="p-2 mt-2 mx-1 bg-primary d-flex justify-content-between rounded text-white stats">
                            <div class="d-flex flex-column"> <span class="articles">Posts</span> <span class="number1">${el.totalpost}</span> </div>
                            <div data-bs-toggle="modal" data-bs-target="#followersModal" class="d-flex flex-column openmodal">

                                <span
                                    class="followers mx-1">Followers</span> <span id="followers-${el.name}" class="number2">${el.followers}</span>
                            </div>
                            <div data-bs-toggle="modal" data-bs-target="#followingModal" class="d-flex flex-column openmodal">
                                <span class="rating">Following</span> <span class="number3">${el.following}</span> </div>

                        </div>

                        <div class="button mt-2 d-flex flex-row align-items-center">
                           

                            <button class="btn btn-sm cmnt-postsm mx-2 w-100">Chat</button>
                            <form class="follow-unfollow-forms" data-follow-id="${el.name}">
                                <button id="toggle_btn-${el.name}" type="submit" class="loadmoresm btn-${el.name}">Follow</button>
                            </form>
                        </div>
                    </div>
                </div>
      
                `
                togglefollow()
            });
        }
    })
}

findpeople()
