import bocco
import uuid
import sys
import datetime

def main():

    #room_idの設定(APIの仕様上、uuid.UUID型じゃないとエラーが発生する。)
    room_id = uuid.UUID('73624ea6-0c94-4f32-bfd5-8806c5497145')
    #トークンの設定
    token = '6a37258fe6ccc3748313a30552720dd3a29ce3762202d4d09bbf41810f02b701'
    
    #APIの起動
    api = bocco.api.Client(token)

    message = "ただいまの時刻は、"+ str(datetime.datetime.now().strftime('%Y年%m月%d日 %H:%M:%S') + "です。")
    #messageをpostする。
    api.post_text_message(room_id, message)
    
    print("finished sending the following message : "+ message)
    sys.exit(0)

if __name__== '__main__':
    main()

