function loadPost(){
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

