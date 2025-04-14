// src/pages/ClosetPage.jsx
import React, { useState } from 'react';
import './ClosetPage.css';

const apparelData = {
  Dress: ['dress1.png', 'dress2.png'],
  Polos: ['polo1.png', 'polo2.png'],
  Pants: ['pants1.png', 'pants2.png'],
  Shorts: ['shorts1.png', 'shorts2.png'],
  Sweater: ['sweater1.png', 'sweater2.png'],
  TShirt: ['tshirt1.png', 'tshirt2.png'],
};

function ClosetPage({ onSelectApparel }) {
  const [selectedCategory, setSelectedCategory] = useState('Dress');
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSelectImage = (img) => {
    setSelectedImage(img);
    onSelectApparel(`/src/assets/closet/${selectedCategory.toLowerCase()}/${img}`);
  };

  return (
    <div className="closet-container">
      <h2 className="page-title">Closet</h2>

      {/* Category Tabs */}
      <div className="category-tabs">
        {Object.keys(apparelData).map((category) => (
          <button
            key={category}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Preview Grid */}
      <div className="apparel-grid">
        {apparelData[selectedCategory].map((img, index) => (
          <div
            key={index}
            className={`apparel-card ${selectedImage === img ? 'selected' : ''}`}
            onClick={() => handleSelectImage(img)}
          >
            <img
              src={`/src/assets/closet/${selectedCategory.toLowerCase()}/${img}`}
              alt={img}
              className="apparel-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClosetPage;
