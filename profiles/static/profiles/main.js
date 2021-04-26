url = window.location.href + "follow_unfollow/"
const csrf = document.getElementsByName('csrfmiddlewaretoken')

const togglefollow = document.getElementById("toggle_follow")
const togglebtn = document.getElementById("toggle_btn")
const followers = document.getElementById("followers")
const following = document.getElementById("following")

console.log(togglefollow)


 

    $(document).on('submit','#toggle_follow',function(e){
    e.preventDefault()
    
    console.log('submited')
    $.ajax({
        type:'POST',
        url:url,
        data:{
            'csrfmiddlewaretoken':csrf[0].value,
            // 'profile_pk':'bishal'
        },
        success:function(res){
            console.log(res)
            togglebtn.textContent= `${res.follow?` Unfollow `:' Follow '}`
            if(res.follow){
                handlealerts('added','Successfully Followed!')
             }
             else{
                handlealerts('failed','Successfully unfollowed!')
             }
             followers.textContent = `${res.followers}`
        },
        error:function(err){
            console.log(err)
        }
    })
})

