var tagArray; //tagSystem.js will be possibly loaded multiple times so prevent reinitialization 
tagArray = tagArray || ["Polski"];

function addTag(){
    let name = $("#tagNameAdd").val().capitalize();
    if(tagArray.indexOf(name) === -1 && name.length > 1){
        tagArray.push(name);
    }
    renderTags();
    
}
function removeTag(a=null){
    let name;
    if(a){
        name = a;
    }else{
        name = $("#tagNameRemove").val().capitalize();
    }
    var index = tagArray.indexOf(name);
    if (index > -1) {
        tagArray.splice(index, 1);
    }
    renderTags();
}
function renderTags(){
    let tagHtml = "";
    tagArray.forEach((ar, val, index)=>{
        tagHtml += `<div class="tag" onclick="removeTag('${ar}')">${ar}</div>`;
    })
    
    $(".tags").html(tagHtml);
}
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}
renderTags();