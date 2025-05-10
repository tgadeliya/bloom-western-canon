import json

data = json.load(open("books_data.json"))

new_data = []
c = 0
for epoch, v in data.items():
    for country, vv in v.items():
        for author, books in vv["authors"].items():
            for book in books:
                entry = {
                    "title": book,
                    "author": "Неизвестен" if author == "unknown" else author,
                    "epoch": epoch,
                    "country": country,
                    "id": str(c)
                }
                c+= 1
                new_data.append(entry)    

with open("books.json", "w", encoding="utf-8") as f:
    json.dump(new_data,f,indent=4, ensure_ascii=False)