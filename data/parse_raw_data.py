from bs4 import BeautifulSoup
import json 
from pprint import pprint

html = open("raw_html_copy.html")
soup = BeautifulSoup(html, 'html.parser')
data = {}

current_epoch = None
current_country = None
current_author = None

for tag in soup.find_all(['h3', 'h5', 'p']):
    if tag.name == 'h3' and 'book' in tag.get('class', []):
        current_epoch = tag.get_text(strip=True)
        data[current_epoch] = {}
        current_country = None
        current_author = None
    elif tag.name == 'h5' and 'book' in tag.get('class', []):
        current_country = tag.get_text(strip=True)
        data[current_epoch][current_country] = {"authors": {}, "books": []}
        current_author = None
    elif tag.name == 'p':
        bold = tag.find('b')
        if bold:
            current_author = bold.get_text(strip=True)
            data[current_epoch][current_country]["authors"][current_author] = []
        else:
            book = tag.get_text(strip=True)
            if current_author:
                data[current_epoch][current_country]["authors"][current_author].append(book)
            else:
                data[current_epoch][current_country]["books"].append(book)

# Save to JSON
with open('books_data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

# Preview the JSON data
print(json.dumps(data, ensure_ascii=False, indent=4))