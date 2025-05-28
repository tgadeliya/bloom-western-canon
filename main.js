// main.js

const BOOKS_JSON_PATH = 'books.json';
const READING_LOG_KEY = 'readingLog';

document.addEventListener('DOMContentLoaded', () => {
    displayBooks();
    displayReadingLog();
});

// Helper function to make elements collapsible
function makeCollapsible(titleElement, contentElement, startCollapsed = false) {
    titleElement.classList.add('collapsible-title');
    contentElement.classList.add('collapsible-content');

    // Add an indicator (e.g., an arrow or +/- symbol)
    const indicator = document.createElement('span');
    indicator.classList.add('collapse-indicator');
    indicator.textContent = startCollapsed ? ' ►' : ' ▼'; // ► for collapsed, ▼ for expanded
    titleElement.appendChild(indicator);


    if (startCollapsed) {
        contentElement.classList.add('collapsed');
        titleElement.classList.add('is-collapsed');
    }

    titleElement.addEventListener('click', () => {
        const isCurrentlyCollapsed = contentElement.classList.toggle('collapsed');
        titleElement.classList.toggle('is-collapsed', isCurrentlyCollapsed);
        indicator.textContent = isCurrentlyCollapsed ? ' ►' : ' ▼';
    });
}


async function displayBooks() {
    const bookListContainer = document.getElementById('book-list');
    if (!bookListContainer) {
        console.error('Book list container not found!');
        return;
    }

    try {
        const response = await fetch(BOOKS_JSON_PATH);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const books = await response.json();

        if (!books || books.length === 0) {
            bookListContainer.innerHTML = '<p>No books found in the list.</p>';
            return;
        }

        bookListContainer.innerHTML = ''; // Clear "Loading books..."

        const booksByEpoch = books.reduce((acc, book) => {
            const epoch = book.epoch || 'Uncategorized Epoch';
            acc[epoch] = acc[epoch] || [];
            acc[epoch].push(book);
            return acc;
        }, {});

        for (const epochName in booksByEpoch) {
            const epochGroupElement = document.createElement('div');
            epochGroupElement.classList.add('epoch-group');
            
            const epochTitle = document.createElement('h2');
            epochTitle.textContent = epochName;
            // epochTitle will be the clickable element

            const epochContentContainer = document.createElement('div'); // Container for countries
            // epochContentContainer will be collapsed/expanded

            epochGroupElement.appendChild(epochTitle);
            epochGroupElement.appendChild(epochContentContainer);
            bookListContainer.appendChild(epochGroupElement);

            // Make epoch collapsible (start expanded)
            makeCollapsible(epochTitle, epochContentContainer, false);


            const booksInEpoch = booksByEpoch[epochName];
            const booksByCountry = booksInEpoch.reduce((acc, book) => {
                const country = book.country || 'Uncategorized Country';
                acc[country] = acc[country] || [];
                acc[country].push(book);
                return acc;
            }, {});

            for (const countryName in booksByCountry) {
                const countryGroupElement = document.createElement('div');
                countryGroupElement.classList.add('country-group');

                const countryTitle = document.createElement('h3');
                countryTitle.textContent = ` ${countryName}`;

                const countryContentContainer = document.createElement('div'); // Container for authors

                countryGroupElement.appendChild(countryTitle);
                countryGroupElement.appendChild(countryContentContainer);
                epochContentContainer.appendChild(countryGroupElement); // Add to epoch's content

                // Make country collapsible (start collapsed)
                makeCollapsible(countryTitle, countryContentContainer, true);


                const booksInCountry = booksByCountry[countryName];
                const booksByAuthor = booksInCountry.reduce((acc, book) => {
                    const author = book.author || 'Unknown Author';
                    acc[author] = acc[author] || [];
                    acc[author].push(book);
                    return acc;
                }, {});

                for (const authorName in booksByAuthor) {
                    const authorGroupElement = document.createElement('div');
                    authorGroupElement.classList.add('author-group');

                    const authorTitle = document.createElement('h4');
                    authorTitle.textContent = `${authorName}`;
                    
                    const bookUl = document.createElement('ul'); // This UL will be the collapsible content

                    authorGroupElement.appendChild(authorTitle);
                    authorGroupElement.appendChild(bookUl);
                    countryContentContainer.appendChild(authorGroupElement); // Add to country's content

                    // Make author collapsible (start collapsed)
                    makeCollapsible(authorTitle, bookUl, true);


                    booksByAuthor[authorName].forEach(book => {
                        const bookLi = document.createElement('li');
                        bookLi.classList.add('book-item');
                        if (!book.id) {
                            console.warn('Book missing ID:', book.title);
                            book.id = `fallback-${Math.random().toString(36).substr(2, 9)}`;
                        }
                        bookLi.dataset.bookId = book.id; 

                        let statusDisplay = ' ';
                        if (book.status) {
                            statusDisplay = `<span class="book-status">(${book.status})</span>`;
                        }
                        bookLi.innerHTML = `${book.title} ${statusDisplay}`;
                        
                        bookLi.addEventListener('click', (e) => {
                            // Prevent click from bubbling to collapsible titles if book item itself is clicked
                            e.stopPropagation(); 
                            window.location.href = `review.html?id=${book.id}`;
                        });
                        bookUl.appendChild(bookLi);
                    });
                }
            }
        }

    } catch (error) {
        console.error('Error fetching or displaying books:', error);
        bookListContainer.innerHTML = '<p>Could not load books. Please check the console for errors.</p>';
    }
}

function displayReadingLog() {
    const logContainer = document.getElementById('reading-log');
    if (!logContainer) {
        console.error('Reading log container not found!');
        return;
    }

    const logTitle = logContainer.querySelector('h2') || document.createElement('h2');
    if (!logContainer.querySelector('h2')) {
        logTitle.textContent = 'Reading Log';
        logContainer.insertBefore(logTitle, logContainer.firstChild);
    }
    
    const existingUl = logContainer.querySelector('ul');
    if (existingUl) existingUl.remove();
    const existingP = logContainer.querySelector('p');
    if (existingP) existingP.remove();

    const logData = JSON.parse(localStorage.getItem(READING_LOG_KEY)) || [];

    if (logData.length === 0) {
        const noEntriesP = document.createElement('p');
        noEntriesP.textContent = 'No books logged yet.';
        logContainer.appendChild(noEntriesP);
        return;
    }

    const ul = document.createElement('ul');
    logData.forEach(entry => {
        if (!entry.date || !entry.title || !entry.bookId) {
            console.warn('Skipping malformed log entry:', entry);
            return;
        }
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `review.html?id=${entry.bookId}`;
        link.textContent = entry.title;
        
        li.appendChild(document.createTextNode(`${entry.date}: Read `));
        li.appendChild(link);
        ul.appendChild(li);
    });
    logContainer.appendChild(ul);
}