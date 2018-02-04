const $ = window.$

$(document).ready(function() {
  // check if localstorage contains token and if token exists call the get all the entries by user
  // otherwise send user to landing page (not login?)

//const baseUrl = 'http://localhost:8080'
const baseUrl = 'https://stormy-scrubland-44609.herokuapp.com'

  function redirects() {
    if (localStorage.getItem('token')) {
      if (window.location.pathname === '/index.html') {
        $.ajax({
          type: 'GET',
          url: baseUrl + '/entries/searchByUser/' + localStorage.getItem('userId'),
          contentType: 'application/JSON',
          headers: {
            'Authorization': localStorage.getItem('token')
          },
          success: function(results) {
            if (results.length > 1) {
              $('.entries-header').removeClass('hidden')
            }
            results.forEach((element, index) => {
              $('.entries').append(createEntryHtml(element, index))
            })
          },

          error: function(err) {
            swal(
              'Something went wrong getting entries!\n\n(ó﹏ò｡)'
            )
          }
        })
      } else {
        window.location.href = 'index.html'
      }
    } else if (window.location.pathname === '/index.html') {
      window.location.href = 'landing.html'
    } else if (window.location.pathname === '/') {
      window.location.href = 'landing.html'
    }
  }

  redirects()

  let createEntryHtml = function(element, index) {
    let html = ''
    html += '<div>'
    let normalDate = new Date(element.date)
    html += '<p class="grateful-meta">' + moment(normalDate).format('dddd, MMMM Do YYYY') + '</p>'
    html += '<ul>'
    html += '<li class="grateful-entry">' + element.gratefuls + '</li>'
    html += '</ul>'
    html += '<button class="edit-button" value="' + element._id + '"><span class="fa fa-plus"></span>edit</button>'
    html += '<button class="delete-button" value="' + element._id + '"><span class="fa fa-times"></span>delete</button>'
    html += '</div>'
    return html
  }

  $('body').on('click', '.delete-button', function(event) {
    let entryToDelete = $(this).parent()

    swal({
        text: 'Are you sure?\n\n⁀⊙﹏☉⁀',
        buttons: [true, 'delete'],
        dangerMode: true
      })
      .then((willDelete) => {
        if (willDelete) {
          $.ajax({
            type: 'DELETE',
            url: baseUrl + '/entries/delete/' + $(this).val(),
            contentType: 'application/JSON',
            headers: {
              'Authorization': localStorage.getItem('token')
            }, // anytime we call we have to send header with token
            success: function(obj) {
              entryToDelete.remove()
            },

            error: function(err) {
              console.log(err)
              swal(
                'Something went wrong deleting!\n\n(ó﹏ò｡)'
              )
            }
          })
        }
      })
  })

  $('.entry-button').on('click', function(event) {
    event.preventDefault()
    if ($('#first-grateful').val().trim().length < 1) {
      swal('Please write an entry...\n\n٩(●ᴗ●)۶')
      return
    }
    let textareas = $('textarea')
    let gratefuls = []
    let username = 'help'

    textareas.each((index, element) => {
      gratefuls.push($(element).val())
    })
    let obj = {
      gratefuls: gratefuls,
      name: username,
      authorId: localStorage.getItem('userId')
    }

    $.ajax({
      type: 'POST',
      url: baseUrl + '/entries',
      data: JSON.stringify(obj),
      contentType: 'application/JSON',
      headers: {
        'Authorization': localStorage.getItem('token')
      },
      success: function(res) {
        $('.entries-header').removeClass('hidden')
        $('.entries').prepend(createEntryHtml(res.data, '-'))
        $('.gratefuls').html('<textarea id="first-grateful"></textarea>')
      },
      error: function(err) {
        console.log(err)
        swal(
          ' Something went wrong with saving entries!\n\nç(ó﹏ò｡)'
        )
      }
    })
  })

  function registerLogin() {
    $('.login-container form').submit(function(event) {
      event.preventDefault()

      let username = $(this).find('.js-login').val()
      let password = $(this).find('.js-login-password').val()
      let date = moment().format('ddd, MMM Do YYYY')
      var obj = {
        username,
        password,
        date
      }

      $.ajax({
        type: 'POST',
        url: baseUrl + '/auth/login',
        data: JSON.stringify(obj),
        contentType: 'application/JSON',
        success: function(res) {
          localStorage.setItem('token', res.token)
          localStorage.setItem('userId', res.userId)
          window.location.href = '/index.html'
        },
        error: function(err) {
          console.log(err)
          swal(
            'Username and/or password is wrong\n\n(ó﹏ò｡)'
          )
        }
      })
    })
  }

  registerLogin()

  function logout() {
    $('nav').on('click', '.logout-button', function() {
      localStorage.clear()
      window.location.href = '/login.html'
    })
  }

  logout()

  function registerSignUp() {
    $('.signup-container form').submit(function(event) {
      event.preventDefault()

      let username = $(this).find('.js-username').val()
      let password = $(this).find('.js-password').val()
      let date = moment().format('ddd, MMM Do YYYY')
      var obj = {
        username,
        password,
        date
      }



      $.ajax({
        type: 'POST',
        url: baseUrl + '/auth/register',
        data: JSON.stringify(obj),
        contentType: 'application/JSON',
        success: function(obj) {
          swal("Your account has been created!\n\nPlease log in\n\n｡^‿^｡", {
            buttons: false,
            timer: 2500,
          })
          setTimeout(function() {
            window.location.href = '/login.html'
          }, 2500)
        },
        error: function(err) {
          console.log(err)
          swal(
            ' Username already exists\n\n(ó﹏ò｡)'
          )
        }
      })
    })
  }

  registerSignUp()

  function editEntry() {
    $('body').on('click', '.edit-button', function(event) {
      event.preventDefault()

      let entryToEdit = $(this).siblings('ul').text()

      let textareaHtml = '<form class="edited-entry">' +
        '<div class="gratefuls-edited">' +
        '<textarea id="first-grateful" class="small-textarea" cols="37" wrap="hard">' +
        entryToEdit +
        '</textarea>' +
        '</div>' +
        '<button class="save-edit-button submit-button" type="submit"><span class="fa fa-check"></span>save</button>' +
        '<button class="cancel-button submit-button" type="submit"><span class="fa fa-ban"></span>cancel</button>' +
        '</form>'

      $(this).siblings('ul').addClass('hidden')
      $(this).siblings('button').addClass('hidden')
      $(this).addClass('hidden')

      $(this).parent('div').append(textareaHtml)
    })
  }

  editEntry()

  function saveEdit(obj, id) {
    $.ajax({
      type: 'PUT',
      url: baseUrl + '/entries/' + id,
      data: JSON.stringify(obj),
      contentType: 'application/JSON',
      headers: {
        'Authorization': localStorage.getItem('token')
      },
      success: function(res) {
        // TODO: On success what?
      },
      error: function(err) {
        console.log(err)
        swal(
          ' Something went wrong with editing entry!\n\n(ó﹏ò｡)'
        )
      }
    })
  }

  function saveEdited() {
    $('body').on('click', '.save-edit-button', function(event) {
      event.preventDefault()
      let text = $('.gratefuls-edited').children().val()
      let id = $(this).parents('form').siblings('.delete-button').attr('value')
      let obj = {
        gratefuls: text
      }
      $(this).parents('form').siblings('ul').html('<li class="grateful-entry">' + text + '</li>')
      $(this).parents('form').siblings('.hidden').removeClass('hidden')
      $(this).closest('form').remove()

      saveEdit(obj, id)
    })
  }

  saveEdited()

  function cancelEdit() {
    $('body').on('click', '.cancel-button', function(event) {
      event.preventDefault()
      $(this).parents('form').siblings('.hidden').removeClass('hidden')
      $(this).closest('form').remove()
    })
  }

  cancelEdit()

  function signupRedirect() {
    $('body').on('click', '.landing-sign-up', function(event) {
      window.location.href = '/signup.html'
    })
  }

  signupRedirect()

  function demoRedirect() {
    $('body').on('click', '.demo-button', function(event) {
      window.location.href = '/demo.html'
    })
  }

  demoRedirect()

  function loginRedirect() {
    $('body').on('click', '.goto-login-button', function(event) {
      window.location.href = '/login.html'
    })
  }

  loginRedirect()
})
