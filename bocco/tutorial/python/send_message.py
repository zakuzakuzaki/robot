import bocco
import uuid
import sys

def main():

    if not len(sys.argv) == 2:
        print("usage: "+ sys.argv[0] + " (message you wanto send)")
        sys.exit(1)
    message = sys.argv[1]

    #room_idの設定(APIの仕様上、uuid.UUID型じゃないとエラーが発生する。)
    room_id = uuid.UUID('73624ea6-0c94-4f32-bfd5-8806c5497145')
    #トークンの設定
    token = '6a37258fe6ccc3748313a30552720dd3a29ce3762202d4d09bbf41810f02b701'
    
    #apiの起動
    api = bocco.api.Client(token)
    
    #messageをpostする。
    api.post_text_message(room_id, message)
    
    print("finished sending the following message : "+ message)
    sys.exit(0)

if __name__== '__main__':
    main()

