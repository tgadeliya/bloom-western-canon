import json

# Load your JSON data
with open('books_data.json', encoding='utf-8') as f:
    data = json.load(f)

html_content = """
<!DOCTYPE html>
<html lang=\"ru\">
<head>
    <meta charset=\"UTF-8\">
    <title>Books Collection</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
        }
        details {
            margin-left: 20px;
            margin-bottom: 10px;
        }
        summary {
            font-weight: bold;
            cursor: pointer;
        }
        ul {
            margin-left: 20px;
            list-style-type: disc;
        }
    </style>
</head>
<body>
    <h1>Книжная коллекция</h1>
"""

for epoch, countries in data.items():
    html_content += f'<details>\n  <summary>{epoch}</summary>\n'

    for country, content in countries.items():
        html_content += f'  <details>\n    <summary>{country}</summary>\n'

        if content["books"]:
            html_content += '    <ul>\n'
            for book in content["books"]:
                html_content += f'      <li>{book}</li>\n'
            html_content += '    </ul>\n'

        for author, books in content["authors"].items():
            html_content += f'    <details>\n      <summary>{author}</summary>\n      <ul>\n'
            for book in books:
                html_content += f'        <li>{book}</li>\n'
            html_content += '      </ul>\n    </details>\n'

        html_content += '  </details>\n'

    html_content += '</details>\n'

html_content += """
</body>
</html>
"""

# Save to HTML file
with open('books_collection.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("HTML file generated: books_collection.html")
