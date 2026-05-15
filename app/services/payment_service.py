import httpx

#rus central bank exchange rate
async def get_usd_rub_rate() -> float:
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get("https://www.cbr-xml-daily.ru/daily_json.js")
            data = res.json()
            return data["Valute"]["USD"]["Value"]
    except:
        return 90.0