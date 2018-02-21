function postPost(){
    //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoicmVkIiwiaWF0IjoxNTExMDk5NzIzfQ.V0TLBYlTB6D8x0EHLsshCjTTKP_ilNPnrM6ba_N0dfI"
    let jwt = token();
    $.ajax({
    method: "GET",
    url: "/post",
    error: (e)=>{
        console.log( "post ajax fail", e);
        $("#loadPage").html(e.responseText);
        toast("Error with loading this page", "error")
    },
    success: (msg)=>{
        console.log( "ajaxed post");
        let htmlPost = `
        <div class="midWrapper">
        <a href="#">
        <div class="post">
            <div class="header">
                <div class="title">${msg.title}</div>
                <div class="author">${msg.author}</div>
            </div>
            <div class="tags">
                <div class="tag matematyka">matematyka</div>
                <div class="tag polski">polski</div>
                <div class="tag angielski">angielski</div>
                <div class="tag fizyka">fizyka</div>
                <div class="tag chemia">chemia</div>
            </div>
            <div class="content">
                <div class="img"><img src="${msg.content.imgLink}"/></div>
                <div class="text">${msg.content.textHtml}</div>
                <div class="link"></div>
                <div class="video"></div>
            </div>
        </div></a></div>`;
        $("#loadPage").append(htmlPost);
    }});
}

function sendPost(){
    let jwt = token();

    //Check for all forms to have acceptable values
    

    var myobj = { title: `title`, 
    author:"Id",
    tags:["matematyka","polski","angielski","fizyka","chemia"],
    content:{
        hasImg:true,
        imgLocal:false,
        imgLink:"http://via.placeholder.com/1250x650",
        textHtml:`Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula. Ut molestie a, ultricies porta urna. Vestibulum commodo volutpat a, convallis ac, laoreet enim. Phasellus fermentum in, dolor. Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec </div>`,
        link:"it",
        videoLocal:false,
        video:null,
        localFiles:null
    } };

    myobj.title = $(".title").text();
    myobj.tags = tagArray;
    myobj.content.hasImg = $("*[name='hasThumbnail']").get(0).checked
    myobj.content.imgLink = $("#imgLink").val()
    //get html, depending on whether it is in trumbowyg or not
    let TrumbowygOn = $('#scriptMe').trumbowyg('html');
    if(TrumbowygOn){
        myobj.content.textHtml = TrumbowygOn
    }else{
        myobj.content.textHtml = $(".text").html();
    }
    


    $.ajax({
    method: "POST",
    data:{ post:JSON.stringify(myobj) },
    url: "/insertPost",
    headers: {
    Authorization: "Bearer "+ jwt ,
    Insides: true
    },
    error: (e)=>{
        console.log( "error1", e);
        $(".mainContainer").append(e.responseText);
        toast("Error with sending post", "error")
    },
    success: (msg)=>{
        console.log( "Done1");
        $(".mainContainer").append(msg);
        //window.history.pushState(null, null, url);
    }});
}

function formatTags(){
    console.log($(".tags").text());
}
$(()=>{
    let linkForm = $("#imgLink");
    linkForm.on("blur", ()=>{
        $('.img > *').attr("src", linkForm.val())
    })
});