function loadPost(which){
    //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoicmVkIiwiaWF0IjoxNTExMDk5NzIzfQ.V0TLBYlTB6D8x0EHLsshCjTTKP_ilNPnrM6ba_N0dfI"
    let jwt = token();
    $.ajax({
    method: "GET",
    url: "/api/post/"+which,
    error: (e)=>{
        console.log( "post ajax fail", e);
        $("#loadPage").html(e.responseText);
        toast("Error with loading post", "error")
    },
    success: (msg)=>{
        //console.log( "ajaxed post");
        let tagsHTML = ""
        msg.tags.forEach((item, index)=>{
            tagsHTML += `<div class="tag ${item}">${item}</div>`
        })
        let htmlPost = `
        <div class="midWrapper">
        
        <div class="post">
            <div class="header">
                <div class="title">${msg.title}</div>
                <div class="author">${msg.author}</div>
            </div>
            <div class="tags">
                ${tagsHTML}
            </div>
            <div class="content">
                <div class="img"><img src="${msg.content.imgLink}"/></div>
                <div class="text">${msg.content.textHtml}</div>
                <div class="link"></div>
                <div class="video"></div>
            </div>
        </div></div>`;
        $("#loadPage").append(htmlPost);
    }});
}