
// Set popup size by 2.5 / of the screen
$('body').css('width', `${screen.width/2.5}`);

$(document).ready(function() {
    getAuth();
    $("#save").click(saveUrl);   
});

//const api_url = 'http://15.164.26.183:3000/';
const api_url = 'http://localhost:3000/';
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

function saveUrl(){

    let recentUrl = '';
    let categoryId = $('#select-category option:selected').val();
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
                $("#title").html("완료");
            }),
            error : ((data)=> {
                $("#title").html("실패");
            }),
        })
    }))
}

/*function showLoadingBar() { 
    var maskHeight = $(document).height(); 
    var maskWidth = window.document.body.clientWidth; 
    var mask = "<div id='mask' style='position:absolute; z-index:9000; background-color:#000000; display:none; left:0; top:0;'></div>"; 
    var loadingImg = ''; 
    loadingImg += "<div id='loadingImg' style='position:absolute; left:50%; top:40%; display:none; z-index:10000;'>"; 
    loadingImg += " <img src='loading.gif'/>"; 
    loadingImg += "</div>"; $('body').append(mask).append(loadingImg); 
    $('#mask').css({ 'width' : maskWidth , 'height': maskHeight , 'opacity' : '0.3' }); 
    $('#mask').show(); $('#loadingImg').show(); 
}

function hideLoadingBar() { 
    $('#mask, #loadingImg').hide(); 
    $('#mask, #loadingImg').remove(); 
}*/

