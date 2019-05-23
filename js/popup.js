
// Set popup size by 2.5 / of the screen
$('body').css('width', `${screen.width/2.5}`);

$(document).ready(function() {
    getAuth();
    $("#save").click(saveUrl);
    $("#home").click(moveUrl);
    $("#addCategory").click(moveUrl);  
});

const api_url = 'http://15.164.26.183:3000/';
const api_crawling = 'api/crawling/save';

function getAuth(){
    $.ajax({
        url : api_url+'api/accounts/auth',
        type : 'POST',
        success : ((data)=> {
            email = data.email;
            getCategories(email);
        }),
        error : ((data)=> {
            window.open(api_url,'_blank');
        }),
    });
}

function getCategories(email){
    $.ajax({
        url : api_url+'api/categories?email='+email,
        type: 'GET',
        success : ((data)=>{
            for(let i=0; i<data.length; i++) {
                $("#select-category").append('<option value="'+data[i].id+'">'+data[i].name+'</option>')
            }
        })
    })
}

function moveUrl(){
    window.open("http://15.164.26.183:3000",'_blank');
}

function saveUrl(){

    let recentUrl = '';
    let categoryId = $('#select-category option:selected').val();
    if(categoryId === ""){
        $("#title").html("<span class='replace-text'>카테고리를 선택해주세요</span>");
    } else {
        chrome.tabs.query({active: true,lastFocusedWindow: true}, ((tabs)=>{
            let tab = tabs[0];
            recentUrl = tab.url;
            $.ajax({
                url : api_url+api_crawling,
                type : 'POST',
                data : {
                    "url" : recentUrl,
                    "categoryId" : categoryId
                },
                dataType: "text",
                success : ((data)=> {
                    $("#title").html("<span class='replace-text'>저장되었습니다<span class='replace-text'>");
                }),
                error : ((data)=> {
                    $("#title").html("<span class='replace-text'>http, https로 시작하는 url만 가능합니다<span class='replace-text'>");
                }),
            })
        }))
    }
}

