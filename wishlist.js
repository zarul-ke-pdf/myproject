// Display wishlist items
function viewWishList() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistContainer = document.getElementById('wishlistItems');
    wishlistContainer.innerHTML = ""; 

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = "Your wishlist is empty.";
        return;
    }

    wishlist.forEach(item => {
        const wishlistItemDiv = document.createElement('div');
        wishlistItemDiv.classList.add('wishlist-item');
        
        wishlistItemDiv.innerHTML = `
            <img src="${item.imageLink}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p><strong>Brand:</strong> ${item.brand}</p>
            <p><strong>Price:</strong> $${item.price}</p>
            <a href="${item.productLink}" target="_blank">View Product</a>
            <button class="delete-btn" onclick="deleteFromWishlist(${item.id})">remove</button>
        `;
        
        wishlistContainer.appendChild(wishlistItemDiv);
    });
}
function deleteFromWishlist(id) {
    // Get the current wishlist from local storage
    const wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];

    // Find the index of the item to remove
    const index = wishlistItems.findIndex(item => item.id === id);

    // If item is found, remove it from the wishlist
    if (index !== -1) {
        wishlistItems.splice(index, 1); // Remove the item at the specified index
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems)); // Update local storage
        viewWishList(); // Refresh the wishlist display
    }
}
function updateItemPriority(id, newPriority) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const item = wishlist.find(item => item.id === id);

    if (item) {
        item.priority = newPriority; // Update priority
        localStorage.setItem('wishlist', JSON.stringify(wishlist)); // Save changes to local storage
        viewWishList(); // Refresh the wishlist display
    }
}



document.addEventListener('DOMContentLoaded', viewWishList);
