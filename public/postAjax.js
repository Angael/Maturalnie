var postsOnPage;
postsOnPage =  0;

var perPage;
perPage =  1;

var loadButtonHTML;
loadButtonHTML = loadButtonHTML || '<input id="loadPostsButton" type="button" onclick="loadPosts(postsOnPage, perPage)" value="loadNextPosts"/>';
//loadPosts(0, 2);
if(postsOnPage == 0){
    loadPosts(postsOnPage, perPage);
}
function loadPost(which){ //outdated method
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
        console.log( "ajaxed post");
        let tagsHTML = ""
        msg.tags.forEach((item, index)=>{
            tagsHTML += `<div class="tag ${item}">${item}</div>`
        })
        let htmlPost = `
        <div class="midWrapper">
        <a href="#">
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
        </div></a></div>`;
        $("#loadPage").append(htmlPost);
    }});
}
function loadPosts(from, howMany){
    let jwt = token();
    $.ajax({
    method: "GET",
    url: "/api/post/"+from+"/"+howMany,
    error: (e)=>{
        console.log( "post ajax fail", e);
        $("#loadPage").html(e.responseText);
        toast("Error with loading posts", "error")
    },
    success: (msg)=>{
        postsOnPage += perPage;
        msg.forEach( (item, index)=>{
            let tagsHTML = ""
            item.tags.forEach((itemm, index)=>{
                tagsHTML += `<div class="tag ${itemm}">${itemm}</div>`
            })
            console.log('index', index);
            console.log('from', from);
            let htmlPost = `
            <div class="midWrapper">
            <a href="javascript:loadPage('/post/num/${from+index}')">
            <div class="post">
                <div class="header">
                    <div class="title">${item.title}</div>
                    <div class="author">${item.author}</div>
                </div>
                <div class="tags">
                    ${tagsHTML}
                </div>
                <div class="content">
                    <div class="img"><img src="${item.content.imgLink}"/></div>
                    <div class="text">${item.content.textHtml}</div>
                    <div class="link"></div>
                    <div class="video"></div>
                </div>
            </div></a></div>`;
            $("#loadPage").append(htmlPost);
        })
        $("#loadPostsButton").remove();
        $("#loadPage").append(loadButtonHTML);
    }});
}

