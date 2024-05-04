class Book {
    constructor(id, title, author, borrowedBy, borrowedDate) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.borrowedBy = borrowedBy;
        this.borrowedDate = borrowedDate; // Thêm thuộc tính borrowedDate
    }
}
class Queue {
    constructor() {
        this.items = [];
    }
    enqueue(item) {
        this.items.push(item);
    }
    dequeue() {
        if (this.isEmpty()) {
            return "Underflow";
        }
        return this.items.shift();
    }
    isEmpty() {
        return this.items.length === 0;
    }
}

const libraryQueue = new Queue(); // Thêm hàng đợi cho sách trong thư viện
const borrowedQueue = new Queue(); // Thêm hàng đợi cho sách đã mượn

function addBook() {
    const id = document.getElementById('id').value;
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    
    if (!id || !title || !author) /*Kiểm tra nếu có trường nào trống*/{
        alert('Please fill in all fields.');
        return;
    }
    let idExists = false;
    libraryQueue.items.forEach(book => /*Kiểm tra nếu ID sách đã tồn tại trong thư viện*/ {
        if (book.id === id) {
            idExists = true;
        }
    });
    borrowedQueue.items.forEach(book => /*Kiểm tra nếu ID sách đã tồn tại trong sách đã mượn*/ {
        if (book.id === id) {
            idExists = true;
        }
    });
    if (idExists) {
        alert('A book with the same ID already exists.');
        return;
    }
    
    const newBook = new Book(id, title, author, null);
    libraryQueue.enqueue(newBook);
    displayBooks(libraryQueue.items.concat(borrowedQueue.items)); 
    clearForm();
}

function deleteBook() {
    const id = document.getElementById('id').value;
    if (!id) {
        alert('Please enter the ID of the book to delete.');
        return;
    }

    let deleted = false;
    for (let i = 0; i < libraryQueue.items.length; i++) /*Kiểm tra sách có tồn tại trong thư viện không*/{
        if (libraryQueue.items[i].id === id) /*Kiểm tra ID sách có trùng với ID sách trong thư viện không*/ {
            libraryQueue.items.splice(i, 1);
            deleted = true;
            break;
        }
    }
    if (!deleted) {
        alert('Book not found in the library.');
        return;
    }

    displayBooks(libraryQueue.items.concat(borrowedQueue.items));
    clearForm();
}

function updateBook() {
    const id = document.getElementById('id').value;
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    if (!id || (!title && !author)) {
        alert('Please fill in at least one field (title or author) and provide the book ID.');
        return;
    }
    let bookToUpdate = null;
    for (let i = 0; i < libraryQueue.items.length; i++) /*Kiểm tra sách có tồn tại trong thư viện không*/{
        if (libraryQueue.items[i].id === id) {
            bookToUpdate = libraryQueue.items[i];
            break;
        }
    }
    if (!bookToUpdate) /*Kiểm tra nếu sách không tồn tại trong thư viện*/{
        for (let i = 0; i < borrowedQueue.items.length; i++) {
            if (borrowedQueue.items[i].id === id) {
                bookToUpdate = borrowedQueue.items[i];
                break;
            }
        }
    }
    if (!bookToUpdate) /*Kiểm tra nếu sách không tồn tại trong thư viện hoặc sách đã được mượn*/{
        alert('Book not found in the library or borrowed books.');
        return;
    }
    if (title) {
        bookToUpdate.title = title;
    }
    if (author) {
        bookToUpdate.author = author;
    }
    displayBooks(libraryQueue.items.concat(borrowedQueue.items));
    clearForm();
}

function borrowBook() {
    const id = document.getElementById('id').value;
    if (!id) {
        alert('Please enter the ID of the book to borrow.');
        return;
    }
    const borrowerId = document.getElementById('borrowerId').value; 
    const borrowDate = document.getElementById('borrowDate').value; // Lấy ngày tháng mượn từ trường nhập liệu
    if (!borrowerId || !borrowDate) {
        alert('Please enter borrower ID and borrow date.');
        return;
    }
    let found = false;
    for (let i = 0; i < libraryQueue.items.length; i++) {
        if (libraryQueue.items[i].id === id) {
            found = true;
            const borrowedBook = libraryQueue.items.splice(i, 1)[0];
            borrowedBook.status = 'borrowed';
            borrowedBook.borrowerId = borrowerId; // Gán thông tin người mượn từ trường nhập liệu
            borrowedBook.borrowedDate = borrowDate; // Gán ngày tháng mượn sách từ trường nhập liệu
            borrowedQueue.enqueue(borrowedBook);
            displayBooks(libraryQueue.items.concat(borrowedQueue.items)); 
            clearForm();
            break;
        }
    }
    if (!found) {
        alert('Book not found in the library.');
    }
    // Sau khi mượn sách, reset trường thông tin borrowed date
    document.getElementById('borrowDate').value = '';
}

function returnBook() {
    const id = document.getElementById('id').value;
    if (!id) {
        alert('Please enter the ID of the book to return.');
        return;
    }
    let found = false;
    for (let i = 0; i < borrowedQueue.items.length; i++) {
        if (borrowedQueue.items[i].id === id) {
            found = true;
            const returnedBook = borrowedQueue.items.splice(i, 1)[0];
            returnedBook.status = 'available';
            returnedBook.borrowerId = null; // Reset thông tin người mượn khi trả sách
            returnedBook.borrowedDate = null; // Reset ngày mượn sách khi trả sách
            libraryQueue.enqueue(returnedBook);
            displayBooks(libraryQueue.items.concat(borrowedQueue.items)); 
            clearForm();
            break;
        }
    }
    if (!found) {
        alert('Book not found in the borrowed books.');
    }
}

function searchBooks() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const filteredBooks = [];
    if (searchInput.trim() === '') {
        displayBooks(libraryQueue.items.concat(borrowedQueue.items));
        return;
    }
    libraryQueue.items.forEach(book => {
        if (book.id.toLowerCase().includes(searchInput) || book.title.toLowerCase().includes(searchInput) || book.author.toLowerCase().includes(searchInput)) {
            filteredBooks.push(book);
        }
    });
    borrowedQueue.items.forEach(book => {
        if (book.id.toLowerCase().includes(searchInput) || book.title.toLowerCase().includes(searchInput) || book.author.toLowerCase().includes(searchInput)) {
            filteredBooks.push(book);
        }
    });
    displayBooks(filteredBooks);
}

function displayBooks(books = []) {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';
    
    books.forEach(book => {
        const status = book.status === 'borrowed' ? 'Borrowed' : 'Available';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${status}</td>
            <td>${book.borrowerId || '-'}</td>
            <td>${book.borrowedDate || '-'}</td> 
        `;
        if (book.status === 'borrowed') {
            row.style.backgroundColor = 'pink';
        }
        bookList.appendChild(row);
    });
}


function clearForm() {
    document.getElementById('id').value = '';
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('borrowerId').value = '';
}