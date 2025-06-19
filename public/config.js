let manualHost = "http://10.211.55.7:8090"; // 若后端接口与前端不一致，手动修改此url
let host = "";
if(typeof window!='undefined' && window.location){
    host = window.location.protocol + "//" + window.location.host; // 自动获取服务url
}
host = manualHost ? manualHost : host;
const config ={
    'url': host,//后台请求端口
    'urlFilePrefix': host + '/appstore',//后台请求端口
    'title':'软件中心',//浏览器标题
    'host':'localhost',//主机地址
    'port':'8099',    //端口号
    'user_service_url':'http://192.168.6.130:8800/auth/token/loginForApp',
    'redirect_uri':'http://192.168.6.5:8080/dist/%23/index/list',
    'client_id':'yyrjsd',
    'remote_ip':'192.168.121.62',
    'deploy_service_url':'http://192.168.6.126:13001/sceneDeploy?pagetype=appstore',
    'softwareDataUploadCheckType': '.bmp,.gif,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.html,.htm,.txt,.rar,.zip,.gz,.bz2,.tar,.iso,.mp4,.avi,.rmvb,.pdf',
    'softwareUploadCheckType': '.gif,.jpg,.png,.zip,.gz,.rar,.iso,.doc,.xls,.ppt,.docx,.xlsx,.pptx,.wps,.chm,.exe,.mp4,.mp3,.pdf',
    'proveUploadCheckType': '.jpg,.png,.bmp,.jpeg,.pdf',
    'fileLimitSize': {  //文件上传限制大小 单位（MB兆）
        data :  500,//资料大小
    },
    'downloader': true, // 开启下载器
    'serverInfoSwitch': false, //服务信息开关
    'questionGuide': false, //问题导航
    'softwareLogSwitch': true, //软件更新日志|关联关系开关
    'userService': {
        'enable': true, // 统一用户登录开关
    }
}

if(typeof window!='undefined' && window.document){
    window._gconf=config;
}else{
    module.exports = config
}

var appConfig = {};
appConfig.config = config;

exports.config = config
