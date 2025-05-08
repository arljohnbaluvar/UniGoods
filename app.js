(function() {
    const form = document.getElementById('product-form');
    const productList = document.getElementById('product-list');
    const modal = document.getElementById('product-modal');
    const modalTitle = modal.querySelector('#modal-title');
    const modalDesc = modal.querySelector('#modal-desc');
    const modalPrice = modal.querySelector('.price');
    const modalContact = modal.querySelector('.contact');
    const modalCloseBtn = modal.querySelector('.close-btn');
    
    // New buy button in modal
    let modalBuyBtn = modal.querySelector('.buy-btn');
  
    // Store products in array for reference
    const products = [];
  
    function createProductItem(product, idx) {
      const li = document.createElement('li');
      li.tabIndex = 0;
      li.className = 'product-item';
      
      li.setAttribute('data-idx', idx);
      li.setAttribute('role', 'button');
      li.setAttribute('aria-label', product.name + ', Price $' + parseFloat(product.price).toFixed(2) + '. Click for details.');
  
      // Container for text info (left side)
      const infoDiv = document.createElement('div');
      infoDiv.style.display = 'inline-block';
      infoDiv.style.width = '68%';
      infoDiv.style.verticalAlign = 'top';
  
      const title = document.createElement('div');
      title.className = 'title';
      title.textContent = product.name;
      infoDiv.appendChild(title);
  
      const desc = document.createElement('div');
      desc.className = 'description';
      desc.textContent = product.description.length > 60 ? product.description.substring(0, 57) + '...' : product.description;
      infoDiv.appendChild(desc);
  
      const priceEl = document.createElement('div');
      priceEl.className = 'price';
      priceEl.textContent = '$' + parseFloat(product.price).toFixed(2);
      infoDiv.appendChild(priceEl);
  
      const contactEl = document.createElement('div');
      contactEl.className = 'contact';
      contactEl.textContent = 'Contact: ' + product.contact;
      infoDiv.appendChild(contactEl);
  
      li.appendChild(infoDiv);
  
      // Buy button container (right side)
      const buyDiv = document.createElement('div');
      buyDiv.style.display = 'inline-block';
      buyDiv.style.width = '30%';
      buyDiv.style.verticalAlign = 'top';
      buyDiv.style.textAlign = 'right';
  
      const buyBtn = document.createElement('button');
      buyBtn.textContent = 'Buy';
      buyBtn.className = 'buy-btn-list';
      buyBtn.setAttribute('aria-label', 'Buy ' + product.name);
      buyBtn.type = 'button';
      // Prevent click on buy from opening modal
      buyBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        buyProduct(idx);
      });
      buyDiv.appendChild(buyBtn);
  
      li.appendChild(buyDiv);
  
      // Add click event to open modal with full details (only on li, not buy button)
      li.addEventListener('click', function() { openModal(idx); });
      li.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(idx);
        }
      });
  
      return li;
    }
  
    function clearProducts() {
      while(productList.firstChild) {
        productList.removeChild(productList.firstChild);
      }
    }
  
    function renderProductList() {
      clearProducts();
      if (products.length === 0) {
        const placeholder = document.createElement('li');
        placeholder.tabIndex = 0;
        placeholder.setAttribute('aria-label', 'No products listed yet');
        placeholder.textContent = 'No products listed yet. Be the first to add one!';
        productList.appendChild(placeholder);
        console.log('No products to display yet.');
      } else {
        products.forEach(function(prod, idx) {
          const item = createProductItem(prod, idx);
          productList.appendChild(item);
        });
        console.log('Rendered ' + products.length + ' product(s).');
      }
    }
  
    // Buy product helper function
    // Remove product at index and close modal if opened for that product
    function buyProduct(idx) {
      if (idx < 0 || idx >= products.length) return;
      alert('You have bought: ' + products[idx].name);
      
      products.splice(idx, 1);
      renderProductList();
  
      // If modal open for this product, close modal
      if (modal.classList.contains('active') && parseInt(modal.getAttribute('data-current-idx'), 10) === idx) {
        closeModal();
      }
    }
  
    function openModal(idx) {
      if (products[idx]) {
        const p = products[idx];
        modalTitle.textContent = p.name;
        modalDesc.textContent = p.description;
        modalPrice.textContent = 'Price: $' + parseFloat(p.price).toFixed(2);
        modalContact.textContent = 'Contact: ' + p.contact;
        modal.classList.add('active');
        modal.setAttribute('data-current-idx', idx);
        modalCloseBtn.focus();
        document.body.style.overflow = 'hidden';
  
        if (!modalBuyBtn) {
          modalBuyBtn = document.createElement('button');
          modalBuyBtn.type = 'button';
          modalBuyBtn.textContent = 'Buy';
          modalBuyBtn.className = 'buy-btn';
          modalBuyBtn.setAttribute('aria-label', 'Buy ' + p.name);
          modalBuyBtn.style.marginTop = '10px';
          modalCloseBtn.insertAdjacentElement('afterend', modalBuyBtn); // place after close button
  
          modalBuyBtn.addEventListener('click', function() {
            buyProduct(idx);
          });
        } else {
          modalBuyBtn.setAttribute('aria-label', 'Buy ' + p.name);
          modalBuyBtn.textContent = 'Buy';
          // Remove previous event listeners by cloning
          const newBuyBtn = modalBuyBtn.cloneNode(true);
          modalBuyBtn.parentNode.replaceChild(newBuyBtn, modalBuyBtn);
          modalBuyBtn = newBuyBtn;
          modalBuyBtn.addEventListener('click', function() {
            buyProduct(idx);
          });
        }
      }
    }
  
    function closeModal() {
      modal.classList.remove('active');
      modal.removeAttribute('data-current-idx');
      document.body.style.overflow = '';
      form.elements['prod-name'].focus();
    }
  
    modalCloseBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  
    form.addEventListener('submit', function(e) {
      e.preventDefault();
  
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const formData = new FormData(form);
      const product = {
        name: formData.get('prod-name').trim(),
        description: formData.get('prod-desc').trim(),
        price: formData.get('prod-price').trim(),
        contact: formData.get('prod-contact').trim()
      };
  
      console.log('Adding product:', product);
  
      products.push(product);
      renderProductList();
  
      form.reset();
      form.elements['prod-name'].focus();
    });
  
    // Initial render to show placeholder
    renderProductList();
  })();
