const usernameSuccessOutput = document.querySelector(".usernameSuccessOutput");
const feedBackArea = document.querySelector(".invalid_feedback");
const registerbtn = document.querySelector("#registerbtn");
const id_username = document.querySelector("#id_username");

id_username.addEventListener("keyup", function (e) {
  const name = e.target.value;
  usernameSuccessOutput.style.display = "block";

  id_username.classList.remove("is-invalid");
  feedBackArea.style.display = "none";
  //when typing calls ajax function
  if (name.length > 0) {
    fetch("/auth/validate_username", {
      body: JSON.stringify({ username: name }),
      method: "POST",
      headers: { "X-CSRFToken": csrftoken },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        usernameSuccessOutput.style.display = "none";
        if (data.username_error) {
          id_username.classList.add("is-invalid");
          feedBackArea.style.display = "block";
          feedBackArea.innerHTML = `<p>X ${data.username_error}</p>`;
          registerbtn.disabled = true;
        } else {
          registerbtn.removeAttribute("disabled");
          id_username.classList.add("is-valid");
        }
      });
  }

  // // catch the form's submit event
  // $('#id_username').keyup(function () {
  //     // create an AJAX call
  //     $.ajax({
  //         data: $(this).serialize(), // get the form data
  //         url: "{% url 'validate_username' %}",
  //         // on success
  //         success: function (response) {
  //             if (response.is_taken == true) {
  //                 $('#id_username').removeClass('is-valid').addClass('is-invalid');
  //                 $('#id_username').after('<div class="invalid-feedback d-block" id="usernameError">This username is already taken!</div>')
  //             }
  //             else {
  //                 $('#id_username').removeClass('is-invalid').addClass('is-valid');
  //                 $('#usernameError').remove();

  //             }

  //         },
  //         // on error
  //         error: function (response) {
  //             // alert the error if any error occured
  //             console.log(response.responseJSON.errors)
  //         }
  //     });

  //     return false;
  // });
});
