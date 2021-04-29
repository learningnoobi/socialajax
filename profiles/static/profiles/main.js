url = window.location.href + "follow_unfollow/";
const csrf = document.getElementsByName("csrfmiddlewaretoken");
const followers = document.getElementById("followers");
const togglebtn = document.getElementById("toggle_btn");
const following = document.getElementById("following");
const profile_pk = document.getElementById("profile_pk");

$(document).on("click", "#toggle_btn", function (e) {
  e.preventDefault();
  const pk = profile_pk.value;
  $.ajax({
    type: "POST",
    url: "/user/follow_unfollow/",
    data: {
      csrfmiddlewaretoken: csrf[0].value,
      profile_pk: pk,
    },
    success: function (res) {
      console.log(res);
      togglebtn.textContent = `${res.follow ? ` Unfollow ` : " Follow "}`;
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
});
