/** BOCCO へのアクセスAPI
*/
var BOCCO = function(){
	this.request = require('request');
	this.uuid = require('node-uuid');
	this.superagent = require('superagent');
	this.speech = require('google-speech-api');

    //ルームID
    this.room_id = "73624ea6-0c94-4f32-bfd5-8806c5497145";

    //ユーザーアクセストークン
    this.access_token = "6a37258fe6ccc3748313a30552720dd3a29ce3762202d4d09bbf41810f02b701";
    
    //BOSSOサーバAPI
	this.API_SERVER_HOST = "https://api.bocco.me/1/rooms/{room_id}/messages";
	
	//受信済みのオーディオID
	this.oldMediaAudioID = -1;
	
    /** ルームIDを設定する
     *
     * @param room_id 設定したいルームID
     *
     */
    this.setRoomId = function(room_id){
        this.room_id = room_id;
        return this;
    }
    
    /** ユーザー アクセストークンを設定する
     *
     * @param access_token 設定したいユーザー アクセストークン
     *
     */
    this.setAccessToken = function(access_token){
        this.access_token = access_token;
        return this;
    }
    
	/** 既存のメッセージの取得
     *
     * @param callback コールバック ファンクション
     *
     */
	this.getMessages = function(callback){
		var url = this.API_SERVER_HOST.replace("{room_id}",this.room_id)
					+"?access_token="+this.access_token;
		//console.log( url );
		this.request.get(url, function(err, resp, body){
			//ここでコールバックする
    		callback( JSON.parse(body) );  
		});
	};
	
　　 /** メッセージの送信
     *
     * @param text 送信メッセージ
     * @param callback コールバック ファンクション
     *
     */
	this.postMessageText = function(text,callback){
		var unique_id = this.uuid.v1();
		var url = this.API_SERVER_HOST.replace("{room_id}",this.room_id);
		var op = {'access_token':this.access_token,'media':'text','text':text,'unique_id':unique_id};

		var options = {
  			url: url,
  			headers: {'Accept-Language':'ja-JP'},
 	 		formData:op
		};
		
		this.request.post(options,function(err, resp, body){
			//ここでコールバックする
    		callback( JSON.parse(body) );
		});
	};
	
	/** 音声メディアの取得
     *
     * @param callback コールバック ファンクション
     *
     */
	this.getMessageMediaAudio = function(callback){
		var _this = this;
		var fnc = function(){
			// console.log("cron");
			_this._getMessageMediaAudio(_this,callback);
		};
		
		//定期的に実行する
		setInterval(fnc,2*1000);
	}
	
	this._getMessageMediaAudio = function(self,callback){
		var url = self.API_SERVER_HOST.replace("{room_id}",this.room_id)
					+"?access_token="+self.access_token;
							
		this.request.get(url, function(err, resp, body){
			var allJson = JSON.parse(body);
			var json = allJson[allJson.length-1];
			//console.log( json );			
			//最新のメディアタイプが audio だったら取得成功
			if((json.media == 'audio') && (self.oldMediaAudioID != json.id)){
				console.log("audio:"+json.audio);				
				//ここでコールバックする
    			callback( {id:json.id,'audio':json.audio} );
    			
    			//コールバック済みのオーディオIDを保存
    			self.oldMediaAudioID = json.id;    			
			}
		});
	};
	
	/** google-speech-apiの戻り値の1件目のデータを取得する
	*
	* @return { transcript: 'タイマー', confidence: 0.95207101 }
	*/
	this.getConvText = function(results){
    	var result = results[0].result;
    	var alternative = result[0].alternative;
    	var ret = alternative[0];
    	return ret;
	};
	
	/** google-speech-apiの戻り値の1件目のデータを取得する
	*
	* @param url BOCCOで録音したWAVファイルのURL
	* @param key google-api-key
	* @param callback コールバック ファンクション	
	*
	* @return { transcript: 'タイマー', confidence: 0.95207101 }
	*/
	this.wav2text = function(url,key,callback) {
		var opts = {key:key,lang:'ja',filetype:'wav',sampleRate:8000};		
		var _this = this;
		this.superagent
  			.get(url)
  			.pipe(_this.speech(opts, function (err, results) {
    			//Google speech で音声からテキストに変換する
				var ret = _this.getConvText( results );
				var text = ret.transcript;
				callback( text );
  		}));
	};
};

module.exports = new BOCCO();
module.exports.create = function (roomId, accessToken) {
  var bocco = new BOCCO();
  return bocco
    .setRoomId(roomId)
    .setAccessToken(accessToken);
};
