curl -i "https://api.bocco.me/alpha/rooms/73624ea6-0c94-4f32-bfd5-8806c5497145/messages" \
    -d "access_token=6a37258fe6ccc3748313a30552720dd3a29ce3762202d4d09bbf41810f02b701" \
    -d "unique_id=`uuidgen`" \
    -d "media=text" \
    -d "text=こんにちはBOCCO！" \
    -H "Accept-Language: ja"
