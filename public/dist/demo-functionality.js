const $=window.$;$(document).ready(function(){let t=function(t,e){let n="";return n+="<div>",n+='<p class="grateful-meta">'+moment(t.date).format("dddd, MMMM Do YYYY")+"</p>",n+="<ul>",n+='<li class="grateful-entry">'+t.gratefuls+"</li>",n+="</ul>",n+='<button class="edit-button" value="'+t._id+'"><span class="fa fa-plus"></span>edit</button>',n+='<button class="delete-button" value="'+t._id+'"><span class="fa fa-times"></span>delete</button>',n+="</div>"};demoData.forEach((e,n)=>{$(".entries").append(t(e))}),$(".entry-button").on("click",function(e){if(e.preventDefault(),$("#first-grateful").val().trim().length<1)return void swal("Please write an entry...\n\n٩(●ᴗ●)۶");let n=[];$("textarea").each((t,e)=>{n.push($(e).val())});let a={gratefuls:n,name:"jon",authorId:"id"};$(".entries").prepend(t(a)),$(".gratefuls").html('<textarea id="first-grateful"></textarea>')}),$("body").on("click",".delete-button",function(t){let e=$(this).parent();swal({text:"Are you sure?\n\n⁀⊙﹏☉⁀",buttons:[!0,"delete"],dangerMode:!0}).then(t=>{t&&e.remove()})});$("body").on("click",".edit-button",function(t){t.preventDefault();let e='<form class="edited-entry"><div class="gratefuls-edited"><textarea id="first-grateful" class="small-textarea" cols="37" wrap="hard">'+$(this).siblings("ul").text()+'</textarea></div><button class="save-edit-button submit-button" type="submit"><span class="fa fa-check"></span>save</button><button class="cancel-button submit-button" type="submit"><span class="fa fa-ban"></span>cancel</button></form>';$(this).siblings("ul").addClass("hidden"),$(this).siblings("button").addClass("hidden"),$(this).addClass("hidden"),$(this).parent("div").append(e)});$("body").on("click",".cancel-button",function(t){t.preventDefault(),$(this).parents("form").siblings(".hidden").removeClass("hidden"),$(this).closest("form").remove()});$("body").on("click",".save-edit-button",function(t){t.preventDefault();let e=$(".gratefuls-edited").children().val();$(this).parents("form").siblings("ul").html('<li class="grateful-entry">'+e+"</li>"),$(this).parents("form").siblings(".hidden").removeClass("hidden"),$(this).closest("form").remove()});$("nav").on("click",".logout-button",function(){window.location.href="/landing.html"})});