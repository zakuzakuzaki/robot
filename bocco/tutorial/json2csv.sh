cat room.json |jq -r '.[]|[.created_at, .illuminance, .temperature, .humidoty]|@csv'
