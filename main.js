var lastPage = "home";
function onNavClick(e)
{
  const id = e.id ? e.id : e;
  const pageToLoad = `/pages/${id}.html`;

  $("#content").load(pageToLoad);
  scroll(0,0);

  $(`#${lastPage}`).removeClass("active");
  $(`#${id}`).addClass("active");

  lastPage = id;
}

function onLoad()
{
  onNavClick({id: "home"});
}     