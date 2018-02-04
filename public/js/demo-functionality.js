const $ = window.$

$(document).ready(function () {
  let createEntryHtml = function (element, index) {
    let html = ''
    html += '<div>'
    html += '<p class="grateful-meta">' + moment(element.date).format('dddd, MMMM Do YYYY') + '</p>'
    html += '<ul>'
    html += '<li class="grateful-entry">' + element.gratefuls + '</li>'
    html += '</ul>'
    html += '<button class="edit-button" value="' + element._id + '"><span class="fa fa-plus"></span>edit</button>'
    html += '<button class="delete-button" value="' + element._id + '"><span class="fa fa-times"></span>delete</button>'
    html += '</div>'
    return html
  }

  demoData.forEach((element, index) => {
    $('.entries').append(createEntryHtml(element, index))
  })

  $('.entry-button').on('click', function (event) {
    event.preventDefault()
    if ($('#first-grateful').val().trim().length < 1) {
      swal('Please write an entry...\n\n٩(●ᴗ●)۶')
      return
    }
    let textareas = $('textarea')
    let gratefuls = []
    textareas.each((index, element) => {
      gratefuls.push($(element).val())
    })
    let obj = {
      gratefuls: gratefuls,
      name: 'jon',
      authorId: 'id'
    }
    $('.entries').prepend(createEntryHtml(obj, '-'))
    $('.gratefuls').html('<textarea id="first-grateful"></textarea>')
  })

  $('body').on('click', '.delete-button', function (event) {
    let entryToDelete = $(this).parent()

    swal({
      text: 'Are you sure?\n\n⁀⊙﹏☉⁀',
      buttons: [true, 'delete'],
      dangerMode: true
    })
      .then((willDelete) => {
        if (willDelete) {
          entryToDelete.remove()
        }
      })
  })

  function editEntry () {
    $('body').on('click', '.edit-button', function (event) {
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

  function cancelEdit () {
    $('body').on('click', '.cancel-button', function (event) {
      event.preventDefault()
      $(this).parents('form').siblings('.hidden').removeClass('hidden')
      $(this).closest('form').remove()
    })
  }

  cancelEdit()

  function saveEdited () {
    $('body').on('click', '.save-edit-button', function (event) {
      event.preventDefault()
      let text = $('.gratefuls-edited').children().val()

      $(this).parents('form').siblings('ul').html('<li class="grateful-entry">' + text + '</li>')
      $(this).parents('form').siblings('.hidden').removeClass('hidden')
      $(this).closest('form').remove()
    })
  }

  saveEdited()

  function logout () {
    $('nav').on('click', '.logout-button', function () {
      window.location.href = '/landing.html'
    })
  }

  logout()
})
