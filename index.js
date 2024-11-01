// Fetch product data and display it
function buttonClicked() {
    const brand = document.getElementById('beauty_input').value.trim();

    fetch(`https://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const productContainer = document.getElementById('productContainer');
            productContainer.innerHTML = ""; // Clear previous results

            if (data.length === 0) {
                productContainer.innerHTML = "No products found for this brand.";
                return;
            }

            data.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');

                productDiv.innerHTML = `
                    <h3>${product.name}</h3>
                    <p><strong>Brand:</strong> ${product.brand}</p>
                    <p><strong>Price:</strong> $${product.price || 'N/A'}</p>
                    <img src="${product.image_link}" alt="${product.name}">
                    <p><strong>Description:</strong> ${product.description || 'N/A'}</p>
                    <p><strong>Rating:</strong> ${product.rating || 'N/A'}</p>
                    <p><strong>Type:</strong> ${product.product_type || 'N/A'}</p>
                    <a href="${product.product_link}" target="_blank">View Product</a>
                `;

                const addToWishlistBtn = document.createElement('button');
                addToWishlistBtn.innerText = "Add to Wishlist";
                addToWishlistBtn.onclick = () => addToWishlist(product);
                productDiv.appendChild(addToWishlistBtn);

                productContainer.appendChild(productDiv);
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            document.getElementById('productContainer').innerHTML = "Error fetching data. Please try again.";
        });
}



// Add product to wishlist
function addToWishlist(product) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const isAlreadyInWishlist = wishlist.some(item => item.id === product.id);

    if (!isAlreadyInWishlist) {
        wishlist.push({
            id: product.id,
            brand: product.brand,
            name: product.name,
            price: product.price || 'N/A',
            imageLink: product.image_link,
            productLink: product.product_link
        });
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert(`${product.name} was added to your wishlist.`);
    } else {
        alert(`${product.name} is already in your wishlist.`);
    }
}


// Get personalized recommendations based on favorite brands and price range
function getRecommendations() {
    const favoriteBrands = document.getElementById('brandFilter').value.split(',').map(b => b.trim());
    const minPrice = parseFloat(document.getElementById('min_price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max_price').value) || Infinity;

    fetch(`https://makeup-api.herokuapp.com/api/v1/products.json`)
        .then(response => response.json())
        .then(data => {
            const recommendations = data.filter(product => 
                favoriteBrands.includes(product.brand) && 
                parseFloat(product.price) >= minPrice && parseFloat(product.price) <= maxPrice
            );

            const productContainer = document.getElementById('productContainer');
            productContainer.innerHTML = ""; // Clear previous results

            if (recommendations.length === 0) {
                productContainer.innerHTML = "No recommendations found.";
                return;
            }

            recommendations.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');

                productDiv.innerHTML = `
                    <h3>${product.name}</h3>
                    <p><strong>Brand:</strong> ${product.brand}</p>
                    <p><strong>Price:</strong> $${product.price || 'N/A'}</p>
                    <img src="${product.image_link}" alt="${product.name}">
                    <p><strong>Description:</strong> ${product.description || 'N/A'}</p>
                    <p><strong>Rating:</strong> ${product.rating || 'N/A'}</p>
                    <p><strong>Type:</strong> ${product.product_type || 'N/A'}</p>
                    <a href="${product.product_link}" target="_blank">View Product</a>
                `;

                const addToWishlistBtn = document.createElement('button');
                addToWishlistBtn.innerText = "Add to Wishlist";
                addToWishlistBtn.onclick = () => addToWishlist(product);
                productDiv.appendChild(addToWishlistBtn);

                productContainer.appendChild(productDiv);
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            document.getElementById('productContainer').innerHTML = "Error fetching recommendations. Please try again.";
        });
}
